#!/usr/bin/env node

const log = require('./services/logger').log;
const config = require('./services/config');




global.senteConfig = config;
global.environments = {};
global.testDataTransfer = {};
global.config = {}; // For Test Run Config



// error handler
process
  .on('unhandledRejection', (reason) => {
    log.error('Unhandled Rejection at Promise');
    log.error(reason);
  })
  .on('uncaughtException', err => {
    log.error('Uncaught Exception thrown');
    log.error(err);
  });
  
// clear console  
// process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc');
