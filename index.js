module.exports = {}

const app = require('./app');




        
// External libraries
module.exports.argv                                    = require('minimist')(process.argv.slice(2)),



// UI Services
module.exports.click                                   = require('./services/ui_services/click').click,
module.exports.select                                  = require('./services/ui_services/select').select,



// Services
module.exports.log                                     = require('./services/logger').log,
module.exports.now                                     = require('./services/logger').now,
module.exports.testFlow                                = require('./services/test-flow').testFlow,
module.exports.dirSeparator                            = require('./services/core').dirSeparator,
module.exports.wait                                    = require('./services/core').wait,
module.exports.wait_                                   = require('./services/core').wait_,
module.exports.translate                               = require('./services/core').translate,
module.exports.generateRandomNamedDirectory            = require('./services/core').generateRandomNamedDirectory,
module.exports.random                                  = require('./services/core').random,
module.exports.cleanEmptyFoldersRecursively            = require('./services/core').cleanEmptyFoldersRecursively,





// Sente Services to Global 

// logger service
global.log                                              = require('./services/logger').log;
global.now                                              = require('./services/logger').now;
global.wait                                             = require('./services/logger').wait;
global.wait_                                            = require('./services/logger').wait_;



// core service
global.translate                                        = require('./services/core').translate;
global.overrideRepo                                     = require('./services/core').overrideRepo;
global.dirSeparator                                     = require('./services/core').dirSeparator;
global.random                                           = require('./services/core').random;
