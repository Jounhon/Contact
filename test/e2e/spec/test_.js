"use strict";

require("./../helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
	q = require('q'),
    serverConfigs = require('./../helpers/appium-servers');

var path = require("path");
var datas = require('./../helpers/datas');
var people = datas.people;


describe('test', function () {
    this.timeout(300000);

    var allPassed = true;

    before(function () {
        //var peopleDriver = [];
        //for (var i = 0; i < 2; i++) {
        //    var person = people[i];
        //    var serverConfig = _.clone(serverConfigs.local);
        //    serverConfig.port = person.port;
        //    person.driver = wd.promiseChainRemote(serverConfig);
        //    require("./../helpers/logging").configure(person.driver);

        //    var desired = _.clone(require("./../helpers/caps").android19);
        //    desired.app = path.resolve(__dirname, "../app/schoolcontact" + person.phone + ".apk");
        //    desired.udid = person.udid;
        //    desired.deviceName = person.name;
        //    desired.autoWebview = true;

        //    var t = person.driver.init(desired).setImplicitWaitTimeout(3000);
        //    peopleDriver.push(t);
        //}

        //return q.all(peopleDriver);
    });

    //   after(function() {
    //  return driver
    //    .sleep(600000)
    //    .quit();
    //});
    it('安全機制測試', function () {
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.browser = browser.forkNewDriverInstance();
            person.element = person.browser.element;
            person.browser.get('http://localhost:51222/www/index.html');
            person.browser.sleep(1000);
            person.browser.executeScript('localStorage.phone = \'' + person.phone + '\';');
            person.browser.refresh();

        });
        browser.sleep(5000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('a[icon="ion-gear-a"]')).get(0).click();
        });
        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('button[ng-click="change()"]')).get(0).click();
            browser.sleep(3000);
            var slider = person.element.all(by.css('ion-slide[class="slider-slide"]')).get(0);
            person.browser.actions().dragAndDrop(
                slider,
                { x: -100, y: 0 }
            ).perform();
            browser.sleep(3000);

            slider = person.element.all(by.css('ion-slide[class="slider-slide"]')).get(1);
            person.browser.actions().dragAndDrop(
                slider,
                { x: 100, y: 0 }
            ).perform();

            browser.sleep(1000);
        });
      
  
        browser.sleep(15000);
    });
    //var browser2, element2, browser3, element3;
    xit('自訂聊天室測試', function () {
        //webdriver-manage protractor conf.js
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.browser = browser.forkNewDriverInstance();
            person.element = person.browser.element;
            person.browser.get('http://localhost:51222/www/index.html');
            person.browser.sleep(1000);
            person.browser.executeScript('localStorage.phone = \'' + person.phone + '\';');
            person.browser.refresh();

        });
        browser.sleep(5000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('ion-item[ng-click="toggleGroup(unit)"]')).get(person.customChat.path[0]).click();
        });
        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('ion-item[ng-click="toggleGroup(affair)"]')).get(person.customChat.path[1]).click();
        });
        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('button[ng-click="toggleClick(dep,$event)"]')).get(person.customChat.path[2]).click();
        });
        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('a[icon="ion-android-contacts"]')).get(0).click();
        });
        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('a[href = "#/tab/buildRoom"]')).get(0).click();
            person.browser.sleep(200);
        });
        browser.sleep(1000);
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('label[class="item item-checkbox ng-valid"]')).then(function (elems) {
                for (var i = 0; i < elems.length / 2; i++) {
                    person.element.all(by.css('label[class="item item-checkbox ng-valid"]')).get(i).click();
                    person.browser.sleep(200);
                }
            });
        });
        browser.sleep(1000);
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.model('roomName')).sendKeys(person.name + '所建房間');
            person.browser.sleep(200);
            person.element.all(by.css('button[ng-click="createRoom()"]')).get(0).click();

        });
        browser.sleep(60000);
    });

    xit('群聊測試', function () {

        //appium mocha test_.js
        //var peopleDriver = [];
        //_.each(people, function (person) {
        //    if (!person.udid)
        //        return;
        //    var z = person.driver
        //    .sleep(8000)
        //    .execute('tapClick({ target: $(\'a[icon="ion-ios-chatboxes"]\')[0] });', []).sleep(1000)

        //    peopleDriver.push(z);
        //});

        //return q.all(peopleDriver);

        //webdriver-manage protractor conf.js
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.browser = browser.forkNewDriverInstance();
            person.element = person.browser.element;
            person.browser.get('http://localhost:56870/www/index.html');
            person.browser.sleep(1000);
            person.browser.executeScript('localStorage.phone = \'' + person.phone + '\';');
            person.browser.refresh();

        });
        browser.sleep(8000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('ion-item[ng-click="toggleGroup(unit)"]')).get(person.multiChat.path[0]).click();
        });

        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('button[ng-click="groupChat(affair,$event)"]')).get(0).click();
        });
        browser.sleep(1000);



        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.model('msg.message')).sendKeys(person.name);
        });
        browser.sleep(1500);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.css('button[ng-click="snedMessage()"]')).click();
            person.browser.sleep(300);
        });
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.model('msg.message')).sendKeys(" " + person.name + " " + person.name + " ");
        });
        browser.sleep(1500);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.css('button[ng-click="snedMessage()"]')).click();
            person.browser.sleep(300);
        });
        browser.sleep(300000);

    });
    it("公告測試~~~~", function () {
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.browser = browser.forkNewDriverInstance();
            person.element = person.browser.element;
            person.browser.get('http://localhost:56870/www/index.html');
            person.browser.sleep(1000);
            person.browser.executeScript('localStorage.phone = \'' + person.phone + '\';');
            person.browser.refresh();

        });
        browser.sleep(8000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('ion-item[ng-click="toggleGroup(unit)"]')).get(person.chat.path[0]).click();
        });

        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('button[ng-click="groupChat(affair,$event)"]')).get(0).click();
        });
        browser.sleep(1000);
        
        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element.all(by.css('button[ng-click="changeBox(\'bulletin\')"]')).get(0).click();
        });
        browser.sleep(1000);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.css('button[ng-click="showInset()"]')).click();
            person.browser.sleep(1000);
        });

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.model('msg.pubsub')).sendKeys("I know you were trouble when i fuck you shit!!!! " + (new Date()));
        });
        browser.sleep(1500);

        _.each(people, function (person) {
            if (person.udid)
                return;
            person.element(by.css('button[ng-click="pubsub()"]')).click();
            person.browser.sleep(600);
        });

        browser.sleep(30000);
    });

});