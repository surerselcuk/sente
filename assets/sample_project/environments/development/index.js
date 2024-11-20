// Development Environments


module.exports = {

    
    env1: {
        environment_name: 'Dev Test Environment 1',
        ...require('./env1/test.config'),
        ...require('./env1/hardware.config'),
        ...require('./global.configs/test.config'),
        ...require('./global.configs/hardware.config')
    },
    env2: {
        environment_name: 'Dev Test Environment 2',
        ...require('./env2/test.config'),
        ...require('./env2/hardware.config'),
        ...require('./global.configs/test.config'),
        ...require('./global.configs/hardware.config')
    },
    


}