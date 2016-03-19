"use strict";

require("./../helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    q = require('q'),
    serverConfigs = require('./../helpers/appium-servers');
var path = require("path");

var datas = require('./../helpers/datas');
var people = datas.people;

//describe 是什麼
describe('test', function () {
    this.timeout(600000);
    var driver;//定義什麼driver
    var allPassed = true;
    //before幹嘛的
    before(function () {
        var timeouts = [];
        for (var i = 0; i < 1; i++) {
            var person = people[i];
            var serverConfig = _.clone(serverConfigs.local);
            serverConfig.port = person.port;
            person.driver = wd.promiseChainRemote(serverConfig);
            require("./../helpers/logging").configure(person.driver);
            var desired = _.clone(require("./../helpers/caps").android19);
            desired.app = path.resolve(__dirname, "../app/schoolcontact" + person.phone + ".apk");
           // desired.udid = person.udid;
            desired.deviceName = person.name;
            desired.autoWebview = true;
            //desired.app = 'https://dl.dropboxusercontent.com/s/9rlhpjc2x0z4dmu/schoolcontact.apk';

            var t = person.driver.init(desired).setImplicitWaitTimeout(3000);
            timeouts.push(t);
        }
        

        return q.all(timeouts);
    });


    var browser2, element2, browser3, element3;
    it('一對一聊天測試', function () {
        var timeouts = [];
        _.each(people, function (person) {
            if (!person.udid)
                return;
            var z = person.driver
            .sleep(5000)

            .execute('tapClick({ target: $(\'a[icon="ion-ios-chatboxes"]\')[0] });', []).sleep(1000)
            .execute('tapClick({ target: $(\'a[icon="ion-ios-people"]\')[0] });', []).sleep(1000)
            // .execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(unit)"]\')[' + person.chat.path[0] + '] });', []).sleep(1000)
            // .execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(affair)"]\')[' + person.chat.path[1] + '] });', []).sleep(1000)
            // .execute('tapClick({ target: $(\'ion-item[ng-click="href(dep)"]\')[' + person.chat.path[2] + '] });', []).sleep(1500)
            // .execute('tapClick({ target: $(\'ion-item[ng-click="chat(people.id)"]\')[' + person.chat.path[3] + '] });', []).sleep(1500)
            // .elementById('messageInput').sendKeys('Hello').sleep(1500)
            // .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(15000)
            // .execute('tapClick({ target: $(\'a[icon="ion-ios-chatboxes"]\')[0] });', []).sleep(1000)
            // .execute('tapClick({ target: $(\'a[icon="ion-ios-chatboxes"]\')[0] });', []).sleep(10000)

            //.quit();
            timeouts.push(z);
        });

        browser2.refresh();
        browser2.sleep(3000);

        element2.all(by.css('a[icon="ion-ios-chatboxes"]')).get(0).click();
        browser2.sleep(1000);

        element2.all(by.css('a[icon="ion-ios-people"]')).get(0).click();
        browser2.sleep(1000);

        element2.all(by.css('ion-item[ng-click="toggleGroup(unit)"]')).get(0).click();
        browser2.sleep(1000);
        element2.all(by.css('ion-item[ng-click="toggleGroup(affair)"]')).get(0).click();
        browser2.sleep(1000);
        element2.all(by.css('ion-item[ng-click="href(dep.id)"]')).get(0).click();
        browser2.sleep(1000);
        element2.all(by.css('ion-item[ng-click="chat(people.id)"]')).get(0).click();
        browser2.sleep(1000);
        element2(by.model('msg.message')).sendKeys('發送訊息測試 1');
        browser2.sleep(1000);
        element2(by.css('button[ng-click="snedMessage()"]')).click();
        browser2.sleep(1000);

        //browser3 = browser.forkNewDriverInstance();
        //element3 = browser3.element;
        //browser3.get('http://localhost:63342/Apps/www/index.html');
        //browser3.sleep(1000);
        //browser3.executeScript(function () {
        //    localStorage['phone'] = '0938590041';
        //});
        //browser3.refresh();
        //browser3.sleep(3000);

        //element3.all(by.css('a[icon="ion-ios-chatboxes"]')).get(0).click();
        //browser3.sleep(1000);
        //element3.all(by.css('ion-item')).get(0).click();
        //browser3.sleep(1000);
        //element3(by.model('msg.message')).sendKeys('發送訊息測試 2');
        //browser3.sleep(1000);
        //element3(by.css('button[ng-click="snedMessage()"]')).click();

        //browser3.sleep(3000);
    });

    //it('5. 1張轉舊生', function () {

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.browser = browser.forkNewDriverInstance();
            person.element = browser.element;
            person.browser.get('http://localhost:49652/www/index.html');
        });
        browser.sleep(2000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.browser.executeScript('localStorage.phone = \'' + person.phone + '\';');
            person.browser.refresh();
        });
        browser.sleep(3000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('a[icon="ion-ios-chatboxes"]')).get(0).click();
        });
        browser.sleep(1000);
        
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('a[icon="ion-ios-people"]')).get(0).click();
        });
        browser.sleep(1000);
        
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('ion-item[ng-click="toggleGroup(unit)"]')).get(person.chat.path[0]).click();
        });
        browser.sleep(1000);
        
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('ion-item[ng-click="toggleGroup(affair)"]')).get(person.chat.path[1]).click();
        });
        browser.sleep(1000);
        
        // _.each(people, function (person) {
            // if (person.udid)
                // return;
            // person.element.all(by.css('ion-item[ng-click="href(dep)"]')).get(person.chat.path[2]).click();
        // });

        // browser.sleep(1500);
        
        // _.each(people, function (person) {
            // if (person.udid)
                // return;
            // person.element.all(by.css('ion-item[ng-click="chat(people.id)"]')).get(person.chat.path[3]).click();
        // });

        // browser.sleep(1000);
        
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.model('msg.message')).sendKeys('Hello');
        });
        browser.sleep(1500);
        
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.css('button[ng-click="snedMessage()"]')).click();
        });
        browser.sleep(1500);
        
        // _.each(people, function (person) {
            // if (person.udid)
                // return;
            // person.element.all(by.css('a[icon="ion-ios-chatboxes"]')).get(0).click();
        // });
        // browser.sleep(1000);

        // browser2 = browser.forkNewDriverInstance();
        // element2 = browser2.element;
        // browser2.get('http://localhost:49652/www/index.html');
        // browser2.sleep(1200);
        // browser2.executeScript(function () {
            // localStorage['phone'] = '0935133943';
        // });

        // browser2.refresh();
        // browser2.sleep(3000);

        // element2.all(by.css('a[icon="ion-ios-chatboxes"]')).get(0).click();
        // browser2.sleep(1000);

        // element2.all(by.css('a[icon="ion-ios-people"]')).get(0).click();
        // browser2.sleep(1000);

        // element2.all(by.css('ion-item[ng-click="toggleGroup(unit)"]')).get(0).click();
        // browser2.sleep(1000);
        // element2.all(by.css('ion-item[ng-click="toggleGroup(affair)"]')).get(0).click();
        // browser2.sleep(1000);
        // element2.all(by.css('ion-item[ng-click="href(dep)"]')).get(0).click();

        // browser2.sleep(1500);
        // element2.all(by.css('ion-item[ng-click="chat(people.id)"]')).get(0).click();

        // browser2.sleep(1000);
        // element2(by.model('msg.message')).sendKeys('Hello');
        // browser2.sleep(1000);
        // element2(by.css('button[ng-click="snedMessage()"]')).click();

        // browser2.sleep(1000);
        // browser3 = browser.forkNewDriverInstance();
        // element3 = browser3.element;
        // browser3.get('http://localhost:49652/www/index.html');
        // browser3.sleep(1200);
        // browser3.executeScript(function () {
            // localStorage['phone'] = '0938590041';
        // });
        // browser3.refresh();
        // browser3.sleep(3000);

        // element3.all(by.css('a[icon="ion-ios-chatboxes"]')).get(0).click();
        // browser3.sleep(1000);
        // element3.all(by.css('ion-item')).get(0).click();
        // browser3.sleep(1000);
        // element3(by.model('msg.message')).sendKeys('Hi 陳老師');
        // browser3.sleep(1000);
        // element3(by.css('button[ng-click="snedMessage()"]')).click();

        // browser3.sleep(3000);
    });

    xit('一對多公告', function () {
        var timeouts = [];
        _.each(people, function (person) {
            if (!person.udid)
                return;
            var z = person.driver
            .sleep(5000)

            .execute('tapClick({ target: $(\'a[icon="ion-ios-people"]\')[0] });', []).sleep(1000)
            .execute('tapClick({ target: $(\'a[icon="ion-ios-people"]\')[0] });', []).sleep(1000)
            //.execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(unit)"]\')[' + person.myPath[0] + '] });', []).sleep(1000)
            //.execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(affair)"]\')[' + person.myPath[1] + '] });', []).sleep(1000)
            .execute('tapClick({ target: $(\'button[ng-click="groupChat(dep,$event)"]\')[' + person.myPath[2] + '] });', []).sleep(1500)
            .execute('tapClick({ target: $(\'button[ng-click="changeBox(\\\'bulletin\\\')"]\')[0] });', []).sleep(1000)
            .execute('tapClick({ target: $(\'button[ng-click="showInset()"]\')[0] });', []).sleep(1000)
            .elementByCss('textarea[ng-model="msg.pubsub"]').sendKeys(person.name + '發布的公告').sleep(1500)
            .execute('tapClick({ target: $(\'button[ng-click="pubsub()"]\')[0] });', []).sleep(15000)

            //.quit();
            timeouts.push(z);
        });

        return q.all(timeouts);
    });

    xit('多對多聊天', function () {
        var timeouts = [];
        _.each(people, function (person) {
            if (!person.udid)
                return;
            var z = person.driver
            .sleep(5000)

            .execute('tapClick({ target: $(\'a[icon="ion-ios-people"]\')[0] });', []).sleep(1000)
            .execute('tapClick({ target: $(\'a[icon="ion-ios-people"]\')[0] });', []).sleep(1000)
            //.execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(unit)"]\')[' + person.myPath[0] + '] });', []).sleep(1000)
            //.execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(affair)"]\')[' + person.myPath[1] + '] });', []).sleep(1000)
            .execute('tapClick({ target: $(\'button[ng-click="groupChat(dep,$event)"]\')[' + person.myPath[2] + '] });', []).sleep(1500)
            .execute('tapClick({ target: $(\'button[ng-click="changeBox(\\\'chat\\\')"]\')[0] });', []).sleep(1000)
            .elementById('messageInput').sendKeys('Hello').sleep(1500)
            .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(10000)

            //.quit();
            timeouts.push(z);
        });

        return q.all(timeouts);
    });

    xit('自建多對多聊天', function (done) {
        people[0].driver

        .execute('tapClick({ target: $(\'a[icon="ion-ios-chatboxes"]\')[0] });', []).sleep(1000)
        .execute('tapClick({ target: $(\'a[icon="ion-ios-people"]\')[0] });', []).sleep(1000)
        .execute('tapClick({ target: $(\'a[icon="ion-ios-people"]\')[0] });', []).sleep(1000)
        //.execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(unit)"]\')[' + person.myPath[0] + '] });', []).sleep(1000)
        //.execute('tapClick({ target: $(\'ion-item[ng-click="toggleGroup(affair)"]\')[' + person.myPath[1] + '] });', []).sleep(1000)
        .execute('tapClick({ target: $(\'button[ng-click="toggleClick(dep,$event)"]\')[0] });', []).sleep(500)
        .execute('tapClick({ target: $(\'button[ng-click="toggleClick(dep,$event)"]\')[1] });', []).sleep(500)
        .execute('tapClick({ target: $(\'button[ng-click="toggleClick(dep,$event)"]\')[2] });', []).sleep(500)
        .execute('tapClick({ target: $(\'button[ng-click="toggleClick(dep,$event)"]\')[3] });', []).sleep(500)
        .execute('tapClick({ target: $(\'a[icon="ion-android-contacts"]\')[0] });', []).sleep(1000)
        .execute('tapClick({ target: $(\'a[href="#/tab/buildRoom"]\')[0] });', []).sleep(1000)
        .execute(function () {
            var els = $('label[class="item item-checkbox ng-valid"]');
            for (var i = 0; i < els.length; i++)
                tapClick({ target: els[i] });
        }, []).sleep(1000)
        .elementByCss('input[ng-model="roomName"]').sendKeys(people[0].name + '的自建聊天室').sleep(1500)
        .execute('tapClick({ target: $(\'button[ng-click="createRoom()"]\')[0] });', []).sleep(1500)
        .elementById('messageInput').sendKeys('大家好').sleep(1000)
        .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(1000)
        .then(function () {
            var timeout = [];
            _.each(people, function (person) {
                if (!person.udid)
                    return;
                if (person.roomOwner)
                    return;
                var z = person.driver
                .sleep(3000)

                .execute('tapClick({ target: $(\'a[icon="ion-ios-chatboxes"]\')[0] });', []).sleep(1000)
                .execute('tapClick({ target: $(\'a[icon="ion-ios-chatboxes"]\')[0] });', []).sleep(1000)
                .execute('tapClick({ target: $(\'ion-item[ng-click="href(item.id)"]\')[0] });', []).sleep(1000)
                .elementById('messageInput').sendKeys('大家好').sleep(1500)
                .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(1000)
                .elementById('messageInput').sendKeys('我是' + person.name).sleep(1500)
                .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(1000)
                .elementById('messageInput').sendKeys('Hellow').sleep(1500)
                .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(1000)
                .elementById('messageInput').sendKeys('Hi').sleep(1500)
                .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(1000)
                .elementById('messageInput').sendKeys('很好').sleep(1500)
                .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(1000)
                .elementById('messageInput').sendKeys('Good').sleep(1500)
                .execute('tapClick({ target: $(\'button[ng-click="snedMessage()"]\')[0] });', []).sleep(1000)

                .quit();
                timeout.push(z);
            });
            timeout.push(people[0].driver.quit());
            q.all(timeouts).then(function () {
                done();
            });
        });

    });
});