const log = require('./logger').log;
const now = require('./logger').now;
const isObject = require('isobject');
const argv = require('minimist')(process.argv.slice(2))
const table = require('cli-table3');
const colors = require('chalk');
const { wait,wait_ } = require('./logger');
const core = require('./core');
const driver = require('./ui_services/driver');
const figures = require('figures');
const path = require('path');


testFlow = {};


let sectionProperties = [];
let currentSectionIndex = 0;
let sectionErrors = [];
let jumpToSectionIndex = -1; // if jump command run, set to this index


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


            
            /*  set default parameters - [Start] */
            
                /* current_language, keyword for translate languge  */
                if(!global.senteConfig.languages.keywords) global.senteConfig.languages.keywords = global.senteConfig.defaultLanguageKeywords
                if(!global.config.current_language) global.config.current_language = global.senteConfig.defaultLanguage;

                /* This parameter determines how many times the test run will be re-run if the test case receives an error. If it is zero, the test will not be re-run in case of an error. */
                if(!global.config.number_of_test_run_repetitions_on_error) global.config.number_of_test_run_repetitions_on_error = 0; 
                global.config.number_of_test_run_repetitions_on_error = Number(global.config.number_of_test_run_repetitions_on_error);
                if(Number(global.config.number_of_test_run_repetitions_on_error) > 10) global.config.number_of_test_run_repetitions_on_error = 10;

                /* download_path, default download directory path on worker*/
                if(!global.config.download_path && !config.run_on_sente_cloud) global.config.download_path = path.join(senteConfig.testRunProjectPath,'files','downloads') ;
               
                /* screenshot_directory, default screenshot download directory path fro web-gui tests*/
                if(!global.config.screenshot_directory) global.config.screenshot_directory = path.join(senteConfig.testRunProjectPath,'files','screen_shots') ;

                    
                

            
            /*  set default parameters - [End]*/


}
let printTestInfo = (testData) => { 


    // Test Info Table
    let configTable = new table({
        colWidths: [45,100],
        wordWrap: true
    });

    let configTableForSenteCloud = [];    
   

    
    configTable.push([{ colSpan: 2,hAlign: 'center', content: colors.blueBright.bold('CONFIGURATION TABLE')}])
    configTable.push([ {hAlign: 'right', content:colors.blue('Test Name:' )}, colors.whiteBright.bold(testData.testDefinations.test_name) ])
    configTable.push([ {hAlign: 'right', content:colors.blue('\nStart Date:')}, colors.whiteBright(now('YYYY/MM/DD  HH:mm:ss'))])
    configTable.push([colors.blue('Configs'),colors.blue('Values')])
   

    configTableForSenteCloud.push(['Test Name',testData.testDefinations.test_name])
    configTableForSenteCloud.push(['Start Date',now('YYYY/MM/DD  HH:mm:ss')])
    configTableForSenteCloud.push(['Sente Version',senteConfig.senteVersion])


    global.config = {...testData.testDefinations, ...global.config}
    config.file_path = (config.file_full_path).replace(config.project_path,'')

    let tableData = global.config;


    for(row of Object.entries(tableData)) {

        let value = '';
        try{       
            if(Array.isArray(row[1])) {

                for ( let [index,value_]  of row[1].entries() ) {

                    if(isObject(value_)) value += (JSON.stringify(value_)).toString();
                    else value += value_.toString();

                    if(index + 1 < row[1].length) value += ' , ';
                }
                
            }
            else if(isObject(row[1])) value = JSON.stringify(row[1]).toString();
            else value = row[1] 
        } catch (e) {value = colors.red('cannot be shown')}

        // tabloda görünmesini istemediğimiz configleri kaldır ve tablo array lerini oluştur
        if(    !row[0].includes('file_path') 
            && !row[0].includes('test_name') 
            && !row[0].includes('download_path') 
            && !row[0].includes('download_path_on_grid') 
            && !row[0].includes('screenshot_directory') 
            && !row[0].includes('file_name') 
            && !row[0].includes('file_full_path') 
            && !row[0].includes('run_on_sente_cloud')             
            && !row[0].includes('project_path') 
            && !row[0].includes('take_screenshoot')                         
            && !(tableData.test_type !== 'web-gui'  && row[0].includes('browser_type') ) 
            && !(tableData.test_type !== 'web-gui'  && row[0].includes('driver_host') ) 
            && !(row[0] === 'number_of_test_run_repetitions_on_error' && Number(value) === 0) 
        ) {

            if(row[0] ==='sente_timeout') value = value.toString() + ' seconds'            

            configTable.push([row[0], value.toString()])
            configTableForSenteCloud.push([row[0], value.toString()])

        }
    }
    
    if(config.run_on_sente_cloud) {
           
        console.log('\n\n CONFIGURATION TABLE')
        for ( let element of configTableForSenteCloud ) {
            console.log(element[0] + ' : ' + element[1])
        }
        console.log('CONFIGURATION_TABLE_END');


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

                
                /*DOWNLOAD PATH MEKANİZMASI
                Workerdaki /usr/src/app/downloads dizini ile driverdaki  /home/seluser/Downloads dizini , Host makinadaki DRIVER_DOWNLOAD_DIRECTORY diziniyle bağlanmalıdır.
                    # Çalışan test, browser download larını worker içindeki  /usr/src/app/downloads dizinine yapmalıdır.
                    # Bu nedenle test sente üzerinde çalışırken, kullanıcının download_path değişkenini ezer ve download_path="/usr/src/app/downloads" yapar. */
                if(global.config.run_on_sente_cloud) global.config.download_path = '/usr/src/app/downloads'                
                global.config.download_path_on_grid = '/home/seluser/Downloads'; /* download_path_on_grid, default download directory path on Selenium Grid*/


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

let runSections = async(sections) => {
        
    
    return new Promise( async (resolve,reject)=> {
        try{
    
            for (let index = 0 ; index < sections.length ; index++) {

                // set current section index
                currentSectionIndex = sectionProperties.findIndex(section => section.sectionName === sections[index].sectionName);
                

                let value = sections[index];

                // eğer jumpToSectionIndex -1 den büyükse, bu iterasyonu koşma, sections ları jump indexe göre düzenle ve iterasyonu baştan başlat.
                if(jumpToSectionIndex > -1){
                     
                    sections = sectionProperties.slice(jumpToSectionIndex);
                    jumpToSectionIndex = -1;

                    index = -1
                    continue;
                }

                

                
                // set section rule info
                let ruleInfoString = 'If this section fails' ;
                if(value.reRun > 0) ruleInfoString += ', it will retry the run ' + colors.blueBright(value.reRun) +' times';
                if(value.reRun > 0 ) ruleInfoString += ' and if the error persists'
                if(value.jumpToSectionIndex > -1) ruleInfoString += `, it will jump to ` + colors.blueBright(sectionProperties[value.jumpToSectionIndex].sectionName); 

                let failOptionsString = '';
                switch (value.failOptions) {
                    case 'exitAndFailed': failOptionsString = ', test will terminate and fail'; break;
                    case 'continueAndNoFailed': failOptionsString = ', continue and run the next sections'; break;
                    case 'continueAndFailed': failOptionsString = ', continue, run the next sections, fail the test at the end'; break;
                }
                ruleInfoString +=  failOptionsString;      

                // run section
                let sectionErrorCount = 0;
                let sectionRunCount= 0;
                let sectionRunnable = true;

                while(sectionRunnable){

                    try {
                    
                        sectionRunCount ++;

                        // print section info                        
                        console.log('[' + now() + '] ' + colors.green(figures.play + `  ${value.sectionName} running`) + (value.reRun > 0 ? `[Run Count: ${sectionRunCount}]` : '') )
                        // if any rule and runCount first, print rule info
                        if(sectionRunCount === 1 ) console.log('[' + now() + '] ' + colors.white(figures.hamburger + ' Section Rule: ') + ruleInfoString)


                        
                        await value.function();
                        sectionRunnable = false;
    
                    }
                    catch (e) {
                        sectionErrorCount ++;
                        
                        // print error status
                        let printError = '[' + now() + '] ' + colors.red(`${value.sectionName} Failed.`)
                        if(sectionErrorCount < value.reRun) printError += colors.blueBright(' Section will re-run.');
                        if(value.reRun > 0) printError += ' [Run Count: ' + colors.blueBright(sectionRunCount) + ', Remaining Re-Run Count: ' + colors.blueBright(value.reRun-sectionRunCount) + ']'
                        console.log(printError);
                        log.error(e)


                        // ReRun Count bitti, tekrar koşturulmayacak.
                        if(sectionErrorCount >= value.reRun) { 
                            sectionRunnable = false;

                            // handle FailOptions
                            switch (value.failOptions) {
                                case 'exitAndFailed': 
                                    throw new Error(e);
                                    break;
                                
                                case 'continueAndNoFailed':
                                    // no any action, continue other section    
                                    break;

                                case 'continueAndFailed': 
                                    sectionErrors.push(e);
                                    break;
                            }


                            // eğer jump varsa ilgili sectiona atla
                            if(value.jumpToSectionIndex > -1) {
                                testFlow.jump(sectionProperties[value.jumpToSectionIndex].sectionName)                                                           

                            }


                        }
    
    
                    }

                }

                

            }
            resolve();
    
        }
        catch (e) {
    
            reject(e);
    
        }
    });
    

}



testFlow.testFlow = async(testData = {} ) => {

        let testStartDate = new Date().getTime();
        let senteTimeout;

        try {


            // testData validations
            if (!testData.testDefinations) throw new Error('Test Definations Undefined!')
            if (!testData.testDefinations.test_name || !testData.testDefinations.test_type) throw new Error('Test Name or Test Type Undefined!')

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
            

            // Set Timeout
            if(config.sente_timeout)  senteTimeout = setTimeout(() => { throw new Error(`<< TEST TIMEOUT! >> You are getting this error because the test did not finish within ${config.sente_timeout} seconds. If you think this time is incorrect or short, check the value of the 'sente_timeout' parameter in your config file.`) }, Number(config.sente_timeout) * 1000)            



            //Handle Test Run Count     
            for(let testRunCount = 1; testRunCount <= config.number_of_test_run_repetitions_on_error + 1; testRunCount++){



                try {

                    /* set default */
                     sectionProperties = [];
                     currentSectionIndex = 0;
                     sectionErrors = [];
                     jumpToSectionIndex = -1;
                     
                     global.isFirstPage = true; // Go ile bir sayfa çağrıldığında, tüm test akışı içindeki açılan ilk safya mı olduğunu flag ler. Go ilk çağrıldıktan sonra bu değişken false olur.
                    
                    // generate driver for web-gui tests
                    if(config.test_type === 'web-gui') await driver.buildDriver(); 

                    // print test start info  for only first run
                    console.log('\n\n');
                    console.log('[' + now() + '] ' + colors.green('Test started.' + ( Number(config.number_of_test_run_repetitions_on_error) > 0  ? ` [Run Count: ${testRunCount}]`:'') ) )
    
                
                    /* Start Test Run
                    **************************************************************************************/
                    
        
                        // Have any sections?
                        if( Object.keys(section).length === 0){
        
                            await global.test();
        
                        }
                        else {               
        
                                
                            // get section properties
                            for await (let [index, key] of Object.keys(section).entries()) {
                                if (section.hasOwnProperty(key)) {
                                    
                                    let key_ = key.split('|');
                                    let sectionName = key_[0].trim();
                                    sectionProperties.push({sectionName: sectionName, function: section[key]})
        
                                    // set default
                                    sectionProperties[index]['reRun'] = 0;
                                    sectionProperties[index]['jumpToSectionIndex'] = -1;
                                    sectionProperties[index]['failOptions'] = 'exitAndFailed';
        
                                    // handle runs
                                    if (key_.length > 1) {
        
                                        let sectionRules_ = key_[1].split(',');                            
        
                                        if(sectionRules_.length>0) {
                                            for await ( let value of sectionRules_ ) {
        
                                                
                                                
                                                //get reRun rule
                                                if(value.toString().toLowerCase().includes('rerun')) {
                                                    let reRunValue = value.split(':')[1];
                                                    if(reRunValue) sectionProperties[index]['reRun'] = (Number(reRunValue) > 3 ? 3 : Number(reRunValue)); 
                                                }
        
                                                // get Jump rule
                                                if(value.toString().toLowerCase().includes('jump')) {
                                                    let jumpValue = value.split(':')[1];
                                                    if(jumpValue) {
                                                        
                                                        // jumpValue değerini içeren sections objesindeki keyin indexini bul 
                                                        let jumpIndex = Object.keys(section).findIndex(secKey => secKey.split('|')[0].trim() === jumpValue.toString().trim());
                                                        sectionProperties[index]['jumpToSectionIndex'] = jumpIndex;
        
                                                    }
                                                }
        
                                                // get failOptions rule
                                                if(value.toString().toLowerCase().includes('failoptions')) {
                                                    let throwError = value.split(':')[1];
                                                    if(throwError && throwError.toString().toLowerCase().includes('exitandfailed')) {
                                                        sectionProperties[index]['failOptions'] = 'exitAndFailed';
        
                                                    }
                                                    if(throwError && throwError.toString().toLowerCase().includes('continueandnofailed')) {
                                                        sectionProperties[index]['failOptions'] = 'continueAndNoFailed';
        
                                                    }
                                                    if(throwError && throwError.toString().toLowerCase().includes('continueandfailed')) {
                                                        sectionProperties[index]['failOptions'] = 'continueAndFailed';
        
                                                    }
                                                }
        
        
                                            }
                                            
        
        
                                        }
                                        
                                    }
        
        
                                    // if jump rule > -1  and failOptions=exitAndFailed , failOptions default to continueAndFailed
                                    if( sectionProperties[index]['failOptions'] === 'exitAndFailed' &&  sectionProperties[index]['jumpToSectionIndex'] > -1)  sectionProperties[index]['failOptions'] = 'continueAndFailed'
                
                                    
                                }
                            }
        
        
                            // run sections
                            await runSections(sectionProperties);
                            
        
                        }
        
                    
                        
                    /* End Test Run
                    **************************************************************************************/
                    
                    if(sectionErrors.length>0) throw new Error(sectionErrors);
                    
                    break;


                
                }
                catch (e) {

                    log.error(e);
                    
                    if(testRunCount === Number(config.number_of_test_run_repetitions_on_error) + 1){

                        if(sectionErrors.length>0) throw new Error(sectionErrors);
                        else throw new Error(e);

                    } 
                
                }
            
                
            } 
            
            // Clear timeout
            clearTimeout(senteTimeout);

            // set test duration
            let testDuration = core.duration({startDate: testStartDate})

            // take screenshot for web-gui tests
            if(config.test_type === 'web-gui') await driver.takeScreenshot('TEST FINISHED SUCCESS').catch(e => {})
                

            // test closing information            
            console.log('[' + now() + '] ' + colors.green(`Test finished success. [Test Duration: ${testDuration}] `))
            if(config.run_on_sente_cloud) console.log('<sente>test_success</sente>');
            
            // Step bilgisi doluysa, en son step bilgisini yazdır
            if(global.steps && global.steps.length>0) {

                console.log('');
                
                for ( let [index,value]  of global.steps.entries() ) {                            

                    let text = colors.blue.bold(`[STEP-${index+1}] `) + colors.blue(value) + ' ' + colors.green(figures.tick + ' Passed');
                    console.log(text);                    
                
                }
            }


            log.passed();
          
        }
        catch (e) {

            // Clear timeout
            clearTimeout(senteTimeout);

            // set test duration
            let testDuration = core.duration({startDate: testStartDate})
            
            // take screenshot for web-gui tests
            if(config.test_type === 'web-gui') await driver.takeScreenshot('TEST FAILED').catch(e => {})

            // test closing information for Failed test status
            console.log('[' + now() + '] ' + colors.red(`Test failed! [Test Duration: ${testDuration}]`))       
            
            // Step bilgisi doluysa, en son step bilgisini yazdır
            if(global.steps && global.steps.length>0) {

                console.log('');
                
                for ( let [index,value]  of global.steps.entries() ) {                   

                    if(index +1 >= global.steps.length) {
                        let text = colors.blue.bold(`[STEP-${index+1}] `) + colors.blue(value) + ' ' + colors.red(figures.cross + ' Failed');
                        console.log(text);                    
                    }
                    else {
                        let text = colors.blue.bold(`[STEP-${index+1}] `) + colors.blue(value) + ' ' + colors.green(figures.tick + ' Passed');
                        console.log(text);                    
                    }
                                    
                
                }
            }

            log.failed(e);


            // process exit
            setTimeout(_=>{process.exit();},500);

        }
        finally { 

            // Clear timeout
            clearTimeout(senteTimeout);

            // process exit
            setTimeout(_=>{process.exit();},500);
            
            
        }
    
};

testFlow.jump = (sectionName='') => {
        
        if(sectionProperties.length>0){

            // section name validating
            if(sectionName.toString().trim() === '') throw new Error ('Section Name Undefined!')

            // jump index
            let jumpIndex = sectionProperties.findIndex(section => section.sectionName === sectionName);
            if (jumpIndex === -1) throw new Error(`Section "${sectionName}" not found!`);
            
        
            // print command info
            log.uiCommand('JUMP', sectionProperties[jumpIndex].sectionName)

            // if jump to current section, throw error
            if(currentSectionIndex === jumpIndex){
                throw new Error('You cannot jump to the same section')
            }  else jumpToSectionIndex = jumpIndex;

        }
        else {
            throw new Error(`The JUMP command cannot be used because there is no section for the test.`);
        }



        




}
    




module.exports = testFlow;