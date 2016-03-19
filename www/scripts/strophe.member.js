angular.module('Strophe.plugin', []).run(function ($rootScope) {

    Strophe.addConnectionPlugin('member', {
        _conn: null,
    
        init: function(conn) {
            this._conn = conn;
            Strophe.addNamespace('MEMBER', 'http://schoolContact.com.tw/custom/member');
        },
           
        statusChanged: function (status, condition) {
    		if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
    		    this._conn.addHandler(this._onReceiveMember.bind(this), Strophe.NS.MEMBER, "message");
    		}
    	},
        
        _onReceiveMember: function (message) {
        	var member = $('member[xmlns="' + Strophe.NS.MEMBER + '"]', message);   
           // window.console.log((new XMLSerializer()).serializeToString(message));
            $rootScope.$broadcast('xmpp:message', {
                from: message.getAttribute('from'),
                to: message.getAttribute('to'),
                member: {
                    id: member.attr('id'),
                    name: member.attr('name'),
                    phone: member.attr('phone'),
                    email: member.attr('email'),
                    job: member.attr('job'),
                    tel: member.attr('tel'),
                    parentId: parseInt(member.attr('departmentId'))
                },
                action: member.attr('action'),
                oldUserId:$(message).children('oldUserId').text(),
            });
            return true;
        }
    });
           
});