app.controller('messageGroupCtrl', function ($http, $scope, $location, $stateParams,$ionicPopup, $ionicScrollDelegate, $timeout, $state, $ionicModal, $rootScope, MemberManager, ContactTreeManager, Api,RoomManager ,XMPPClient,MessageInfoManager,MessageManager   ) {
    var departmentId = parseInt($stateParams.depId);
    $scope.root = ContactTreeManager.get(departmentId);
    $scope.roomName=$scope.root.name;
    if(!$scope.root.hasChild){
        var parentRoot=ContactTreeManager.get($scope.root.parentId);
        $scope.roomName=parentRoot.name+" "+$scope.root.name;
    }
    $scope.people = [];
    $scope.BoxName = 'chat';
    $scope.room = RoomManager.checkName($scope.root.name);
    //XMPPClient.connection.pubsub.deleteNode('complete',function(){console.log('delete success!')});
    /*XMPPClient.connection.pubsub.createNode('complete',{
        "pubsub#persist_items":1,
        "pubsub#access_model":'open'
        },function(result){
            console.log(result);
    });
    XMPPClient.connection.pubsub.items('shit',function(data){
        console.log(data);
    },function(data){
        console.log("success");
        console.log(data);
    });
    var arr = {data:"today is a good day to die"};
    var arrr = {data:"Yesterday was a good day to die"};
    XMPPClient.connection.pubsub.publishAtom('complete',arr,function(result){
        console.log(result);
    });
    XMPPClient.connection.pubsub.publishAtom('complete',arr,function(result){
        console.log(result);
    });*/
    /*XMPPClient.connection.pubsub.subscribe('willy',{},function(result){
        console.log('welcome !');
        console.log(result);
    },function(data){
        console.log(data);
    },function(result){
        console.log("Error");
        console.log(result);
    },1);*/

    // XMPPClient.connection.pubsub.items('willy',function(result){
    //     console.log('onSuccess');
    //     console.log(result);
    // },function(result){
    //     console.log(result);
    // });

    /*XMPPClient.connection.pubsub.setAffiliation('eric',"2008@iweb.csie.ntut.edu.tw" ,"owner",function(result){
        console.log(result);
    });*/
    //     XMPPClient.connection.pubsub.getConfig('complete',function(result){console.log(result)});
    // $scope.messageList = [];
    //     $scope.info = {
    //     phone: [],
    //     name: [],
    //     email: []
    // };
    $scope.getMessages = function (id) {
        var messages = MessageManager.get(id);
        var array = [];
       // console.log(messages);
        for (var key in messages) {
            var message = messages[key];
            array.push(message);
        }
        return array;
    };
    $timeout(function () {
        $ionicScrollDelegate.$getByHandle('ChatScroll').scrollBottom(false);
        getList();
    }, 3);
    var getList=function(){
        $scope.room = RoomManager.checkName($scope.root.name+":"+$scope.root.id);
        $scope.messageList = $scope.getMessages($scope.room.id);
    }
    $scope.msg = {
        message: ''
    };
    $scope.openList = true;
    $scope.showList = function () {
        $scope.openList=!$scope.openList
    }
    $scope.openInsert=false;
    $scope.showInset = function () {
        $scope.openInsert=!$scope.openInsert
    }

    $scope.slice = function (input, itemsPerRow) {
        if (itemsPerRow === undefined) {
            itemsPerRow = 1;
        }
        var out = [];
        for (var i = 0; i < Object.keys(input).length; i++) {
            var colIndex = i % itemsPerRow;
            var rowIndex = parseInt(i / itemsPerRow);
            if (colIndex === 0) {
                row = [];
                out[rowIndex] = row;
            } else {
                row = out[rowIndex];
            }
            row[colIndex] = input[i];
        }
        return out;
    }
    $timeout(function () {
        $scope.people = $scope.slice($scope.people, 4);
    }, 1000);
    

    $scope.selectBox = function (name) {
        return $scope.BoxName === name;
    }
    $scope.changeBox = function (name) {
        $scope.BoxName = name;
        $ionicScrollDelegate.resize();
        //$ionicScrollDelegate.scrollBottom(true);
        if(name=='bulletin') {
            $scope.openInsert=false;
            $ionicScrollDelegate.$getByHandle('BulletinScroll').scrollTop(false);
        }
    }
    
    $scope.getName = function (id) {
        return MemberManager.getName(id);
    }
    $scope.snedMessage = function () {
        if ($scope.msg.message == '')
            return;
        
        XMPPClient.sendMucMessage($scope.room.id,$scope.msg.message);
        var type = 0;
        var stamp = JSON.parse(JSON.stringify(new Date()));
        var messageInfo = {
            id: $scope.room.id,
            lastMessage: $scope.msg.message,
            lastStamp: stamp,
            unreadCount: 0,
            type: 1
        };

        MessageInfoManager.add(messageInfo);
        //$scope.sendState($scope.state);
        $scope.messageList = $scope.getMessages($scope.room.id);
        $scope.msg.message = "";
        $('#messageInput').focus();
        $ionicScrollDelegate.scrollBottom(true);
    }

    $scope.pubsub = function () {
        if ($scope.msg.pubsub == '')
            return;
        XMPPClient.sendMucMessage($scope.room.id, $scope.msg.pubsub,'pubsub');
        var type = 3;
        var stamp = JSON.parse(JSON.stringify(new Date()));
        $scope.messageList = $scope.getMessages($scope.room.id);
        $scope.msg.pubsub = "";
        $scope.openInsert=false;
         $ionicScrollDelegate.scrollTop(true);
    }

    $timeout(function () {
        $scope.$apply();
    }, 2000);

    $rootScope.$on('ctrl:message:toButton', function (event) {
        $scope.messageList = $scope.getMessages($scope.room.id);
        if($state.is("tab.messageGroup")) $ionicScrollDelegate.$getByHandle('ChatScroll').scrollBottom(true);
    });

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    $scope.addcontact = function () {
        function onSuccess(contact) {
        };

        function onError(contactError) {
            alert("Error = " + contactError.code);
        };
        var tempMembers=[];
        if($scope.root.hasChild){
            var subList = ContactTreeManager.listById($scope.root.id);
            for (var key in subList) {
                var person=MemberManager.listByDep(subList[key].id);
                 for (var key2 in person) {
                    tempMembers.push(person[key2]);
                }
            }
        }else{
             var person=MemberManager.listByDep($scope.root.id);
             for (var key in person) {
                tempMembers.push(person[key]);
            }
        }
        console.log(tempMembers);
        //tempMembers 為所有成員
        for(var key in tempMembers){
            // create a new contact object
            var contact = navigator.contacts.create();
            // specify both to support all devices
            contact.displayName = tempMembers[key].job;
            contact.nickname = tempMembers[key].job;

            var name = new ContactName();
            name.givenName = tempMembers[key].name.substring(1,4);
            name.familyName = tempMembers[key].name.substring(0,1);
            contact.name = name;
            var phone = [];
            phone[0] = new ContactField('work', '0227712717,' + tempMembers[key].tel, false);//worknumber insert
            if(tempMembers[key].phoneNumber){
                phone[1] = new ContactField('mobile', tempMembers[key].phoneNumber, false);//phone number insert
            }else{
                phone[1] = {};
            }
            contact.phoneNumbers = phone;
            var email = [];
            email[0] = new ContactField("work", tempMembers[key].email, false);//school number insert
            contact.emails = email;
            // save to device
            contact.save(onSuccess, onError);
            console.log(contact);
        }
        var myPopup = $ionicPopup.show({
            title: '已匯出',
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 1000);
    };
    $scope.href = function (url) {//phone & tel
        if($scope.root.hasChild){
            var subList = ContactTreeManager.listById($scope.root.id);
            for (var key in subList) {
                var person=MemberManager.listByDep(subList[key].id);
                 for (var key2 in person) {
                    url+=person[key2].email + ',';
                }
            }
        }else{
             var person=MemberManager.listByDep($scope.root.id);
             for (var key in person) {
                url+=person[key].email + ',';
            }
        }
        window.open(url, '_system');
    };
    $scope.sendInvitation = function () {
        var count=0;
        $scope.info.phone[0] = 0;
        if($scope.root.hasChild){
            var subList = ContactTreeManager.listById($scope.root.id);
            for (var key in subList) {
                var person=MemberManager.listByDep(subList[key].id);
                 for (var key2 in person) {
                    $scope.info.phone[count] = person[key2].id;
                    count++;
                }
            }
        }else{
             var person=MemberManager.listByDep($scope.root.id);
             for (var key in person) {
                $scope.info.phone[count] = person[key].id;
                count++;
            }
        }
        console.log('sendInvitation function : ' + $scope.info.phone);
        Api.sendInvitation($scope.info.phone, function () {});
    };

});

