app.controller('organizationCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $filter, $state, DBInitManager,ContactTreeManager,memberDetailManager,ContactManager) {
    //window.clearInterval($rootScope.refreshTimer);

    $scope.organizations=ContactTreeManager.list();
    $scope.root={
        id:-1,
        name:"北科資工"
    }
     $timeout(function () {
        getNew();
    }, 3);
    
    var getNew=function(){
        if(Object.keys($scope.organizations).length===0){
            var data=DBInitManager.getData();
            var count=1;
            for(var key in data){
                var treeData=TreeData(count,data[key].type,key,0);
                ContactTreeManager.add(treeData);
                if(data[key].type==="people"){
                    var memData=MemData(count,data[key]);
                    memberDetailManager.add(memData);
                    continue;
                }
                var data2=data[key].sub;
                var root=count;
                for(var key2 in data2){
                    count++;
                    var treeData=TreeData(count,data2[key2].type,key2,root);
                    ContactTreeManager.add(treeData);
                    if(data2[key2].type==="people"){
                        var memData=MemData(count,data2[key2]);
                        memberDetailManager.add(memData);
                        continue;
                    }
                    var data3=data2[key2].sub;
                    var root2=count;
                    for(var key3 in data3){
                        count++;
                        var treeData=TreeData(count,data3[key3].type,key3,root2);
                        ContactTreeManager.add(treeData);
                        if(data3[key3].type==="people"){
                            var memData=MemData(count,data3[key3]);
                            memberDetailManager.add(memData);
                            continue;
                        }
                    }
                }
            }
        }
        $scope.organizations=ContactTreeManager.list();
    }
    var TreeData=function(Id,Type,Name,RootId){
        var temp={
            id:Id,
            type:Type,
            name:Name,
            marked:false,
            open:false,
            rootId:RootId
        }
        return temp;       
    }
    var MemData=function(Id,data){
        var temp={
            id:Id,
            phone:data.phone,
            tel:data.tel,
            email:data.email,
            marked:false,
        }
        return temp;       
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
            var root=ContactTreeManager.getRoot(rootId);
            rootId=root.rootId;
            count++;
        }
        return count;
    }
    $scope.isGroup=function(item){
        return item.type==="group";
    }
    $scope.toggleGroup=function(item){
        if(item.type==="group") item.open=!item.open;
        else if(item.type==="people"){
            item.marked=!item.marked;
            change_down(item.id,item);
            check_up(item.rootId);
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
        var rootData=ContactTreeManager.getRoot(id);
        var showhide=checkUp(rootData.rootId);
        if(!showhide) return false;
        else if(!rootData.open) return false;
        else if(rootData.open) return true;
        
    }
    
    $scope.toggleClick = function(item,$event) {
        change_down(item.id,item);
        check_up(item.rootId);
        $event.stopImmediatePropagation();
    };
    var change_down=function(id,item){
        ContactTreeManager.changeMark(item);
        var list=ContactTreeManager.listById(id);
        var AddRoot=false;
        if(item.marked){
            ContactManager.add(item);
        }
        else ContactManager.remove(item);
        for(var key in list){
            list[key].marked=item.marked;
            ContactTreeManager.changeMark(list[key]);
            if(list[key].marked){
                ContactManager.add(list[key]);
                AddRoot=true;
            }else{
                ContactManager.remove(list[key]);
                ChangeOrNot=false;
            }
            change_down(list[key].id, item);
        }
        rootId=item.rootId;
        while(rootId!=0){
            var rootData=ContactTreeManager.getRoot(rootId);
            if(AddRoot||item.marked){
                ContactManager.add(rootData);
            }
            else{
                var sameLevelList=ContactTreeManager.listById(rootId);
                var del=true;
                for(var key in sameLevelList){
                    if(sameLevelList[key].marked) del=false;
                }
                if(del) ContactManager.remove(rootData);
            }
            rootId=rootData.rootId;
        }
        return ;
    }
    var check_up=function(id){
        if(id===0) return;
        var sameLevelList=ContactTreeManager.listById(id);
        var changeRoot=true;
        for(var key in sameLevelList){
            if(sameLevelList[key].marked===false) changeRoot=false;
        }
        var root=ContactTreeManager.getRoot(id);
        root.marked=changeRoot;
        ContactTreeManager.changeMark(root);
        check_up(root.rootId);
    }
    
    $timeout(function () {
        $scope.$apply();
    }, 2000);

    //$rootScope.refreshTimer = window.setInterval(getNewIndustries, 3000);
    

});