const log = require('./logger').log;
const now = require('./logger').now;
const isObject = require('isobject');
const argv = require('minimist')(process.argv.slice(2))
const table = require('cli-table3');
const colors = require('chalk');



let setEnvironment = (testData) => {

            // Set Environments     

            if(testData.argv.env && (testData.argv.env).indexOf('prod-') === -1 && (testData.argv.env).indexOf('dev-') === -1 )  throw new Error (`Test Environment [${argvForEnvironment}] Undefined!`)

                

            let argvForEnvironment;            
            if(testData.argv.env)  argvForEnvironment = testData.argv.env; 
            else argvForEnvironment = global.senteConfig.defaultEnvironment;
            

            let select_environment = argvForEnvironment.split('-');
            let environment_parent;
                

            // set environment parent
            switch (select_environment[0].toLowerCase()) {
                case 'prod':
                    environment_parent = 'production'
                    break;
                case 'dev':
                    environment_parent = 'development'
                    break;
            
                default:
                    throw new Error (`Test Environment [${argvForEnvironment}] Undefined!`)
                    break;
            }

            // set environment child
            let environment_child = select_environment[1].toLowerCase();                

            // set configs
            if(!global.environments[environment_parent][environment_child]) throw new Error (`Test Environment [${argvForEnvironment}] Undefined!`)
            else global.config = global.environments[environment_parent][environment_child];

            // set current language
            if(!global.senteConfig.languages.keywords) global.senteConfig.languages.keywords = global.senteConfig.defaultLanguageKeywords
            if(!global.config.current_language) global.config.current_language = global.senteConfig.defaultLanguage;

            }
let printTestInfo = (testData) => {


    // Test Info Table
    let configTable = new table({
        colWidths: [25,75],
        wordWrap: true
    });
    
    configTable.push([{ colSpan: 2,hAlign: 'center', content: colors.blueBright.bold('CONFIGURATION TABLE')}])
    configTable.push([ {hAlign: 'right', content:colors.blue('Test Name:' )}, colors.whiteBright.bold(testData.testDefinations.test_name) ])
    configTable.push([ {hAlign: 'right', content:colors.blue('\nStart Date:')}, colors.whiteBright(now('YYYY/MM/DD  HH:mm:ss'))])
    configTable.push([colors.blue('Configs'),colors.blue('Values')])
   
    global.config = {...testData.testDefinations, ...global.config}
    let tableData = global.config;
    delete tableData.test_name;


    for(row of Object.entries(tableData)) {

        let value;
        try{       
            if(Array.isArray(row[1])) value = row[1].toString();
            else if(isObject(row[1])) value = JSON.stringify(row[1]).toString();
            else value = row [1] 
        } catch (e) {value = color.red('cannot be shown')}


        configTable.push([row[0], value.toString()])
    }
    
    console.log(global.senteConfig.senteLogo)
    console.log(configTable.toString());

}
let overrideConfigs = (testData) => {




    try{

        if(testData.argv.config) {

            let config_ = JSON.parse(testData.argv.config);

            if(isObject(config_)){
                config = {...config,...config_};
            } else {
                throw new Error ( '--config paremeter error' )
            }

        }
    }

    catch (e) {

        log.error('[Override Test Config Error]')
        log.error(e);

    }
    
}

module.exports = {

    testFlow : async(testData = {} ) => {

        try {

            // testData validations
            if (!testData.callback) throw new Error('Callback Test Undefined!')
            if (!testData.testDefinations) throw new Error('Test Definations Undefined!')
            if (!testData.testDefinations.test_name || !testData.testDefinations.test_type) throw new Error('Test Name or Test Type Undefined!')
            

            await setEnvironment(testData);
            await overrideConfigs(testData);
            await printTestInfo(testData);
            

              






            console.log('\n');
            log('Test started.');
            await testData.callback();
          
        }
        catch (e) {
    
            
            log.error(e,{boxen:true});
        }
        finally { 
            
            
        }
    
    }

}