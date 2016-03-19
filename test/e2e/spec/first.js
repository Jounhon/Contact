"use strict";

require("./../helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./../helpers/appium-servers'),
    Q = require('q');
var path = require("path");


describe('test', function () {
    this.timeout(300000);
    var driver;
    var allPassed = true;

    before(function () {
        var serverConfig =  serverConfigs.local;
        driver = wd.promiseChainRemote(serverConfig);
        require("./../helpers/logging").configure(driver);

        var desired =   _.clone(require("./../helpers/caps").android19)
        desired.app = path.resolve(__dirname, "../app/schoolcontact.apk");
         desired.autoWebview = true;
        //desired.app = 'https://dl.dropboxusercontent.com/s/9rlhpjc2x0z4dmu/schoolcontact.apk';
        return driver
          .init(desired)
          .setImplicitWaitTimeout(3000);
    });


    //   after(function() {
    //  return driver
    //    .sleep(10000)
    //    .quit();
    //});


    var browser2, element2, browser3, element3;
    it('一對一聊天測試', function () {
        return driver
           .sleep(3000)
           .contexts()
          .then(function (ctxs) {
              return driver.context(ctxs[ctxs.length - 1]);
         })
         .sleep(15000)
         .execute(function() {
          tapClick({target: $('a[icon="ion-ios-chatboxes"]')[0]});
          .sleep(1000);
          //tapClick({target: $('ion-item[ng-click="href(item.id)"]')[0]});

       }, [], null);




        /* 
        webdriver-manager ok
        browser2 = browser.forkNewDriverInstance();
         element2 = browser2.element; 
         browser2.get('http://localhost:51222/www/index.html');
         browser2.sleep(1000); 
         BROWSER2.EXECUTESCRIPT(FUNCTION () {
            LOCALSTORAGE['PHONE'] = '0960634909';
         }); 
         element2.all(by.css('a[icon="ion-ios-chatboxes"]')).get(0).click();
         browser2.sleep(1000); */



        //browser2.refresh();
        //browser2.sleep(3000);

        //element2.all(by.css('a[icon="ion-ios-people"]')).get(0).click();
        //browser2.sleep(1000);

        //element2.all(by.css('ion-item[ng-click="toggleGroup(unit)"]')).get(0).click();
        //browser2.sleep(1000);
        //element2.all(by.css('ion-item[ng-click="toggleGroup(affair)"]')).get(0).click();
        //browser2.sleep(1000);
        //element2.all(by.css('ion-item[ng-click="href(dep.id)"]')).get(0).click();

        //browser2.sleep(1000);
        //element2.all(by.css('ion-item[ng-click="chat(people.id)"]')).get(0).click();

        //browser2.sleep(1000);
        //element2(by.model('msg.message')).sendKeys('發送訊息測試 1');
        //browser2.sleep(1000);
        //element2(by.css('button[ng-click="snedMessage()"]')).click();

        //browser2.sleep(1000);

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

});