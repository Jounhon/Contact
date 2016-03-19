app.controller('buildRoomCtrl', function ($http, $scope, $location, $timeout, $filter, $state, $ionicModal, $rootScope, ContactManager, ContactTreeManager, MessageManager, MemberManager, MessageInfoManager, Api, XMPPClient, RoomManager) {
    
    $scope.tempMembers = {};
    $timeout(function () {
        getMembers();
    }, 3);
    var getMembers = function () {
        var contact = ContactManager.list();
        for (var key in contact) {
            if (!contact[key].hasChild && contact[key].type == 1) {
                addMember(contact[key]);
            } else if (!contact[key].hasChild && contact[key].type == 0) {
                var people = MemberManager.listByDep(contact[key].id);
                for (var key2 in people) {
                    if(people[key2].id===localStorage.id) continue;
                    addMember(people[key2]);
                }
            } else{
                var subGroup = ContactTreeManager.listById(contact[key].id);
                for (var key2 in subGroup) {
                    var people = MemberManager.listByDep(subGroup[key2].id);
                    for (var key3 in people) {
                        if(people[key3].id===localStorage.id) continue;
                        addMember(people[key3]);
                    }
                }
            }
        }
    }
    var addMember = function (item) {
        var temp = {
            id: item.id,
            name: item.name,
            isSelected: false,
        }
        if (!$scope.tempMembers[temp.id]) $scope.tempMembers[temp.id] = temp;
    }
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    $scope.createRoom = function () {
        if (!$scope.roomName) {
            alert("請輸入聊天室名稱");
            return;
        }

        var room = {
            jid: generateUUID() + '@chatroom.iweb.csie.ntut.edu.tw',
            name: $scope.roomName
        };
        RoomManager.add(room);
        XMPPClient.connection.muc.createInstantRoom(room.jid);//創建已有預設設定的房間
        XMPPClient.connection.muc.join(room.jid, RoomManager.nick, null, null, null, null, { since: '1970-01-01T00:00:00Z' });
        XMPPClient.connection.muc.setRoomName(room.jid, room.name, "自建聊天室");//市長修改房間設定
        // XMPPClient.jid我自己，代表房內目前只有我
        var members = [XMPPClient.jid];
        room.members = members;
        for (var key in $scope.tempMembers) {
            var member = $scope.tempMembers[key];
            console.log(member.name + member.isSelected);
            if (member.isSelected) {
                var receiver = member.id + '@iweb.csie.ntut.edu.tw';
                members.push(receiver);
                XMPPClient.connection.muc.directInvite(room.jid, room.name, receiver);
                XMPPClient.connection.muc.owner(room.jid, receiver);
                member.isSelected = false;
            }
        }

        XMPPClient.sendMucMessage(room.id, "我建立了這個聊天室");
        //存取訊息到localDB

        var stamp = JSON.parse(JSON.stringify(new Date()));

        var messageInfo = {
            id: room.jid.split('@')[0],
            type: 1   //群聊
        };
        MessageInfoManager.add(messageInfo);
        $state.go('tab.chat', { toId: room.id });
    }
});