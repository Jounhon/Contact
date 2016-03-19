//indexedDB DBManager

app.factory('ContactManager', function ($indexedDB) {
    var contacts = {};
    $indexedDB.openStore('Contact', function (store) {
        store.each().then(function (result) {
      
            for (var i = 0; i < result.length; i++) {
                var contact = result[i];
                contacts[[contact.id,contact.parentId]] = contact;
            }
        });
    });

    return {
        add:function(data,onSuccess){
            if (!contacts[[data.id,data.parentId]]) {
                contacts[[data.id, data.parentId]] = data;
                $indexedDB.openStore('Contact', function (store) {
                    store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                    });
                });
            }
        },
        list: function () {
            return contacts;
        },
        hasSingle:function(){
            var has = false;
            for (var key in contacts) {
                if (contacts[key].type === 1) {
                    has = true;
                    break;
                }
            }
            return has;
        },
        remove: function (id,parentId) {
            if (contacts[[id, parentId]]) {
                $indexedDB.openStore('Contact', function (cont) {
                    cont.delete([id, parentId]);
                });
                delete contacts[[id, parentId]];
                return true;
            }
            else return false;
        }
    };
});
app.factory('ContactTreeManager',function($indexedDB,$q){
    var treeList={};
    var initialized = $q.defer();
    $indexedDB.openStore('ContactTree', function (store){
        store.each().then(function (result) {
            for (var i = 0; i < result.length; i++) {
                var list = result[i];
                treeList[list.id] = list;
            }
            initialized.resolve(treeList);
            //console.log('1' + JSON.stringify(treeList));
        });
    });
    return{
        initialize: function () {
            return initialized.promise;
        },
        add: function (data, onSuccess) {
            if (!treeList[data.id]) {
                treeList[data.id] = data;
                $indexedDB.openStore('ContactTree', function (store) {
                    store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                    });
                });
            }
        },
        update: function(data,onSuccess){
            $indexedDB.openStore('ContactTree',function(store){
                store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                });
            });
        },
        get:function(id){
            if (!treeList[id]){
                treeList[id] = {};
            }
            return treeList[id];  
        },
        list:function(){
            return treeList;
        },
        listById:function(id){
            var list={};
            for(var key in treeList){
                if(treeList[key].parentId===id){
                    list[key]=treeList[key];
                }
            }
            return list;
        },
    }
});
app.factory('MemberManager',function($indexedDB,$q){
    var memberList={};
    var initialized = $q.defer();
    $indexedDB.openStore('Members', function (store) {
        store.each().then(function (result) {
           // console.log("CcCc:" + JSON.stringify(result));
            for (var i = 0; i < result.length; i++) {
                var list = result[i];
                memberList[[list.id,list.parentId]] = list;
            }
            initialized.resolve(memberList);
            //console.log('2' + JSON.stringify(memberList));
        });
    });
    return{
        initialize: function () {
            return initialized.promise;
        },
        add:function(data,onSuccess){
            if (!memberList[[data.id, data.parentId]]) {
                memberList[[data.id, data.parentId]] = data;
                $indexedDB.openStore('Members', function (store) {
                    store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                    });
                });

            }
        },
        update: function (data, onSuccess) {
            memberList[[data.id, data.parentId]] = data;
            $indexedDB.openStore('Members', function (store) {
                store.upsert(data).then(function (result) {
                    (onSuccess || angular.noop)(data);
                });
            });
        },
        list:function(){
          return memberList;  
        },
        listByDep:function(parentId){
            var departmentMemberList ={};
            for(var key in memberList){
                if(memberList[key].parentId===parentId){
                    departmentMemberList[memberList[key].id] = memberList[key];
                }
            }
            return departmentMemberList;
        },
        listById:function(id){
            var list = {};
            for (var key in memberList) {
                if (memberList[key].id == id) list[memberList[key].parentId] = memberList[key];
            }
            return list;
        },
        get: function (depId, memberId) {
            if (!memberList[[memberId, depId]]) {
                memberList[[memberId,depId]] = {};
            }
            return memberList[[memberId,depId]];  
        },
        getName: function(id){
            for(var key in memberList){
                if(memberList[key].id==id) return memberList[key].name;
            }
            return null;
        },
        remove:function(id,parentId){
            if (memberList[[id, parentId]]) {
                $indexedDB.openStore('Members', function (store) {
                    store.delete([id, parentId]);
                });
                delete memberList[[id, parentId]];
            }
        }
    }
});

app.factory('DepMembersManager', function ($indexedDB) {
    var depMemberList={};
    $indexedDB.openStore('DepMembers', function (store) {
        store.each().then(function (result) {
            for (var i = 0; i < result.length; i++) {
                var list = result[i];
                depMemberList[[list.id,list.parentId]] = list;
            }
        });
    });
    return{
        add: function (data, onSuccess) {
            if (!depMemberList[[data.id, data.parentId]]) {
                depMemberList[[data.id, data.parentId]] = data;
                $indexedDB.openStore('DepMembers', function (store) {
                    store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                    });
                });
            }
        },
        update: function (data, onSuccess) {
            depMemberList[[data.id, data.parentId]] = data;
            $indexedDB.openStore('DepMembers', function (store) {
                store.upsert(data).then(function (result) {
                    (onSuccess || angular.noop)(data);
                });
            });
        },
        list:function(){
          return depMemberList;  
        },
        get:function(id,parentId){
            if (!depMemberList[[id, parentId]]) {
                depMemberList[[id, parentId]] = {};
            }
            return depMemberList[[id, parentId]];
        },
        getById: function (id) {
            var list = [];
            for (var key in depMemberList) {
                if (depMemberList[key].id == id) list.push(depMemberList[key]);
            }
            return list;
        },
        remove: function (id, parentId) {
            if (depMemberList[[id, parentId]]) {
                $indexedDB.openStore('DepMembers', function (store) {
                    store.delete([id, parentId]);
                });
                delete depMemberList[[id, parentId]];
            }
        }
    }
});


app.factory('SelfDetailManager', function ($indexedDB) {
    var selfList = {};
    $indexedDB.openStore('SelfDetail', function (store) {
        store.each().then(function (result) {
            for (var i = 0; i < result.length; i++) {
                var list = result[i];
                selfList[list.id] = list;
            }
        });
    });
    return {
        add: function (data, onSuccess) {
            if (!selfList[data.id]) {
                selfList[data.id] = data;
                $indexedDB.openStore('SelfDetail', function (store) {
                    store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                    });
                });
            }
        },
        update: function (data, onSuccess) {
            selfList[data.id] = data;
            $indexedDB.openStore('SelfDetail', function (store) {
                store.upsert(data).then(function (result) {
                    (onSuccess || angular.noop)(data);
                });
            });
        },
        get: function (id) {
            if (!selfList[id]) {
                selfList[id] = {};
            }
            return selfList[id];
        }
    }
});
app.factory('MessageManager', function ($indexedDB) {
    var messages = {};
    $indexedDB.openStore('messages', function (store) {
        store.each().then(null, null, function (message) {
            if (!messages[message.id])
                messages[message.id] = {};
            messages[message.id][message.uuid] = message;
        });
    });
    return {
        add: function (message,onSuccess) {
            if (!messages[message.id])
                messages[message.id] = {};

            $indexedDB.openStore('messages', function (store) {
                store.upsert(message).then(function (result) {
                    (onSuccess || angular.noop)(message);
                });
            });
            messages[message.id][message.uuid] = message;
        },
        get: function (id) {
            return messages[id];

        },
        list: function () {
            return messages;
        },
        remove: function (id) {
            $indexedDB.openStore('messages', function (store) {
                store.findWhere(store.query().$index('stamp').$eq(id)).then(null, null, function (message) {
                    store.delete(message.id);
                });
            });
            delete messages[id];
        },
        removeById: function (message) {
            $indexedDB.openStore('messages', function (store) {
                store.delete(message.id);
            });
            delete messages[message.id][message.id];
        },
        updateState: function (message) {
            $indexedDB.openStore('messages', function (store) {
                store.find(message.id).then(function (result) {
                    result.state = message.state;
                    store.upsert(result);
                });
            });
            console.log(messages[message.id][message.uuid]);
            messages[message.id][message.uuid].state = message.state;
        },
        updateReaded: function (id) {
            $indexedDB.openStore('messages', function (store) {
                store.findWhere(store.query().$index('id, state').$between([id, 0], [id, 1], false, false)).then(null, null, function (message) {
                    message.state = 2;
                    store.upsert(message);
                });
            });

            for (var key in messages[id]) {
                if (messages[id][key].state != 3) {
                    messages[id][key].state = 2;
                }
            }
        },
    }
});
//此次新增的存放訊息，我們做send也會把訊息存入
app.factory('MessageInfoManager', function ($indexedDB, $q) {
    var messageInfos = {};
    var initialized = $q.defer();
    $indexedDB.openStore('messageInfos', function (store) {
        store.each().then(function (result) {
            for (var i = 0; i < result.length; i++) {
                var messageInfo = result[i];
                messageInfos[messageInfo.id] = messageInfo;
            }
            initialized.resolve();
        });
    });
    return {
        initialize: function () {
            return initialized.promise;
        },
        add: function (messageInfo) {
            if (!messageInfos[messageInfo.id])
                messageInfos[messageInfo.id] = {};
            var old = messageInfos[messageInfo.id];
            if (old) {
                for (var key in old) {
                    if (messageInfo[key] !== 0)
                        messageInfo[key] = messageInfo[key] || old[key];
                }
            }

            $indexedDB.openStore('messageInfos', function (store) {
                store.upsert(messageInfo);
            });
            messageInfos[messageInfo.id] = messageInfo;
        },
        get: function (id) {
            if (!messageInfos[id])
                return;
            return messageInfos[id];
        },
        list: function () {
            return messageInfos;
        },
        remove: function (id) {
            $indexedDB.openStore('messageInfos', function (store) {
                store.delete(id);
            });
            delete messageInfos[id];
        },
        update: function (messageInfo) {
            $indexedDB.openStore('messageInfos', function (store) {
                store.upsert(messageInfo);
            });
            messageInfos[messageInfo.id] = messageInfo;
        },
        totalUnread: function () {
            var total = 0;
            for (var key in messageInfos) {
                total += messageInfos[key].unreadCount;
            }
            return total;
        },
        getType:function(id){
            if(messageInfos[id]) return messageInfos[id].type;
        }
    }
});

app.factory('RoomManager', function() {
    var rooms = {};
    return {
        get: function (id) {
            return rooms[id];
        },
        add: function (room) {
            room.id = room.jid.split('@')[0];
            rooms[room.id] = room;
        },
        remove: function (id) {
            delete rooms[id];
        },
        list: function () {
            return rooms;
        },
        checkName:function(Name){
            for(var key in rooms){
                if(rooms[key].name===Name) return rooms[key];
            }
            return false;
        },
        getName: function (id) {
            if (rooms[id]) {
                return rooms[id].name;
            }
            return null;
        }
    };
});

