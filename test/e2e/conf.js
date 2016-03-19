exports.config = {
    framework: 'mocha',
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    specs: ['spec/test_.js'],
    multiCapabilities: [{
        browserName: 'chrome'
    }]
};