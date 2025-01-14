module.exports = {}

const app = require('./app');

// Set webdriver class and methods
const webdriver                                         = require('selenium-webdriver');
webdriver.By                                            = require('selenium-webdriver').By;
webdriver.until                                         = require('selenium-webdriver').until;
webdriver.Capabilities                                  = require('selenium-webdriver').Capabilities;
webdriver.WebDriver                                     = require('selenium-webdriver').WebDriver;
webdriver.firefox                                       = require('selenium-webdriver/firefox');
webdriver.chrome                                        = require('selenium-webdriver/chrome');

        
// External libraries
module.exports.argv                                     = require('minimist')(process.argv.slice(2));
module.exports.webdriver                                = webdriver;



// UI Services
module.exports.buildDriver                             = require('./services/ui_services/driver').buildDriver,
module.exports.killAllSessionsOnGrid                   = require('./services/ui_services/driver').killAllSessionsOnGrid,
module.exports.getDriver                               = require('./services/ui_services/driver').getDriver,
module.exports.getFirstSessionOnGrid                   = require('./services/ui_services/driver').getFirstSessionOnGrid,
module.exports.go                                      = require('./services/ui_services/go').go,
module.exports.takeScreenshot                          = require('./services/ui_services/driver').takeScreenshot,
module.exports.click                                   = require('./services/ui_services/click').click,
module.exports.rightClick                              = require('./services/ui_services/click').rightClick,
module.exports.see                                     = require('./services/ui_services/locator').see,
module.exports.notSee                                  = require('./services/ui_services/locator').notSee,
module.exports.write                                   = require('./services/ui_services/write').write,
module.exports.keyboard                                = require('./services/ui_services/write').keyboard,




// Services
module.exports.testFlow                                = require('./services/test-flow').testFlow,
module.exports.jump                                    = require('./services/test-flow').jump,
module.exports.log                                     = require('./services/logger').log,
module.exports.now                                     = require('./services/logger').now,
module.exports.wait                                    = require('./services/logger').wait,
module.exports.wait_                                   = require('./services/logger').wait_,
module.exports.translate                               = require('./services/core').translate,
module.exports.generateRandomNamedDirectory            = require('./services/core').generateRandomNamedDirectory,
module.exports.random                                  = require('./services/core').random,
module.exports.cleanEmptyFoldersRecursively            = require('./services/core').cleanEmptyFoldersRecursively,
module.exports.importParameter                         = require('./services/core').importParameter,
module.exports.exportParameter                         = require('./services/core').exportParameter
module.exports.overrideRepo                            = require('./services/core').overrideRepo,
module.exports.myQuery                                 = require('./services/db').myQuery
module.exports.pgQuery                                 = require('./services/db').pgQuery








// Sente Services to Global 

// logger service
// global.log                                              = require('./services/logger').log;
// global.now                                              = require('./services/logger').now;
// global.wait                                             = require('./services/logger').wait;
// global.wait_                                            = require('./services/logger').wait_;


// // core service
// global.translate                                        = require('./services/core').translate;
// global.overrideRepo                                     = require('./services/core').overrideRepo;
// global.random                                           = require('./services/core').random;
// global.importParameter                                  = require('./services/core').importParameter;
// global.exportParameter                                  = require('./services/core').exportParameter;
// global.jump                                             = require('./services/test-flow').jump;



// // Ui services
// global.go                                               = require('./services/ui_services/go').go;
// global.takeScreenshot                                   = require('./services/ui_services/driver').takeScreenshot;
// global.see                                              = require('./services/ui_services/locator').see;
// global.notSee                                           = require('./services/ui_services/locator').notSee;
// global.click                                            = require('./services/ui_services/click').click;
// global.rightClick                                       = require('./services/ui_services/click').rightClick;
// global.doubleClick                                      = require('./services/ui_services/click').doubleClick;
// global.write                                            = require('./services/ui_services/write').write;


