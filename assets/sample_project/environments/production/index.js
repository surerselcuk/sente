// Production Environments
exports = {}

exports.env1 = {
  environment_name: 'Prod Test Environment 1',
  ...require('./env1/configs-1'),
  ...require('./env1/configs-2'),
  ...require('./global.configs'),    
};







module.exports = exports