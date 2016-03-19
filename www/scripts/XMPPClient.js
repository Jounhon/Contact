/// <reference path="app.js" />

app.factory('XMPPClient', function ($timeout, $rootScope, $ionicPlatform, $location, Api, MessageManager, MessageInfoManager, MemberManager, DepMembersManager, SelfDetailManager, ContactManager,RoomManager ) {
    var connection = null;
    try {
        // WebSocket
        connection = new Openfire.Connection("http://iweb.csie.ntut.edu.tw:7070/http-bind/");
    } catch (ex) {
        // BOSH
        connection = new Strophe.Connection("http://iweb.csie.ntut.edu.tw:7070/http-bind/");
    }

    var loginData = {
        user: null,
        password: null
    };

    var xmppClient = {
        connection: connection,
        login: function (userId) {
            loginData.user = userId;
            loginData.password = userId;
            xmppClient.domain = '@iweb.csie.ntut.edu.tw';
            xmppClient.jid = loginData.user + xmppClient.domain;
            xmppClient.chatRoomDomain = '@chatroom.iweb.csie.ntut.edu.tw';
            connection.connect(xmppClient.jid, loginData.password, this.onConnect);
        },
        jid: null,
        loginData: loginData,
        logout: function () {
            loginData.user = null;
            loginData.password = null;
            connection.disconnect();
        },
        onConnect: null,
        send: function (status) {
            connection.send(status);
        },

        sendState: function (to, state) {
            connection.chatstates.send(to + xmppClient.domain, state);
        },
        sendMessage: function (to, body) {
            return connection.message.send(to + xmppClient.domain, body);

        },
        addRoster: function (jid, name, group, call_back) {
            connection.roster.add(jid, name, group, call_back);
        },
        subscribe: function (jid, message) {
            connection.roster.subscribe(jid, message);
        },
        authorize: function (jid, message) {
            connection.roster.authorize(jid, message);
        },
        enroll: function (member, groups) {
            xmppClient.addRoster(member.id + "@iweb.csie.ntut.edu.tw", member.name, groups, function () { console.log("Added Roster"); });
            xmppClient.subscribe(member.id + "@iweb.csie.ntut.edu.tw");
        },
        publish:function(){
            connection.pubsub.publish(node,item);
        },
        sendMucMessage: function (to, body, type, payload) { 
            return connection.muc.groupchat(to + xmppClient.chatRoomDomain, body, null, payload,type);
        }
    };

    $rootScope.$on('xmpp:muc:invite', function (event, room) {
           console.log('xmpp:muc:invite');
           var id = room.jid.split('@')[0];
           
           if (!RoomManager.get(id)) {
               RoomManager.add(room);
               var lastStamp = JSON.parse(JSON.stringify(new Date(0)));
               connection.muc.join(room.jid, RoomManager.nick, null, null, null, null, { since: lastStamp });//¥[¤J©Ð¶¡
               
               connection.muc.queryAffiliationMembers(room.jid, 'owner', function (members) {//¨ú±o©Ð¶¡¦¨­û
                   room.members = members;
               });
               
               var messageInfo = {
                   id: room.id,
                   type: 1
               };
               MessageInfoManager.add(messageInfo);
               
               
               $timeout(function () {
                   $rootScope.$apply();
               }, 1000);
           }
       });
    //    
    //    $rootScope.$on('xmpp:groupchat:affiliation', function (event, data) {
    //        console.log('xmpp:groupchat:affiliation');
    //        var room = RoomManager.get(data.roomId);
    //        
    //        if(data.action == "remove" &&  (data.phone + xmppClient.domain) == xmppClient.jid){ // ­n³Q§R°£ªº¤H¦¬¨ì®É
    //            var inRoom = false;
    //            //¬Ý§Ú¬O§_¦b¸Ó©Ð¶¡¤º
    //            xmppClient.connection.muc.listRooms('chatroom.apps.csie.ntut.edu.tw', function (rooms) {//¦C¥X¦Û¤v¦bserver¤º©Ò¥[¤Jªº©Ð¶¡
    //                angular.forEach(rooms, function(room) {
    //                    if(room.jid == data.roomId + xmppClient.chatRoomDomain){
    //                        inRoom = true;
    //                    }
    //                });
    //                
    //                if(!inRoom){
    //                    xmppClient.connection.muc.leave(room.jid, RoomManager.nick);
    //                    $timeout(function () {
    //                        RoomManager.remove(data.roomId);
    //                        MessageInfoManager.remove(data.roomId);
    //                    },  1000);
    //                }
    //
    //            });
    //            
    //        } else{ // data.action=="add"
    //            connection.muc.queryAffiliationMembers(room.jid, 'owner', function (members) {
    //                room.members = members;
    //            });
    //        }
    //        
    //        $timeout(function () {
    //            $rootScope.$apply();
    //        }, 1000);
    //    });

    $rootScope.$on('xmpp:roster:enroll', function (event, from) {
        connection.roster.authorize(from);
        connection.roster.subscribe(from);
    });

    $rootScope.$on('xmpp:message', function (event, data) {

        var action = data.action;
        var member = data.member;
        if (action == 'security') {
            var list = MemberManager.listById(member.id);
            for (var key in list) {
                list[key].phoneNumber = member.phone;
                list[key].email = member.email;
                list[key].name = member.name;
                MemberManager.update(list[key]);
            }
            console.log("security");
        } else if (action == 'update') {
            var list = MemberManager.listById(member.id);
            for (var key in list) {
                list[key].email = member.email;
                list[key].name = member.name;
                if (list[key].parentId == member.parentId) {
                    list[key].tel = member.tel;
                    list[key].job = member.job;
                }
                MemberManager.update(list[key]);
            }
            var item = DepMembersManager.get(member.id, member.parentId);
            item.tel = member.tel;
            item.job = member.job;
            DepMembersManager.update(item);
            if (localStorage.id == member.id) {
                var people = SelfDetailManager.get(localStorage.phone);
                Api.getMyMemberInfo(localStorage.phone, function (data) {
                    receiveData = data;
                    var tels = [];
                    for (var key in receiveData.jobTels) {
                        tels.push(receiveData.jobTels[key].tel);
                    }
                    people.phoneNumber = receiveData.userInfo.phoneNumber;
                    people.email = receiveData.userInfo.email;
                    people.tel = tels;
                    SelfDetailManager.update(people);
                    $rootScope.$broadcast('ctrl:setting:refresh');
                });
            }
            console.log("update");
        } else if (action == 'change') {
            MemberManager.remove(data.oldUserId, member.parentId);
            DepMembersManager.remove(data.oldUserId, member.parentId);
            var subscribe=ContactManager.remove(data.oldUserId, member.parentId);
            var item = {
                id: member.id,
                name: member.name,
                email: member.email,
                phoneNumber: member.phone,
                userName: member.id,
                tel: member.tel,
                job: member.job,
                parentId: member.parentId,
                marked: true
            }
            MemberManager.add(item);
            item = {};
            item = {
                id: member.id,
                job: member.job,
                tel: member.tel,
                parentId: member.parentId
            }
            DepMembersManager.update(item);
            if (subscribe) {
                time = {}
                item = {
                    id: member.id,
                    parentId: member.parentId,
                    name: member.name,
                    type: 1,
                    open: false,
                    hasChild: false
                }
                ContactManager.add(item);
            }
            $rootScope.$broadcast('ctrl:contact:refresh');
            $rootScope.$broadcast('ctrl:peopleList:refresh');
            $rootScope.$broadcast('ctrl:setting:refresh');
            $rootScope.$broadcast('ctrl:message:refresh', {
                oldUserId: data.oldUserId,
                parentId: member.parentId,
                newUserId: member.id
            });
            console.log("change");
        }

        $timeout(function () {
            $rootScope.$apply();
        }, 1000);


    });
    $rootScope.$on('xmpp:receipt', function (event, data) {
        var id = data.id;
        var loction = data.location;
        var date = data.date;
        var uuid = data.uuid;
        var state = 1;
        var unreadCount;
        var readStamp;
        if (loction.indexOf("chat") >= 0 || loction.indexOf("messageSingle") >= 0) {
            if(loction.indexOf("chat") >= 0){
                var phoneIndex = loction.indexOf("chat") + 5;
            }else{
                var phoneIndex = loction.indexOf("messageSingle") + 18;
            }

            var currentChatPhone = loction.substring(phoneIndex, phoneIndex + 4);
            console.log("currentChatPhone"+currentChatPhone);

            if (currentChatPhone == loginData.user) {
                state = 2;
                unreadCount = 0;
                readStamp = date;
            }
        }

        MessageManager.updateState({ id: id, uuid: uuid, state: state });

        var messageInfo = MessageInfoManager.get(id) || {};

        if (unreadCount != 0)
            unreadCount = messageInfo.unreadCount;
            messageInfo = {
                id: messageInfo.id,
                lastMessage: messageInfo.lastMessage,
                lastStamp: messageInfo.lastStamp,
                unreadCount: unreadCount,
                readStamp: messageInfo.readStamp
            };

        MessageInfoManager.add(messageInfo);

        var total = MessageInfoManager.totalUnread();

        $timeout(function () {
            $rootScope.$apply();
        }, 200);
    });

    $rootScope.$on('xmpp:msg:message', function (event, data) {
        var uuid = data.id;
        var id = data.from.split('@')[0];
        var message = data.body;
        var type = data.type;
        var stamp = data.stamp;
        var occupant = null;
        var deaprtmentId = data.deaprtmentId;
        if (data.occupant != null)
            occupant = data.occupant.split('@')[0];
        if(!stamp)
            stamp = JSON.parse(JSON.stringify(new Date()));
        var message = {
            id: id,
            uuid:uuid,
            message: message,
            stamp: stamp,
            state: occupant == window.localStorage['id'] ? 0 : 3,
            type: type,
            occupant: occupant
        };
        //window.console.log((new XMLSerializer()).serializeToString(message));
        MessageManager.add(message);

        var messageInfo = MessageInfoManager.get(id) || {};
        messageInfo = {
            id: id,
            lastMessage: message.message,
            lastStamp: stamp,
            unreadCount: (messageInfo.unreadCount || 0) + 1,
            type: messageInfo.type || (occupant ? 1 : 2)
        };
        
        var loction = $location.path();
        if ((loction.indexOf("chat") > 0||loction.indexOf("messageSingle")||loction.indexOf("messageGroup")) && loction.indexOf(id) > 0) {
            messageInfo.unreadCount = 0;
        }
        if (type != 3) {
            MessageInfoManager.add(messageInfo);
        }
        $rootScope.$broadcast('ctrl:message:toButton');
        $timeout(function () {
            $rootScope.$apply();
        }, 200);
    })

$rootScope.$on('xmpp:checkstates', function (event, data) {
        var id = data.id;
        var date = data.date;
        //this isn't information!!!!    
        MessageManager.updateReaded(id);

        var messageInfo = MessageInfoManager.get(id);
        if (messageInfo) {
            messageInfo = {
                id: id,
                lastMessage: messageInfo.lastMessage,
                lastStamp: messageInfo.lastStamp,
                unreadCount: messageInfo.unreadCount,
                readStamp: JSON.parse(JSON.stringify(date))
            };
            MessageInfoManager.add(messageInfo);
        }

        $timeout(function () {
            $rootScope.$apply();
        }, 200);
    });


    $ionicPlatform.on('pause', function () {
        console.log('pause');
        connection.disconnect();
    });

    var reconnect = function () {
        xmppClient.login(loginData.user, xmppClient.onConnect);
    };

    $ionicPlatform.on('resume', function () {
        console.log('resume');
        if (!loginData.user)
            return;
        $timeout(reconnect, 300);
    });

    return xmppClient;
});