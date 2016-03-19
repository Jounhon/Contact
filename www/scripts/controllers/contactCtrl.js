app.controller('contactCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $filter, $state,ContactManager) {
    //window.clearInterval($rootScope.refreshTimer);
    
    $scope.contactList=ContactManager.list();
    $scope.root={
        id:-1,
        name:"北科資工"
    }
    $scope.space=function(sel,item){
        var s='';
        if(sel===0){
            var levels=getLevel(item);
            for(var i=0;i<=levels;i++){
                for(var j=0;j<i;j++) s+='\xA0\xA0';
            };
            
        }
        else if(sel===1){
            if(item.type==="people") s='\xA0';
            else s='\xA0\xA0';
        }
        return s;   
    }
    var getLevel=function(item){
        var count=0;
        var rootId=item.rootId;
        while(rootId!=0){
            var root=ContactManager.getRoot(rootId);
            rootId=root.rootId;
            count++;
        }
        return count;
    }
    $scope.isGroup=function(item){
        return item.type==="group";
    }
    $scope.toggleGroup=function(item){
        item.open=!item.open;
        if(item.type==="people"){
            $state.go("tab.peopleDetail", { peoId:item.id });
        }
    }
    $scope.checkTF=function(item){
        return item.open===true;
    }
    $scope.showItem=function(item){
        if(item.rootId===0) return true;
        else{
            return checkUp(item.rootId);            
        }
    }
    var checkUp=function(id){
        if(id===0) return true;
        var rootData=ContactManager.getRoot(id);
        var showhide=checkUp(rootData.rootId);
        if(!showhide) return false;
        else if(!rootData.open) return false;
        else if(rootData.open) return true;
        
    }
    $timeout(function () {
        $scope.$apply();
    }, 2000);

    //$rootScope.refreshTimer = window.setInterval(getNewIndustries, 3000);

});