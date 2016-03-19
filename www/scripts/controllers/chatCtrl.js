app.controller('chatCtrl', function ($http, $scope, $location, $stateParams, $ionicScrollDelegate, $timeout, $state, $ionicModal, $rootScope, MessageManager, MemberManager, MessageInfoManager, Api, XMPPClient, RoomManager) {
    var toId = $stateParams.toId;
    $scope.state = 'active';
    var Roomtype = function(){
        $scope.type = MessageInfoManager.getType(toId);
    }
    Roomtype();
    if ($scope.type === 2) $scope.Name = MemberManager.getName(toId);
    else if ($scope.type === 1) $scope.Name = RoomManager.getName(toId);
    $scope.Name=$scope.Name.split(":")[0];

    $scope.getName = function (id) {
        return MemberManager.getName(id);
    }

    var readAll = function(){
        var messageinfo = MessageInfoManager.get(toId);
        if (!messageinfo)
            return;

        messageinfo = {
            id: messageinfo.id,
            lastMessage: messageinfo.lastmessage,
            lastStamp: messageinfo.laststamp,
            unreadCount: 0,
            readStamp: messageinfo.readstamp,
            type: messageinfo.type
        };
        MessageInfoManager.add(messageinfo);
    }
    $scope.$on('xmpp:checkstates', function (event, data) {
        if ($scope.membertId != data.id)
            return;
        $scope.friendState = data.state;
        readAll();
    });
    $scope.sendState = function (state) {
        XMPPClient.sendState(toId, state);
    };

    $scope.msg = {
        message: ''
    };
    $timeout(function () {
        $ionicScrollDelegate.scrollBottom(false);
        readAll();
    }, 3);
    
    $scope.getMessages = function () {
        var messages = MessageManager.get(toId);
        var array = [];

        for (var key in messages) {
            var message = messages[key];
            array.push(message);
        }
        return array;
    };
    $scope.snedMessage = function () {
        if ($scope.msg.message == '')
            return;

        var type = 0;
        var stamp = JSON.parse(JSON.stringify(new Date()));
        if($scope.type===2){
            var id = XMPPClient.sendMessage(toId, $scope.msg.message);
        }else{
            var id = XMPPClient.sendMucMessage(toId, $scope.msg.message);
        }
        

        //var stamp = new Date

        var message = {
            uuid:id,
            id: toId,
            message: $scope.msg.message,
            stamp: stamp,
            state: 0,
            type: type//,
           // departmentid:departmentid
        };
        console.log("sendmessage " + message);
        MessageManager.add(message);
        var messageInfo = {
            id: toId,
            lastMessage: $scope.msg.message,
            lastStamp: stamp,
            unreadCount: 0,
            type: $scope.type
        };

        MessageInfoManager.add(messageInfo);
        $scope.sendState($scope.state);
        $scope.msg.message = "";
        $('#messageInput').focus();
        $ionicScrollDelegate.scrollBottom(true);
    }

    $scope.state = 'active';
    $scope.$on('xmpp:checkstates', function (event, data) {
        if ($scope.membertId != data.id)
            return;
        $scope.friendState = data.state;
        readAll();
    });
    $rootScope.$on('ctrl:message:toButton', function (event) {
        //$scope.sendState($scope.state);
        if($state.is("tab.chat"))  $ionicScrollDelegate.scrollBottom(true);
    });
    $scope.sendState($scope.state);
    readAll();

});

app.filter('dateFormat', function () {
    return function (dateString) {
        if (!dateString)
            return;
        return moment(dateString).format('hh:mm');
    };
});

app.filter('dateSorting', function () {
    return function (dateString) {
        if (!dateString)
            return moment("1970-01-01T00:00:00Z").format('YYYY-MM-DD HH:mm');
        return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
    };
});
