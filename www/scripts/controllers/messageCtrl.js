app.controller('messageCtrl', function ($http, $scope, $location, $stateParams, $timeout, $state, $ionicModal, $rootScope, MemberManager, MessageInfoManager, Api, DepMembersManager, RoomManager) {
    $scope.messageList = MessageInfoManager.list();
    $scope.getName = function (item) {
        var name = '';
        if (item.type == 1) {
            name = RoomManager.getName(item.id);
        }
        else if (item.type == 2) {
            name = MemberManager.getName(item.id);
            if (name === null) {
                Api.getOneMember(item.id, localStorage.id, function (data) {
                    var receiveData = data;
                    name = receiveData.userInfo.name;
                    var item = {
                        id: receiveData.userInfo.id,
                        name: receiveData.userInfo.name,
                        email: receiveData.userInfo.email,
                        phoneNumber: receiveData.userInfo.phoneNumber,
                        userName: receiveData.userInfo.userName,
                        tel: '',
                        job: '',
                        install: receiveData.userInfo.install,
                        parentId: '',
                        marked: false
                    }
                    for (var key in receiveData.jobTels) {
                        item.tel = receiveData.jobTels[key].tel;
                        item.job = receiveData.jobTels[key].job;
                        item.parentId = receiveData.jobTels[key].departmentId;
                        MemberManager.add(item);
                        var depName = {
                            id: receiveData.userInfo.id,
                            job: receiveData.jobTels[key].job,
                            tel: receiveData.jobTels[key].tel,
                            parentId: receiveData.jobTels[key].departmentId
                        }
                        DepMembersManager.add(depName);
                    }
                });
            }
        }
        if(name!='') name=name.split(':')[0];
        return name;
    }
    var AddMember = function (id) {
        Api.getOneMember(id, localStorage.id, function (data) {
            var receiveData = data;
            var item = {
                id: receiveData.userInfo.id,
                name: receiveData.userInfo.name,
                email: receiveData.userInfo.email,
                phoneNumber: receiveData.userInfo.phoneNumber,
                userName: receiveData.userInfo.userName,
                tel: '',
                job: '',
                install: receiveData.userInfo.install,
                parentId: '',
                marked: false
            }
            for (var key in receiveData.jobTels) {
                item.tel = receiveData.jobTels[key].tel;
                item.job = receiveData.jobTels[key].job;
                item.parentId = receiveData.jobTels[key].departmentId;
                MemberManager.add(item);
                var depName = {
                    id: receiveData.userInfo.id,
                    job: receiveData.jobTels[key].job,
                    tel: receiveData.jobTels[key].tel,
                    parentId: receiveData.jobTels[key].departmentId
                }
                DepMembersManager.add(depName);
            }
        });
    }

    $scope.href = function (id) {
        $state.go('tab.chat', { toId: id });
    }
});