const {sente,Promise} = require('#libraries');
const {firefox} =  sente.webdriver


let helper= {};
global.driver = {};



helper.buildDriver = async () => {
    
    return new Promise( async (resolve,reject)=> {

        try {

            let generateNewSession = false;

            // Mandatory Config Validation
            if(!config.browser_type) throw new Error('browser_type invalid')
            if(!config.driver_host) throw new Error('driver_url invalid')

                
            // Attach to active web gui session
            if(config.attach_to_active_web_gui_session === 'true') {

                await sente.getFirstSessionOnGrid(config.driver_host)
                            .then(async _=>{
                                driver = await _
                                let sessionid = await _.session_
                                config.web_gui_sessionid = sessionid
                                log(`Driver Up [sessionid: ${sessionid}]`)
                                resolve();
                            })
                            .catch(e=>{
                                log.warn(e);
                                generateNewSession = true;
                            })
    
            }
            else generateNewSession = true;

            if(generateNewSession){

                switch (config.browser_type) {
                    case 'firefox'      : 
                        await buildFirefox()
                                .then(async _=> { 
                                            driver = await _
                                            let sessionData = await _.session_
                                            config.web_gui_sessionid = sessionData.id_
                                            log(`Driver Up [sessionid: ${sessionData.id_}]`)
                                            resolve(); 
                                        } );
                        break;
                    case 'chrome'       : await buildChrome();    break;
                    default             : reject('browser_type invalid');
                }
            }


        }

        catch (e) {
            reject(e);
        }


                
    })







}

let buildFirefox = async () => {

    return new Promise (async (resolve,reject)=>{

        try {

           
            log(`Building driver on [${config.browser_type} - ${config.driver_host}]`)

            // kill all sessions on grid
            await sente.killAllSessionsOnGrid(config.driver_host)

       
            // set download path
            if(config.download_path){
                await sente.cleanEmptyFoldersRecursively(config.download_path);
                await wait_(1);
                config.download_directory = await sente.generateRandomNamedDirectory(config.download_path);
            }
    
            
            const options = new firefox.Options(); //More Info: https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/firefox.html
    
            if(config.download_path) {
                options.setPreference("browser.download.dir", config.download_directory)
                options.setPreference("browser.download.folderList", 2) // 0: download to the desktop, 1: download to the default "Downloads" directory, 2: use the directory you specify in "browser.download.dir"
                options.setPreference("browser.download.panel.showing", false)
                options.setPreference("browser.download.manager.showWhenStarting", false)
                options.setPreference("browser.helperApps.neverAsk.saveToDisk", "multipart/x-zip,application/zip,application/x-zip-compressed,application/x-compressed,application/msword,application/csv,text/csv,image/png ,image/jpeg, application/pdf, text/html,text/plain,  application/excel, application/vnd.ms-excel, application/x-excel, application/x-msexcel, application/octet-stream") //More Info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
                options.setPreference("browser.helperApps.alwaysAsk.force", false)
            }    
                options.setPreference("security.OCSP.enabled", 0);
        
        
            await new sente.webdriver.Builder()
                         .forBrowser(config.browser_type)
                         .setFirefoxOptions(options)        
                         .usingServer(config.driver_host)
                         .withCapabilities(sente.webdriver.Capabilities.firefox()
                         .set("acceptInsecureCerts", true)
                         .set("acceptSslCerts", true))            
                         .build()
                         .then( async _=> {
                                                        
                            if( config.download_directory )log(`Browser download directory set to [${config.download_directory}]`)

                            driver = await _; // driver is global object

                            await driver.manage().deleteAllCookies();
                            await driver.manage().window().maximize();

                            await wait_();
                            resolve(_);
                        })
                        .catch( e => reject(e))
    


        }
        catch (e) {
            reject(e);

        }

    }).timeout(senteConfig.defaultTimeout*1000,'[buildFirefox] [Timeout] Build  firefox driver')

 
    



};


let buildChrome = () => {
    
}




module.exports = helper
