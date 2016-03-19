app.controller('organizationCtrl', function ($scope, $rootScope, $ionicLoading, $ionicScrollDelegate, $timeout, $filter, $state, ContactManager, MemberManager, ContactTreeManager, DepMembersManager, Api, XMPPClient) {
    //window.clearInterval($rootScope.refreshTimer);

    //$scope.organizations = ContactTreeManager.list();
    $scope.organizations={};
    var t = ContactTreeManager.initialize();
    t.then(function (result) {
        $scope.organizations = result;
    });

    $scope.myDeps={};
    $timeout(function () {
        $rootScope.$broadcast('ctrl:message:intervalstop',function(){});
        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><p>資料載入中,請稍後...</p>',
          showDelay: 0,
          noBackdrop:true,
        });
        getNew();
    }, 3);

    var getNew = function () {
        if(Object.keys($scope.organizations).length>0) {
            $ionicLoading.hide();
            return;
        }
        Api.getGroupList(function (data) {
            receiveData = data;
            for (var key in receiveData) {
                newData(receiveData[key]);
                var secondFloor = receiveData[key].children;
                for (var key2 in secondFloor) {
                    newData(secondFloor[key2]);
                    var thirdFloor = secondFloor[key2].children;
                    for (var key3 in thirdFloor) {
                        newData(thirdFloor[key3]);
                    }
                }
            }
            $scope.organizations = ContactTreeManager.list();
            $ionicLoading.hide();
            var deps=localStorage.deps.split(',');
            for(var key in deps){
                var item=ContactTreeManager.get(deps[key]);
                item.chat=true;
                ContactTreeManager.update(item);
                item=ContactTreeManager.get(item.parentId);
                item.chat=true;
                ContactTreeManager.update(item);
            }
            $ionicLoading.hide();
        });
    }

    var newData = function (data) {
        var haschild = true;
        if (Object.keys(data.children).length === 0) haschild = false;
        var item = {
            id: data.id,
            name: data.name,
            parentId: data.parentId,
            version: data.version,
            path: data.path,
            marked: false,
            open: false,
            chat:false,
            hasChild: haschild,
        };
        ContactTreeManager.add(item);
    }
    $scope.toggleGroup = function (item) {
        item.open = !item.open;
        //$ionicScrollDelegate.resize();
    }
    $scope.showItem = function (item) {
        if (item.parentId === null) return true;
        else {
            //  $ionicScrollDelegate.resize();
            return checkUp(item.parentId);
        }
    }
    $scope.toggleClick = function (item, $event) {
        item.marked = !item.marked;
        ContactTreeManager.update(item);
        if (item.marked) {
            var node = {
                id: item.id,
                parentId: item.parentId,
                name: item.name,
                type: 0,
                open: false,
                chat:item.chat,
                hasChild: item.hasChild
            }
            ContactManager.add(node);
            var group = ContactTreeManager.get(item.id);
            if (!group.hasChild) AddMember(item.id, item.name, group.version);
            else {
                var subList = ContactTreeManager.listById(item.id);
                for (var key in subList) {
                    AddMember(subList[key].id, subList[key].name, subList[key].version);
                }
            }
        }
        else ContactManager.remove(item.id, item.parentId);
        $event.stopImmediatePropagation();
    };

    var checkUp = function (id) {
        if (id === null) return true;
        var rootData = ContactTreeManager.get(id);
        var showhide = checkUp(rootData.parentId);
        if (!showhide) return false;
        else if (!rootData.open) return false;
        else if (rootData.open) return true;
    }

    var AddMember = function (DepId, depName, version) {
        var diff = false;
        Api.getDepVersion(DepId, version, function (data) {
            var receiveData = data;
            if (receiveData) diff = true;
        });
        Api.getMembers(DepId, localStorage.id, function (data) {
            var receiveData = data;
            for (var key in receiveData) {
                var item = {
                    id: receiveData[key].userInfo.id,
                    name: receiveData[key].userInfo.name,
                    email: receiveData[key].userInfo.email,
                    phoneNumber: receiveData[key].userInfo.phoneNumber,
                    userName: receiveData[key].userInfo.userName,
                    tel: receiveData[key].tel,
                    job: receiveData[key].job,
                    install: receiveData[key].userInfo.install,
                    parentId: receiveData[key].departmentId,
                    marked: false
                }
                XMPPClient.enroll(item, [depName]);
                MemberManager.add(item);
                if (diff) MemberManager.update(item);
                item = {};
                item = {
                    id: receiveData[key].userInfo.id,
                    job: receiveData[key].job,
                    tel: receiveData[key].tel,
                    parentId: receiveData[key].departmentId
                }
                DepMembersManager.add(item);
                if (diff) DepMembersManager.update(item);
            }
        });
    }

    $scope.href = function (item) {
        var group = ContactTreeManager.get(item.id);
        AddMember(item.id, item.name, group.version);
        $state.go("tab.peoplelist", { departmentId: item.id });
    }
    $scope.groupChat = function (item,$event) {
        var group = ContactTreeManager.get(item.id);
        AddMember(item.id, item.name, group.version);
        $event.stopImmediatePropagation();
        $state.go('tab.messageGroup', { depId: item.id });
    }
    $timeout(function () {
        $scope.$apply();
    }, 2000);
});