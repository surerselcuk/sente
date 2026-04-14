global.senteConfig.languages = require('./languages');
global.senteConfig.testRunProjectPath = require('path').resolve(__dirname, '.') ;  // this project path
global.environments = require('./environments');
try {
    global.localConfigs = require('./environments/local.configs.js');
} catch (e) {console.log('No local.configs.js file found. If you want to use local configurations, please generate a local.configs.js file in the environments directory.')}

global.repo = require('#object_repository');
global.helper = require('#helpers');
global.senteConfig.defaultEnvironment = 'dev-env1';

module.exports = {
    helper          : require('#helpers'),
    repo            : require('./object_repository')

};
