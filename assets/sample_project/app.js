global.senteConfig.languages = require('./languages');
global.senteConfig.testRunProjectPath = require('path').resolve(__dirname, '.') ;  // this project path
global.environments = require('./environments');
global.repo = require('#object_repository');
global.helper = require('#helpers');
global.senteConfig.defaultEnvironment = 'dev-env1';

module.exports = {
    helper          : require('#helpers'),
    repo            : require('./object_repository')

};
