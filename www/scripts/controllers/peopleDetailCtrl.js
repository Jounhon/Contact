app.controller('peopleDetailCtrl', function ($scope, $rootScope, $ionicLoading, $timeout, $filter,ContactManager, memberDetailManager, $stateParams, $state) {
    //window.clearInterval($rootScope.refreshTimer);

    var peoId = $stateParams.peoId;
    $scope.people = memberDetailManager.get(peoId);
    
    var getLevel=function(item){
        var count=0;
        var rootId=item.rootId;
        while(rootId!=0){
            var root=ContactManager.getRoot(rootId);
            rootId=root.rootId;
            count++;
        }
        console.log(item.name+count);
        return count;
    }
    $scope.person=ContactManager.get(peoId);
    $scope.Level=getLevel($scope.person);
    $scope.depName={};
    var rootId=$scope.person.rootId;
    
    for(var i=$scope.Level-1;i>=0;i--){
        var root=ContactManager.getRoot(rootId);
        $scope.depName[i]=root.name;
        rootId=root.rootId;
    }
    
    $scope.showIon=function(index){
        if(index>=$scope.Level) return false;
        else return true;
    }
    
    
    $scope.href = function (url) {
        window.open(url, '_system');
    };
    
    $timeout(function () {
        $scope.$apply();
    }, 2000);

    //$rootScope.refreshTimer = window.setInterval(getNewIndustries, 3000);
    
});