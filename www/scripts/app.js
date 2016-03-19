/// <reference path="ionic.bundle.js" />

var app = angular.module('Practice', ['ionic', 'indexedDB', 'angular.filter', 'Strophe.plugin', 'tabSlideBox'])
    .run(function ($q, $window, $rootScope, $state, $timeout, $ionicPlatform, $ionicLoading, ContactTreeManager, MemberManager, DepMembersManager, ContactManager, SelfDetailManager, Api, XMPPClient,RoomManager,MessageInfoManager ) {
        var preUrl = null;
        //寫死假資料\
        localStorage.phone = "0938590041";
        function login() {
            //登入狀態
            /*  status code
            Status.ERROR    An error has occurred
            Status.CONNECTING    The connection is currently being made
            Status.CONNFAIL    The connection attempt failed
            Status.AUTHENTICATING   The connection is authenticating
            Status.AUTHFAIL The authentication attempt failed
            Status.CONNECTED    The connection has succeeded
            Status.DISCONNECTED The connection has been terminated
            Status.DISCONNECTING    The connection is currently being terminated
            Status.ATTACHED The connection has been attached
            */
            if (!XMPPClient.onConnect) {
                XMPPClient.onConnect = function (status, condition, reconnect) {

                    console.log('onConnect: ' + status);
                    if ((status === Strophe.Status.CONNECTED) || (status === Strophe.Status.ATTACHED)) {
                        if ((typeof reconnect !== 'undefined') && (reconnect)) {
                            console.log(status === Strophe.Status.CONNECTED ? 'Reconnected' : 'Reattached');
                        } else {
                            console.log(status === Strophe.Status.CONNECTED ? 'Connected' : 'Attached');
                            XMPPClient.send($pres());
                            XMPPClient.connection.roster.get(function () { });
                            RoomManager.nick = localStorage.phone;

                            XMPPClient.connection.muc.listRooms('chatroom.iweb.csie.ntut.edu.tw', function (rooms) { 
                        
                                angular.forEach(rooms, function(room) { 
                                //將房間存入indexedDB
                                    RoomManager.add(room);

                                    var messageInfo = MessageInfoManager.get(room.id);
                                    var lastStamp = null;
                                    if (messageInfo) {
                                       lastStamp = JSON.parse(JSON.stringify(messageInfo.lastStamp));
                                    } 
                                   else {
                                        var messageInfo = {
                                            id: room.id,
                                            lastMessage:'',
                                            lastStamp:lastStamp,
                                            unreadCount:0,
                                            type: 1 //群聊
                                        };
                                        MessageInfoManager.add(messageInfo);
                                        lastStamp = JSON.parse(JSON.stringify(new Date(0)));
                                     }
                                //加入房間，since: lastStamp 可以讀取到歷史訊息從何時開始
                                    XMPPClient.connection.muc.join(room.jid, RoomManager.nick, null, null, null, null, { since: lastStamp });             
                                //查詢房天成員關係是owener(我們是將所有人設為owner)
                                    XMPPClient.connection.muc.queryAffiliationMembers(room.jid, 'owner', function (members) { 
                                        room.members = members;
                                        Api.getRoomMember(room.members,localStorage.id, function (data) {
                                            var receiveData=data;
                                            for(var key in receiveData){
                                                for(var key2 in receiveData[key].jobTels){
                                                    var item = {
                                                        id: receiveData[key].userInfo.id,
                                                        name: receiveData[key].userInfo.name,
                                                        email: receiveData[key].userInfo.email,
                                                        phoneNumber: receiveData[key].userInfo.phoneNumber,
                                                        userName: receiveData[key].userInfo.userName,
                                                        tel: receiveData[key].jobTels[key2].tel,
                                                        job: receiveData[key].jobTels[key2].job,
                                                        install: receiveData[key].userInfo.install,
                                                        parentId: receiveData[key].jobTels[key2].departmentId,
                                                        marked: false
                                                    }
                                                    MemberManager.add(item);
                                                    var depName = {
                                                        id: receiveData[key].userInfo.id,
                                                        job: receiveData[key].jobTels[key2].job,
                                                        tel: receiveData[key].jobTels[key2].tel,
                                                        parentId: receiveData[key].jobTels[key2].departmentId
                                                    }
                                                    DepMembersManager.add(depName);
                                                }
                                            }
                                        });
                                    });  

                                });   
                            });


                        }
                    } else if (status === Strophe.Status.DISCONNECTED) {
                        if (converse.auto_reconnect) {
                            login();
                        }
                    }
                };
            }
            XMPPClient.login(localStorage.id);
        }

        window.handleOpenURL = function (url) {
            setTimeout(function () {
                if (url && url != preUrl) {
                    preUrl = url;
                    var arr = url.split('/');
                    if (arr.length >= 3) {
                        switch (arr[2]) {
                            case 'auth':
                                var token = arr[3];

                                Api.getPhone(token, function (phone) {
                                    localStorage.phone = phone;

                                    Api.getMyMemberInfo(localStorage.phone, function (data) {
                                        localStorage.id = data.userInfo.id;
                                        receiveData = data;
                                        var tels = [];
                                        for (var key in receiveData.jobTels) {
                                            tels.push(receiveData.jobTels[key].tel);
                                        }
                                        console.log(tels);
                                        var item = {
                                            id: receiveData.userInfo.id,
                                            name: receiveData.userInfo.name,
                                            topNode: receiveData.userInfo.topNode,
                                            email: receiveData.userInfo.email,
                                            phoneNumber: receiveData.userInfo.phoneNumber,
                                            userName: receiveData.userInfo.userName,
                                            tel: tels,
                                            radioNode: {},
                                            checkNode: {},
                                        }
                                        SelfDetailManager.add(item);
                                        Api.install(localStorage.id);
                                        Api.getMemberDepIds(localStorage.id, function (data) {
                                            receiveData = data;
                                            var deps=[];
                                            for (var key in receiveData) {
                                                var item = {
                                                    id: receiveData[key].userId,
                                                    job: receiveData[key].job,
                                                    tel: receiveData[key].tel,
                                                    parentId: receiveData[key].departmentId
                                                };
                                                deps.push(receiveData[key].departmentId);
                                                DepMembersManager.add(item);
                                            }
                                            localStorage.deps=deps;
                                        });
                                        login();
                                    });

                                });
                                break;
                        }
                    }
                }
            }, 2000);
        }

        $ionicPlatform.ready(function () {
            if (localStorage.phone) {
                Api.getMyMemberInfo(localStorage.phone, function (data) {
                    localStorage.id = data.userInfo.id;
                    receiveData = data;
                    var tels = [];
                    for (var key in receiveData.jobTels) {
                        tels.push(receiveData.jobTels[key].tel);
                    }
                    var item = {
                        id: receiveData.userInfo.id,
                        name: receiveData.userInfo.name,
                        topNode: receiveData.userInfo.topNode,
                        email: receiveData.userInfo.email,
                        phoneNumber: receiveData.userInfo.phoneNumber,
                        userName: receiveData.userInfo.userName,
                        tel: tels,
                        radioNode: {},
                        checkNode: {}
                    }
                    login();
                    SelfDetailManager.add(item);
                    Api.getMemberDepIds(localStorage.id, function (data) {
                        receiveData = data;
                        var deps=[];
                        for (var key in receiveData) {
                            var item = {
                                id: receiveData[key].userId,
                                job: receiveData[key].job,
                                tel: receiveData[key].tel,
                                parentId: receiveData[key].departmentId
                            };
                            deps.push(receiveData[key].departmentId);
                            DepMembersManager.add(item);
                        }
                        localStorage.deps=deps;
                    });

                });
            } else {
                setTimeout(function () {
                    window.open('http://iweb.csie.ntut.edu.tw/school/launchApp.html', '_system');
                }, 3000);
            }

            if (window.plugins && window.plugins.webintent) {
                window.plugins.webintent.getUri(handleOpenURL);
                window.plugins.webintent.onNewIntent(handleOpenURL);
            }
        });

    })

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $indexedDBProvider) {
    //$ionicConfigProvider.views.maxCache(0);

    $stateProvider
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "views/tab.html"
        })
        .state('tab.organization', {
            url: '/organization',
            views: {
                'tab-organization': {
                    templateUrl: "views/organization.html",
                    controller: "organizationCtrl"
                }
            }
        })
        .state('tab.peoplelist', {
            url: "/people/:departmentId",
            views: {
                'tab-organization': {
                    templateUrl: "views/peoplelist.html",
                    controller: "peoplelistCtrl"
                }
            }
        })
        .state('tab.contact', {
            url: '/contact',
            views: {
                'tab-contact': {
                    templateUrl: "views/contact.html",
                    controller: "contactCtrl"
                }
            }
        })
        .state('tab.buildRoom', {
            url: '/buildRoom',
            views: {
                'tab-contact': {
                    templateUrl: "views/buildRoom.html",
                    controller: "buildRoomCtrl"
                }
            }
        })
        .state('tab.message', {
            url: '/message',
            views: {
                'tab-message': {
                    templateUrl: "views/message.html",
                    controller: "messageCtrl"
                }
            }
        })
        .state('tab.chat', {
            url: '/chat/:toId',
            views: {
                'tab-message': {
                    templateUrl: "views/chat.html",
                    controller: "chatCtrl"
                }
            }
        })
        .state('tab.messageSingle', {
            url: '/messageSingle/:depId/:memberId',
            views: {
                'tab-message': {
                    templateUrl: "views/messageSingle.html",
                    controller: "messageSingleCtrl"
                }
            }
        })
        .state('tab.messageGroup', {
            url: '/messageGroup/:depId',
            views: {
                'tab-message': {
                    templateUrl: "views/messageGroup.html",
                    controller: "messageGroupCtrl"
                }
            }
        })
        .state('tab.setting', {
            url: "/setting",
            views: {
                'tab-setting': {
                    templateUrl: "views/setting.html",
                    controller: "settingCtrl"
                }
            }
        })
    ;

    $urlRouterProvider.otherwise('/tab/organization');
    $ionicConfigProvider.tabs.position('bottom');

    $indexedDBProvider
       .connection('Contact_indexedDB')
       .upgradeDatabase(1, function (event, db, tx) {
           var objStore;
           objStore = db.createObjectStore('ContactTree', { keyPath: 'id', autoIncrement: true });
           objStore = db.createObjectStore('Contact', { keyPath: ['id', 'parentId'] });
           objStore = db.createObjectStore('Members', { keyPath: ['id', 'parentId'] });
           objStore = db.createObjectStore('DepMembers', { keyPath: ['id', 'parentId'] });
           objStore = db.createObjectStore('SelfDetail', { keyPath: 'id', autoIncrement: true });
           objStore = db.createObjectStore('messageInfos', { keyPath: 'id', autoIncrement: true });
           objStore = db.createObjectStore('messages', { keyPath: 'uuid' });
           objStore.createIndex('id', 'id', { unique: false });
           objStore.createIndex('id, state', ['id', 'state'], { unique: false });
       });

});

