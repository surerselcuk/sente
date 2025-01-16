// Development Environments
exports = {}

exports.env1 = {
  environment_name: 'Dev Test Environment 1',
  ...require('./env1/configs-1'),
  ...require('./env1/configs-2'),
  ...require('./global.configs'),    
};



module.exports = exports