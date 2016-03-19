/// <reference path="ionic.bundle.js" />

var app = angular.module('Practice', ['ionic', 'indexedDB', 'angular.filter'])
    .run(function ($rootScope, $state, $ionicPlatform, $ionicLoading, ContactManager,memberDetailManager,ContactTreeManager) {
        
    var preUrl = null;
    localStorage.userId = '77f47c8e-a6ca-43a6-b738-6599c55c3197';
    localStorage.phone = '0935133943';

})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $indexedDBProvider) {
    //$ionicConfigProvider.views.maxCache(0);

    $stateProvider
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "views/tab.html",
        })
        .state('tab.contact', {
            url: '/contact',
            views: {
                'tab-contact': {
                    templateUrl: "views/contact.html",
                    controller: "contactCtrl"
                }
            }
        })
        .state('tab.peopleDetail', {
            url: '/peopleDetail/:peoId',
            views: {
                'tab-contact': {
                    templateUrl: "views/peopleDetail.html",
                    controller: "peopleDetailCtrl"
                }
            }
        })
        .state('tab.organization', {
            url: '/organization',
            views: {
                'tab-organization': {
                    templateUrl: "views/organization.html",
                    controller: "organizationCtrl"
                }
            }
        })
        .state('tab.setting', {
            url: "/setting",
            views: {
                'tab-setting': {
                    templateUrl: "views/setting.html",
                    controller: "settingCtrl"
                }
            }
        })
    ;

    $urlRouterProvider.otherwise('/tab/contact');
    $ionicConfigProvider.tabs.position('bottom');
    
     $indexedDBProvider
        .connection('Contact_indexedDB')
        .upgradeDatabase(1, function (event, db, tx) {
            var objStore;
            objStore = db.createObjectStore('ContactTree', { keyPath: 'id', autoIncrement: true });
            objStore = db.createObjectStore('memberDetail', { keyPath: 'id', autoIncrement: true });
            objStore = db.createObjectStore('Contact', { keyPath: 'id', autoIncrement: true });
        });
        
});