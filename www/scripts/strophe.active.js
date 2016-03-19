angular.module('Strophe.plugin').run(function ($rootScope) {
    Strophe.addConnectionPlugin('chatstates', {

        _conn: null,

        init: function (conn) {
            this._conn = conn;
            Strophe.addNamespace('CHATSTATES', 'http://jabber.org/protocol/chatstates');
        },


        statusChanged: function (status, condition) {
            if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
                this._conn.addHandler(this._onReceiveState.bind(this), Strophe.NS.CHATSTATES, 'message');
            }
        },

        _onReceiveState: function (message) {
            window.console.log("here i get!");
            var active = message.getElementsByTagName('active');

            var from = message.getAttribute('from').split("@")[0];

            var date = new Date();
            if (active.length > 0) {
                $rootScope.$broadcast('xmpp:checkstates', {
                    id: from,
                    state: 'active',
                    date: date
                });
            }
            return true;
        },

        send: function (to, state) {
            
            var msg = $msg({ to: to });

            var stateElement = Strophe.xmlElement(state, { 'xmlns': 'http://jabber.org/protocol/chatstates' });
            msg.tree().appendChild(stateElement);
            this._conn.send(msg.tree());
            console.log("send state " + to);
            return true;
        },
    });
});