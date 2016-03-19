app.factory('Api', function ($http) {
    return {
        getGroupList: function (onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Department').
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                console.log("Error - Data1:" + data + " status:" +   status);
            });
        },
        getMembers: function (depId,Id,onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Department/Member?departmentId='+depId+'&myselfId=' + Id).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data2:" + data + " status:" + status);
            });
        },
        getRoomMember:function(members,id,onSuccess){
            $http.post('http://iweb.csie.ntut.edu.tw/school/api/Contact/Member', { membersId: members, myselfId: id }).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data3:" + data + " status:" + status);
            });
        },
        getPositionByDepMem : function(departmentId,memberId,onSuccess){
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Member?departmentId=' + departmentId + "&memberId=" + memberId).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data4:" + data + " status:" + status);
            });
        },
        getMyMemberInfo: function (phone, onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Member?phone=' +phone).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                console.log("Error - Data5:" + data + " status:" + status);
            });   
        },
        getDepVersion:function(depId,version,onSuccess){
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Department/Version?departmentId='+depId+'&version=' + version).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data6:" + data + " status:" + status);
            });
        },
        updateTopNode: function (id,node,onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Member/TopNode?memberId=' + id + '&topNode=' + node).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data7:" + data + " status:" + status);
            });
        },
        getMemberDepIds: function (id, onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Member/Department?memberId=' + id ).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("Error - Data8:" + data + " status:" + status);
            }); 
        },
        sendSMSMessage: function (phones, subject, msg,onSuccess) {
            //phones一個也要放陣列!!!!!!! var test = ["0911111111",....];
            $http.post('http://iweb.csie.ntut.edu.tw/school/api/Contact/SmsService', { phones: phones, subject: subject, message: msg, action: 1 } ).
                success(function (data, status, headers, config) {
                    (onSuccess || angular.noop)(data);
                }).
                error(function (data, status, headers, config) {
                    alert("Error - Data9:" + data + " status:" + status);
                }); 
        },
        sendInvitation: function (phones,onSuccess) {
            //phones一個也要放陣列!!!!!!! var test = ["0911111111",....];
           
            $http.post('http://iweb.csie.ntut.edu.tw/school/api/Contact/SmsService', { phones: phones, subject: null, message: null, action: 0 }).
                success(function (data, status, headers, config) {
                    (onSuccess || angular.noop)(data);
                }).
                error(function (data, status, headers, config) {
                    alert("Error - Data10:" + data + " status:" + status);
                });
        },
        sendphone: function (name, address,sendername,senderemail,subject,Message, onSuccess) {
            $http.post(
                'http://iweb.csie.ntut.edu.tw/school/api/Contact/MailService',
                { receiverName: name, receiverAddress: address, senderName: sendername, senderAddress: senderemail, subject: subject, message: Message },
                { 'Content-Type': 'text/html' }).
                success(function (data, status, headers, config) {
                    (onSuccess || angular.noop)(data);
                    //alert("ok");
                }).
                error(function (data, status, headers, config) {
                    alert("Error - Data11:" + data + " status:" + status);
                });
        },
        getPhone: function (token, onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Token/' + token).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("ERROR");
            });
        },
        install: function (id, onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact//Member/Install?userId=' + id).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("ERROR");
            });
        },
        getOneMember: function (id, myId,onSuccess) {
            $http.get('http://iweb.csie.ntut.edu.tw/school/api/Contact/Member?memberId='+id+'&myselfId='+myId).
            success(function (data, status, headers, config) {
                (onSuccess || angular.noop)(data);
            }).
            error(function (data, status, headers, config) {
                alert("ERROR");
            });
        }
    };
});