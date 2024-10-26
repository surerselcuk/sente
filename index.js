const app = require('./app');


module.exports = {

        
    // Libraries
    argv : require('minimist')(process.argv.slice(2)),



    // UI Services
    click:              require('./services/ui_services/click').click,
    select:             require('./services/ui_services/select').select,




    // Services
    testFlow:           require('./services/test-flow').testFlow,
    dirSeparator:       require('./services/core').dirSeparator,
    wait:               require('./services/core').wait,
    log:                require('./services/logger').log,
    now:                require('./services/logger').now,
    translate:          require('./services/core').translate,





}


// Sente Services to Global 
global.log = require('./services/logger').log;
global.wait = require('./services/core').wait;
global.now = require('./services/logger').now;
global.translate = require('./services/core').translate;
