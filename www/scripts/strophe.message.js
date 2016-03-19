angular.module('Strophe.plugin').run(function ($rootScope, $location) {
    Strophe.addConnectionPlugin('message', {
        _conn: null,

        init: function (conn) {
            this._conn = conn;
            Strophe.addNamespace('RECEIPTS', 'urn:xmpp:receipts');
            //Strophe.addNamespace('PUBSUB', 'http://schoolContact.com.tw/custom/pubsub');
        },


        statusChanged: function (status, condition) {
            if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
                this._conn.addHandler(this._onReceiveChatMessage.bind(this), null, 'message', 'chat');
                this._conn.addHandler(this._onReceiveChatMessage.bind(this), null, 'message', 'groupchat');
          
            }
        },
        _onReceiveChatMessage: function (message) {
            var messageType = message.getAttribute('type');
            var id = message.getAttribute('id');//uuid
            var from = message.getAttribute('from').split("/")[0];
            var to = message.getAttribute('to').split("/")[0];
            var request = message.getElementsByTagName('request');
            var received = message.getElementsByTagName('received');
            var affiliation = message.getElementsByTagName('affiliation');
            var body = message.getElementsByTagName('body');
            var pubsub = message.getAttribute('pubsub');
            var occupant = null;
            var timestamp = $(message).children('timestamp').text();
            window.console.log((new XMLSerializer()).serializeToString(message));
            var type = 0;
            if (body.length > 0) {
                body = $(message).children('body').text();
                if (body === '') {
                    return true;
                }

                var delay = $('delay[xmlns="urn:xmpp:delay"]', message);
                if (delay.length > 0) {
                    if (messageType == 'groupchat') {
                        occupant = delay.attr('from').split("/")[0];
                    }
                    delay = delay.attr('stamp');
                    delay = JSON.parse(JSON.stringify(new Date(delay)));
                } else {
                    if(!timestamp)timestamp = JSON.parse(JSON.stringify(new Date()));
                    delay = timestamp;
                }

                if (pubsub == 1)
                    type = 3;
                $rootScope.$broadcast('xmpp:msg:message', {
                    id: id || (occupant.split("@")[0] + '_' + JSON.parse(JSON.stringify(delay))),
                    uuid:uuid,
                    from: from,
                    to: to,
                    type: type,
                    body: body,
                    stamp: delay,
                    occupant: occupant
                });
            }

            if (request.length > 0) {
                var receipt = $msg({
                    to: from,
                    from: this._conn.jid,
                    location: $location.path(),
                    id: id,
                    uuid:id,
                    type: 'chat'
                }),
                request = Strophe.xmlElement('received', { 'xmlns': Strophe.NS.RECEIPTS });
                receipt.tree().appendChild(request);
                this._conn.send(receipt.tree());
                
            }

            if (received.length > 0) {
                console.log(message);
                var id = from.split('@')[0];
                var location = message.getAttribute('location');
                var uuid = message.getAttribute('uuid');
                $rootScope.$broadcast('xmpp:receipt', {
                    id: id,
                    uuid:uuid,
                    location:location
                });
            }
            //if (affiliation.length > 0) {
            //    affiliation = affiliation[0];
            //    var roomId = from.split('@')[0];
            //    var phone = affiliation.getAttribute('jid').split('@')[0];
            //    var action = affiliation.getAttribute('action');

            //    $rootScope.$broadcast('xmpp:groupchat:affiliation', {
            //        roomId: roomId,
            //        phone: phone,
            //        action: action
            //    });
            //}
            return true;
        },

        send: function (to, body) {

            var id = generateUUID();
            var msg = $msg({ id: id, to: to ,type:'chat'});
            if (body) {
                msg.c('body', {}, body);
            }
            var request = Strophe.xmlElement('request', { 'xmlns': Strophe.NS.RECEIPTS });
            msg.tree().appendChild(request); 

            this._conn.send(msg.tree());

            return id;
        },


    });

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
});