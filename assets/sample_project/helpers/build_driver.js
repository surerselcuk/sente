const {sente,helper,repo,https,Promise} = require('#libraries');
const {log,wait} = sente;
const {firefox} =  sente.webdriver


module.exports = {

    /* 
    // If you want to edit the firefox build function, you can remove the comments and edit them.

    buildFirefox : async () => {

        return new Promise (async (resolve,reject)=>{
    
            try {
    
               
                log(`Building driver on [${config.browser_type} - ${config.driver_host}]`)
            
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
                             .then( async driver_=> {
                                                        
                                if( config.download_directory )log(`Browser download directory set to [${config.download_directory}]`)
    
                                await driver_.manage().deleteAllCookies();
                                await driver_.manage().window().maximize();
    
                                resolve(driver_);
                            })
                            .catch( e => reject(e))
        
    
    
            }
            catch (e) {
                reject(e);
    
            }
    
        }).timeout(senteConfig.defaultTimeout*1000,'[buildFirefox] [Timeout] Build  firefox driver')
    
     
        
    
    
    
    }
    */
}
