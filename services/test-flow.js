const log = require('./logger').log;
const now = require('./logger').now;
const isObject = require('isobject');
const argv = require('minimist')(process.argv.slice(2))
const table = require('cli-table3');
const colors = require('chalk');
const { wait } = require('./logger');
const core = require('./core');
const driver = require('./ui_services/driver');




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
        colWidths: [35,100],
        wordWrap: true
    });

    let configTableForSenteCloud = [];    
   

    
    configTable.push([{ colSpan: 2,hAlign: 'center', content: colors.blueBright.bold('CONFIGURATION TABLE')}])
    configTable.push([ {hAlign: 'right', content:colors.blue('Test Name:' )}, colors.whiteBright.bold(testData.testDefinations.test_name) ])
    configTable.push([ {hAlign: 'right', content:colors.blue('\nStart Date:')}, colors.whiteBright(now('YYYY/MM/DD  HH:mm:ss'))])
    configTable.push([colors.blue('Configs'),colors.blue('Values')])
   

    configTableForSenteCloud.push(['Test Name',testData.testDefinations.test_name])
    configTableForSenteCloud.push(['Start Date',now('YYYY/MM/DD  HH:mm:ss')])


    global.config = {...testData.testDefinations, ...global.config}
    config.file_path = (config.file_full_path).replace(config.project_path,'')

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
        configTableForSenteCloud.push([row[0], value.toString()])
    }
    
    if(config.run_on_sente_cloud) {
        console.log(global.senteConfig.senteLogoForCloud);   

        console.log('\n CONFIGURATION TABLE')
        console.log('---------------------')
        configTableForSenteCloud.forEach((element,index) => {
            console.log(element[0] + ' : ' + element[1])
        });

    }
    else {
        console.log(global.senteConfig.senteLogo)
        console.log(configTable.toString());
    }
    


}
let overrideConfigs = (testData) => {




    try{

        if(testData.argv.config) {

            let config_ = JSON.parse(testData.argv.config);

            if(isObject(config_)){
                config = {...config,...config_};
                config.project_path = senteConfig.testRunProjectPath; // set project main directory
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

        let testStartDate = new Date().getTime();

        try {


            // testData validations
            if (!testData.callback) throw new Error('Callback Test Undefined!')
            if (!testData.testDefinations) throw new Error('Test Definations Undefined!')
            if (!testData.testDefinations.test_name || !testData.testDefinations.test_type) throw new Error('Test Name or Test Type Undefined!')
            if (!testData.buildDriver) throw new Error('Build Driver class Undefined!')

                // replace sente keywords with space
                testData.testDefinations.test_name = testData.testDefinations.test_name.replace('<senteTestName>','');                        
                testData.testDefinations.test_name = testData.testDefinations.test_name.replace('</senteTestName>','');
                testData.testDefinations.test_type = testData.testDefinations.test_type.replace('<senteTestType>','');
                testData.testDefinations.test_type = testData.testDefinations.test_type.replace('</senteTestType>','');
                testData.testDefinations.test_name = testData.testDefinations.test_name.trim();
                testData.testDefinations.test_type = testData.testDefinations.test_type.trim();

            if ( senteConfig.testTypes.indexOf(testData.testDefinations.test_type) === -1) throw new Error('Test Type Undefined!')
            
            // set test preparations
            await setEnvironment(testData);
            await overrideConfigs(testData);
            await printTestInfo(testData);
            



            console.log('\n');
            console.log('[' + now() + '] ' + colors.green('Test started.'))

            // generate driver for web-gui tests
            if(config.test_type === 'web-gui') await testData.buildDriver(); 

            // start test
            await testData.callback();

            // set test duration
            let testDuration = core.duration({startDate: testStartDate})

            // take screenshot for web-gui tests
            if(config.test_type === 'web-gui') await driver.takeScreenshot().catch(e => {})
                
            // kill drivers for web-gui tests
            if(config.test_type === 'web-gui' && !config.attach_to_active_web_gui_session ) await driver.killAllSessionsOnGrid(config.grid_host).catch(e=>{ })
        
            // test closing information            
            console.log('[' + now() + '] ' + colors.green(`Test finished success. [Test Duration: ${testDuration}] `))
            if(config.run_on_sente_cloud) console.log('<sente>test_success</sente>');
            
            log.passed();
          
        }
        catch (e) {
            // set test duration
            let testDuration = core.duration({startDate: testStartDate})
            
            // take screenshot for web-gui tests
            if(config.test_type === 'web-gui') await driver.takeScreenshot().catch(e => {})

            // kill drivers for web-gui tests
            if(config.test_type === 'web-gui' && !config.attach_to_active_web_gui_session ) await driver.killAllSessionsOnGrid(config.grid_host).catch(e=>{ })

            // test closing information for Failed test status
            console.log('[' + now() + '] ' + colors.red(`Test failed! [Test Duration: ${testDuration}]`))
            log.failed(e);

            // process exit
            setTimeout(_=>{process.exit();},3000);

        }
        finally { 

            // process exit
            setTimeout(_=>{process.exit();},3000);
            
            
        }
    
    }

}