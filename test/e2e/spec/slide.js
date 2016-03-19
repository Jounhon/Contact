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
    var driver;
    var allPassed = true;

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
            desired.udid = person.udid;
            desired.deviceName = person.name;
            desired.autoWebview = true;
            //desired.app = 'https://dl.dropboxusercontent.com/s/9rlhpjc2x0z4dmu/schoolcontact.apk';

            var t = person.driver.init(desired).setImplicitWaitTimeout(3000);
            timeouts.push(t);
        }
        

        return q.all(timeouts);
    });


    var browser2, element2, browser3, element3;
    xit('一對一聊天測試', function () {
        var timeouts = [];
        _.each(people, function (person) {
            if (!person.udid)
                return;
            var z = person.driver
            .sleep(15000)
            .execute(function(){tapClick({target: $('a[icon="ion-gear-a"]')[0]});}, [], null).sleep(3000)
            .execute(function(){tapClick({target: $('button[ng-click="change()"]')[0]});}, [], null).sleep(3000)
            // .execute(function(){tapClick({target: $('a[icon="ion-ios-chatboxes"]')[0]});}, [], null).sleep(3000)
            // .execute(function(){tapClick({target: $('a[icon="ion-gear-a"]')[0]});}, [], null).sleep(3000)
            // .execute(function(){tapClick({target: $('button[ng-click="change()"]')[0]});}, [], null).sleep(3000)
            // .execute(function(){tapClick({target: $('a[icon="ion-ios-people"]')[0]});}, [], null).sleep(3000)
            // .execute(function(){tapClick({target: $('a[icon="ion-gear-a"]')[0]});}, [], null).sleep(3000)
            // .execute(function(){tapClick({target: $('button[ng-click="change()"]')[0]});}, [], null).sleep(3000);
            // var slider=z.elementByCss('ion-slide[class="slider-slide"]')[0].sendKeys("0.1");
            //z.perform(TouchAction().tap(slider)).sleep(3000)
            //.quit();
            timeouts.push(z);
        });

        return q.all(timeouts);

    });
    it('scroll&slide',function(){
        var action=new wd.TouchAction(people[0].driver);
        console.log(action);
        return people[0].driver
            .sleep(15000)
            .execute(function(){tapClick({target: $('a[icon="ion-ios-chatboxes"]')[0]});}, [], null).sleep(3000)
            .execute(function(){tapClick({target: $('a[icon="ion-gear-a"]')[0]});}, [], null).sleep(3000)
            .execute(function(){tapClick({target: $('button[ng-click="change()"]')[0]});}, [], null).sleep(3000)
            .execute("mobile: scroll", [{direction: 'down'}]).sleep(3000)
            // .execute(function(){
            //     var action=new wd.TouchAction(people[0].driver);
            //     action.flick(0,-50).perform();
            // },[],null).sleep(3000);
            //.execute("mobile: scroll", [{direction: 'down'}], function(err) {})
            // .execute("mobile: swipe", [swipeOpts]);
    });
});