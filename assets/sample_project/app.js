
let app = {};

module.exports = {};

global.senteConfig.languages = require('./languages');
global.environments = require('./environments');
global.repo = require('./object_repository');
global.helper = require('#helpers');
global.senteConfig.testRunProjectPath = require('path').resolve(__dirname, '.') ;  // this project path