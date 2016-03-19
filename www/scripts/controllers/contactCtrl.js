app.controller('contactCtrl', function ($scope, $rootScope, $ionicScrollDelegate, $ionicLoading, $timeout, $filter, $state, ContactManager, MemberManager, DepMembersManager, ContactTreeManager, MessageInfoManager) {
    //window.clearInterval($rootScope.refreshTimer);
    
    $scope.contactList = ContactManager.list();
    $scope.localStorageId=localStorage.id;
    $scope.hasSignleList = ContactManager.hasSingle();
    $scope.showSignleList = false;
    $scope.isEmpty=function(){
        var list=ContactManager.list();
        if(Object.keys(list).length===0) return false;
        return true;
    }

    $scope.toggleSignle = function () {
        $scope.showSignleList = !$scope.showSignleList;
        $ionicScrollDelegate.resize();       
    }

    $scope.getDepNameJob = function (item) {
        var levels = 2;
        var root = ContactTreeManager.get(item.parentId);
        var deps = {},depNameJob='';
        while (root.parentId != null) {
            deps[levels--] = root.name;
            root = ContactTreeManager.get(root.parentId);
        }
        for (var key in deps) {
            depNameJob += deps[key] + "- ";
        }
        depNameJob += "\xA0\xA0\xA0\xA0" + item.name + " ";
        var job = DepMembersManager.get(item.id, item.parentId);
        depNameJob += job.job;
        return depNameJob;
    }

    $scope.getSubGroup = function (parentId) {
        return ContactTreeManager.listById(parentId);
    }
    $scope.getPeople = function (parentId) {
        return MemberManager.listByDep(parentId);
    }
    $scope.getRootName = function (parentId) {
        var root = ContactTreeManager.get(parentId);
        return root.name;
    }
    $scope.getJob = function (id, parentId) {
        var job = DepMembersManager.get(id, parentId);
        return job.job;
    }

    $scope.toggleGroup = function (item) {
        item.open = !item.open;
        $ionicScrollDelegate.resize();
    }
    
    $scope.href = function (memberid, depid) {
        $state.go('tab.messageSingle', { depId: depid, memberId: memberid });
    }
    $scope.groupChat = function (item) {
        $state.go('tab.messageGroup', { depId: item.id });
    }
    $rootScope.$on('ctrl:contact:refresh', function (event) {
        $scope.contactList = ContactManager.list();
        $scope.hasSignleList = ContactManager.hasSingle();
        $state.reload();
    });

    $timeout(function () {
        $scope.$apply();
    }, 2000);
    //$rootScope.refreshTimer = window.setInterval(getNewIndustries, 3000);

});