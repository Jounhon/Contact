//indexedDB DBManager

app.factory('ContactManager', function ($indexedDB) {
    var contacts = {};
    $indexedDB.openStore('Contact', function (store) {
        store.each().then(function (result) {
            console.log("CCC:"+result.length);
            for (var i = 0; i < result.length; i++) {
                var contact = result[i];
                contacts[contact.id] = contact;
            }
        });
    });

    return {
        add: function (people, onSuccess) {
            if (!contacts[people.id]) {
                contacts[people.id] = people;
                $indexedDB.openStore('Contact', function (cont) {
                    cont.upsert(people).then(function (result) {
                        (onSuccess || angular.noop)(people);
                    });
                });
            }
        },
        listById:function(id){
            var list={};
            for(var key in contacts){
                if(contacts[key].rootId===id){
                    list[key]=contacts[key];
                }
            }
            return list;
        },
        get:function(id){
            if (!contacts[id]){
                contacts[id] = {};
            }
            return contacts[id];  
        },
        list: function () {
            console.log(Object.keys(contacts).length+"+++++");
            return contacts;
        },
        remove: function (people) {
            if(contacts[people.id]){
                $indexedDB.openStore('Contact', function (cont) {
                    cont.delete(people.id);
                });
                delete contacts[people.id];
            }
        },
        getRoot:function(id){
            var data={};
            for(var key in contacts){
                if(contacts[key].id==id){
                    data=contacts[key];
                    return data;
                }
            }
        },
        clear: function () {
            $indexedDB.openStore('Contact', function (store) {
                store.clear();
            });
            contacts = {};
        }
    };
});
app.factory('ContactTreeManager',function($indexedDB){
    var treeList={};
    $indexedDB.openStore('ContactTree', function (store){
        store.each().then(function (result) {
            console.log("rrrrrr:"+result.length);
            for (var i = 0; i < result.length; i++) {
                var list = result[i];
                treeList[list.id] = list;
            }
        });
    });
    return{
        add:function(data,onSuccess){
            if (!treeList[data.id]) {
                treeList[data.id] = data;
                $indexedDB.openStore('ContactTree', function (store) {
                    store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                    });
                });
            }
        },
        changeMark: function(data,onSuccess){
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
                if(treeList[key].rootId===id){
                    list[key]=treeList[key];
                }
            }
            return list;
        },
        getRoot:function(id){
            for(var key in treeList){
                if(treeList[key].id==id){
                    return treeList[key];
                }
            }
        }
    }
});
app.factory('memberDetailManager',function($indexedDB){
    var memberList={};
    $indexedDB.openStore('memberDetail', function (store){
        store.each().then(function (result) {
            for (var i = 0; i < result.length; i++) {
                var member = result[i];
                memberList[member.id] = member;
            }
        });
    });
    return{
        add:function(data,onSuccess){
            if (!memberList[data.id]) {
                memberList[data.id] = data;
                $indexedDB.openStore('memberDetail', function (store) {
                    store.upsert(data).then(function (result) {
                        (onSuccess || angular.noop)(data);
                    });
                });
            }
        },
        get:function(id){
            if (!memberList[id]){
                memberList[id] = {};
            }
            return memberList[id];  
        },
        list:function(){
            return memberList;
        }
    }
});
app.factory('DBInitManager',function(){
    var labcontact = {
        "ilab":{
    		"type":"group",
    		"sub":{
    			"專案":{
    				"type":"group",
    				"sub":{
    					"郭正華":{
    						"type":"people",
    						"phone": "0933720476",
    						"email": "kuo@webcomm.com.tw",
    						"tel": "427",
    					},
    					"陳英一":{
    						"type":"people",
    						"phone": "0936234561",
    						"email": "ichen@ntut.edu.tw",
    						"tel": "427"
    					},
    					"許智涵":{
    						"type":"people",
    						"phone": "0972817171",
    						"email": "kgame@kgame.tw",
    						"tel": "427"
    					}
    				}
    			},
    			"研究所一年級":{
    				"type":"group",
    				"sub":{
    					"張正儀":{
    						"type":"people",
    						"phone": "0928750026",
    						"email": "derek82511@gmail.com",
    						"tel": "427"
    					},
    					"黃立維":{
    						"type":"people",
    						"phone": "0960634909",
    						"email": "yellow456434@hotmail.com",
    						"tel": "427"
    					},
    					"呂信緯":{
    						"type":"people",
    						"phone": "0925298852",
    						"email": "st9450602@gmail.com",
    						"tel": "427"
    					},
    					"徐熒宏":{
    						"type":"people",
    						"phone": "0938848696",
    						"email": "t0930198@gmail.com",
    						"tel": "427"
    					},
    					"林昱辰":{
    						"type":"people",
    						"phone": "0958366117",
    						"email": "qazasdfg15@gmail.com",
    						"tel": "427"
    					},
    				}
    			},
    			"研究所二年級":{
    				"type":"group",
    				"sub":{
    					"鄭逸民":{
    						"type":"people",
    						"phone": "0953340305",
    						"email": "future801113@gmail.com",
    						"tel": "427"
    					},
    					"郭芳瑜":{
    						"type":"people",
    						"phone": "0985340262",
    						"email": "wendy814111@gmail.com",
    						"tel": "427"
    					},
    					"蔡皓羽":{
    						"type":"people",
    						"phone": "0937147848",
    						"email": "feather801201@gmail.com",
    						"tel": "427"
    					},
    					"吳哲安":{
    						"type":"people",
    						"phone": "0928785135",
    						"email": "9927ice@gmail.com",
    						"tel": "427"
    					}
    				}
    			},
    			"專題生":{
    				"type":"group",
    				"sub":{
    					"唐寧":{
    						"type":"people",
    						"phone": "0938590041",
    						"email": "s102590041@gmail.com",
    						"tel": "427"
    					},
    					"鍾泳鋐":{
    						"type":"people",
    						"phone": "0935133943",
    						"email": "h6g2682@gmail.com",
    						"tel": "427"
    					},
    					"陳約銘":{
    						"type":"people",
    						"phone": "0986752232",
    						"email": "aa1235561@gmail.com",
    						"tel": "427"
    					}
    				}
    			},
                "郭正華":{
        			"type":"people",
    				"phone": "0933720476",
    				"email": "kuo@webcomm.com.tw",
    				"tel": "427",
    			},
    			"陳英一":{
    				"type":"people",
    				"phone": "0936234561",
    				"email": "ichen@ntut.edu.tw",
    				"tel": "427"
    			},
    		}
    	}
    };
    return{
        getData : function (){
          return labcontact;  
        }
    }
    
});