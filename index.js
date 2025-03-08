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
module.exports.axios                                    = require('axios');
module.exports.https                                    = require('https');
module.exports.Promise                                  = require('bluebird');
module.exports.NodeSSH                                  = require('node-ssh').NodeSSH;
module.exports.random                                   = require('random');




// UI Services
module.exports.buildDriver                             = require('./services/ui_services/driver').buildDriver,
module.exports.killAllSessionsOnGrid                   = require('./services/ui_services/driver').killAllSessionsOnGrid,
module.exports.getDriver                               = require('./services/ui_services/driver').getDriver,
module.exports.getFirstSessionOnGrid                   = require('./services/ui_services/driver').getFirstSessionOnGrid,
module.exports.go                                      = require('./services/ui_services/go').go,
module.exports.takeScreenshot                          = require('./services/ui_services/driver').takeScreenshot,
module.exports.click                                   = require('./services/ui_services/click').click,
module.exports.rightClick                              = require('./services/ui_services/click').rightClick,
module.exports.doubleClick                             = require('./services/ui_services/click').doubleClick,
module.exports.see                                     = require('./services/ui_services/locator').see,
module.exports.notSee                                  = require('./services/ui_services/locator').notSee,
module.exports.write                                   = require('./services/ui_services/write').write,
module.exports.keyboard                                = require('./services/ui_services/write').keyboard,
module.exports.scroll                                  = require('./services/ui_services/scroll').scroll,
module.exports.getText                                 = require('./services/ui_services/get-text').getText,



// Services
module.exports.testFlow                                = require('./services/test-flow').testFlow,
module.exports.jump                                    = require('./services/test-flow').jump,
module.exports.log                                     = require('./services/logger').log,
module.exports.now                                     = require('./services/logger').now,
module.exports.wait                                    = require('./services/logger').wait,
module.exports.wait_                                   = require('./services/logger').wait_,
module.exports.translate                               = require('./services/core').translate,
module.exports.generateRandomNamedDirectory            = require('./services/core').generateRandomNamedDirectory,
module.exports.cleanEmptyFoldersRecursively            = require('./services/core').cleanEmptyFoldersRecursively,
module.exports.importParameter                         = require('./services/core').importParameter,
module.exports.exportParameter                         = require('./services/core').exportParameter
module.exports.overrideRepo                            = require('./services/core').overrideRepo,
module.exports.myQuery                                 = require('./services/db').myQuery
module.exports.pgQuery                                 = require('./services/db').pgQuery
module.exports.api                                     = require('./services/request')
module.exports.ssh                                     = require('./services/ssh')






