#!/usr/bin/env node

const log = require('./services/logger').log;
const config = require('./services/config');




global.senteConfig = config;
global.environments = {};
global.testDataTransfer = {};
global.config = {}; // For Test Run Config
global.senteConfig.project_path = require('path').resolve(__dirname, '.') ;  // project directory


// error handler
process
  .on('unhandledRejection', (reason) => {  
    log.error(reason,'Unhandled Rejection at Promise');
    process.exit();
  })
  .on('uncaughtException', err => {    
    log.error(err,'Uncaught Exception thrown');
    process.exit();
  });
  
// clear console  
// process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc');
