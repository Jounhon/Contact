app.controller('messageSingleCtrl', function (XMPPClient, $interval,$http, $scope, $location, $ionicPopup,$stateParams, $ionicScrollDelegate, $timeout, $state, $ionicModal, $rootScope, MemberManager, ContactTreeManager, Api, SelfDetailManager, MessageInfoManager, MessageManager) {
    //Api.getPositionByDepMem($scope.peo.depId,$scope.peo.memId,function(){});
    var departmentId = parseInt($stateParams.depId);
    var membertId = $stateParams.memberId;
    ///state variable
    $scope.state = 'active';
    var readAll = function(){
        var messageinfo = MessageInfoManager.get(membertId);
        if (!messageinfo)
            return;

        messageinfo = {
            id: messageinfo.id,
            lastmessage: messageinfo.lastmessage,
            laststamp: messageinfo.laststamp,
            unreadcount: 0,
            readstamp: messageinfo.readstamp,
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
        XMPPClient.sendState(membertId, state);
        console.log("readAll");
    };

    $scope.msg = {
        message: ''
    };
    $scope.divName = 'chat';
    $scope.people = MemberManager.get(departmentId, membertId);
    var root = ContactTreeManager.get(departmentId);
    $scope.myself = SelfDetailManager.get(localStorage.id);
    $scope.getMessages = function () {
        var messages = MessageManager.get($scope.people.id);
        var array = [];

        for (var key in messages) {
            var message = messages[key];
            array.push(message);
        }
        return array;
    };
    $scope.depName = {};
    var getLevel = function (parentId) {
        var count = 0;
        var rootId = parentId;
        while (rootId != null) {
            var root = ContactTreeManager.get(rootId);
            rootId = root.rootId;
            count++;
        }
        return count;
    };

    var count = getLevel(departmentId);
    while (root.parentId != null) {
        $scope.depName[count] = root.name;
        count--;
        root = ContactTreeManager.get(root.parentId);
    }
    $scope.showIcon = function (index) {
        if (index >= Object.keys($scope.depName).length) return false;
        else return true;
    };

    $scope.open = true;

    $scope.toggleMember = function () {
        $scope.open = !$scope.open;
    };

    $scope.mode = 0;
    //To array
    $scope.info = {
        phone: [],
        name: [],
        email: []
    };
    $scope.email = {
        subject: '',
        message: ''
    };

    $scope.send = function (subject, message) {//sendMail
        $scope.info.name[0] = $scope.people.name;
        $scope.info.email[0] = $scope.people.email;
        console.log('send function : ' + $scope.info.name[0], $scope.info.email[0], $scope.myself.name, $scope.myself.email, $scope.email.subject, $scope.email.message);
        Api.sendphone($scope.info.name, $scope.info.email, $scope.myself.name, $scope.myself.email, $scope.email.subject, $scope.email.message, function () {
            $scope.email.subject = '';
            $scope.email.message = '';
        });
    };


    
    $scope.select = function (name) {
        $scope.divName = name;
    };
    $scope.showDiv = function (name) {
        return $scope.divName === name;
    };

    $scope.toggleMember = function () {//展開列表改值
        $scope.open = !$scope.open;
        $ionicScrollDelegate.resize();
        //if (!$scope.open) $ionicScrollDelegate.scrollBottom(true);
    };

    $scope.checkTF = function () {//展開列表給值
        return $scope.open === true;
    };

    $scope.href = function (url) {//phone & tel
        window.open(url, '_system');
    };

    $scope.sendInvitation = function () {
        $scope.info.phone[0] = $scope.people.id;
        console.log('sendInvitation function : ' + $scope.info.phone);
        Api.sendInvitation($scope.info.phone, function () {
        });
    };

    //upload
    $scope.addcontact = function () {
        var contact = navigator.contacts.create();

        var name = new ContactName();
        name.givenName = $scope.people.name;
        contact.name = name;

        contact.organizations = [new ContactOrganization(false, null, $scope.depName[1] + '  ' + $scope.people.job, null, null)];
        contact.phoneNumbers = [new ContactField('mobile', $scope.people.phoneNumber, false), new ContactField('work', '0227712717,' + $scope.people.tel, false)];
        contact.emails = [new ContactField("work", $scope.people.email, false)];

        contact.save(function () { }, function () { alert("Error = " + contactError.code); });
        // console.log(contact);
        var myPopup = $ionicPopup.show({
            title: '已匯出',
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 1000);
    };

    $scope.sms = {
        subject: '',
        message: ''
    };
    $scope.sendSms = function (subject, message) {
        $scope.info.phone[0] = $scope.people.phoneNumber;
        console.log('sendSms function : ' + $scope.info.phone[0], $scope.sms.subject, $scope.sms.message);
        Api.sendSMSMessage($scope.info.phone, $scope.sms.subject, $scope.sms.message, function () {
            $scope.sms.subject = '';
            $scope.sms.message = '';
        });
    }

    $rootScope.$on('ctrl:message:refresh', function (event, data) {
        if (data.oldUserId == membertId && data.parentId == departmentId) {
            $state.go('tab.peoplelist', { departmentId: data.parentId });
        }
        $scope.sendState($scope.state);
    });

    $scope.snedMessage = function () {
        if ($scope.msg.message == '')
            return;

        var type = 0;
        var stamp = JSON.parse(JSON.stringify(new Date()));
        var id = XMPPClient.sendMessage($scope.people.id, $scope.msg.message);

        var message = {
            uuid:id,
            id: $scope.people.id,
            department:$scope.people.parentId,
            message: $scope.msg.message,
            stamp: stamp,
            state: 0,
            type: type
        };
        MessageManager.add(message);
        var messageInfo = {
            id: $scope.people.id,
            lastMessage: $scope.msg.message,
            lastStamp: stamp,
            unreadCount: 0,
            type: 2
        };
        MessageInfoManager.add(messageInfo);
        $scope.sendState($scope.state);
        $scope.msg.message = "";
        $('#messageInput').focus();
        $ionicScrollDelegate.scrollBottom(true);
    }
    $rootScope.$on('ctrl:message:toButton', function (event) {
        if($state.is("tab.messageSingle")) $ionicScrollDelegate.scrollBottom(true);
    });
    
    $scope.sendState($scope.state);
    readAll();
})
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

