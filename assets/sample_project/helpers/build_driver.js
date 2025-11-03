const repo = require('#object_repository');
const { sente } = require('#libraries');
const { webdriver, axios, Promise, https, NodeSSH, random, moment } = sente;
const { log, now, wait, wait_, translate, importParameter, exportParameter, overrideRepo, myQuery, pgQuery, api, ssh  } = sente;
const { go, click, rightClick, doubleClick, see, notSee, write, keyboard, scroll, getText } = sente;
const {firefox} =  sente.webdriver
const {chrome} =  sente.webdriver


module.exports = {

    /* 
    // If you want to edit the firefox build function, you can remove the comments and edit them.


    buildFirefox : async () => {

        return new Promise (async (resolve,reject)=>{
    
            try {
               
                log(`Building driver on [${config.browser_type} - ${config.driver_host}]`)
    
                const options = new sente.webdriver.firefox.Options(); //More Info: https://www.selenium.dev/documentation/webdriver/browsers/
        
                if(config.download_path) {
                    options.setPreference("browser.download.dir", config.download_path_on_grid)
                    options.setPreference("browser.download.folderList", 2) // 0: download to the desktop, 1: download to the default "Downloads" directory, 2: use the directory you specify in "browser.download.dir"
                    options.setPreference("browser.download.panel.showing", false)
                    options.setPreference("browser.download.manager.showWhenStarting", false)
                    options.setPreference("browser.helperApps.neverAsk.saveToDisk", "multipart/x-zip,application/zip,application/x-zip-compressed,application/x-compressed,application/msword,application/csv,text/csv,image/png ,image/jpeg, application/pdf, text/html,text/plain,  application/excel, application/vnd.ms-excel, application/x-excel, application/x-msexcel, application/octet-stream") //More Info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
                    options.setPreference("browser.helperApps.alwaysAsk.force", false)
                }    
                    options.setPreference("security.OCSP.enabled", 0);
            
            
                await new sente.webdriver.Builder()
                             .forBrowser(sente.webdriver.Browser.FIREFOX)
                             .setFirefoxOptions(options)        
                             .usingServer(config.driver_host)
                             .withCapabilities(sente.webdriver.Capabilities.firefox()
                             .set("acceptInsecureCerts", true)
                             .set("acceptSslCerts", true))            
                             .build()
                             .then( async driver_=> {
                                                            
                                if( config.download_directory ){
                                    log(`Browser download directory on worker set to [${config.download_directory}]`)
                                    log(`Browser download directory on selenium grid set to [${config.download_path_on_grid}]`)
                                }
    
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
    
     
        
    
    
    
    },

    buildChrome : async () => {

        return new Promise (async (resolve,reject)=>{
    
            try {
               
                log(`Building driver on CHH [${config.browser_type} - ${config.driver_host}]`)
    
                const options = new sente.webdriver.chrome.Options(); // More Info: https://www.selenium.dev/documentation/webdriver/browsers/
           
        
                if(config.download_path) {
    
                    // More Info: https://chromium.googlesource.com/chromium/src/+/refs/heads/main/chrome/common/pref_names.h
                    options.setUserPreferences({
                        "download.default_directory": config.download_path_on_grid,
                        "download.prompt_for_download": false,
                        "profile.default_content_settings.popups": 0,
                        "safebrowsing.enabled": true
                    });
                }    
    
                // More Info: https://peter.sh/experiments/chromium-command-line-switches/
                options.addArguments("--no-sandbox");
                options.addArguments("--remote-debugging-pipe"); // Bypass OS security model
                options.addArguments("--disable-dev-shm-usage"); // overcome limited resource problems
                options.addArguments("--disable-infobars"); // disabling infobars
                options.addArguments("--disable-extensions"); // disabling extensions
                options.addArguments("--disable-gpu"); // applicable to windows os only
                options.addArguments("--disable-search-engine-choice-screen"); // applicable to windows os only
                options.addArguments("--disable-application-cache");
                options.addArguments("--disable-features=DownloadBubble,DownloadBubbleV2"); // disable download popup
                options.addArguments("--chrome.verbose = false"); //disable logging
                options.addArguments("--w3c=true");
                
    
                await new sente.webdriver.Builder()
                .forBrowser(sente.webdriver.Browser.CHROME)
                .usingServer(config.driver_host)
                .setChromeOptions(options.setAcceptInsecureCerts(true))
                .build()
                .then( async driver_=> {
                                                
                    if( config.download_directory ){
                        log(`Browser download directory on worker set to [${config.download_directory}]`)
                        log(`Browser download directory on selenium grid set to [${config.download_path_on_grid}]`)
                    }
    
                   await driver_.manage().deleteAllCookies();
                   await driver_.manage().window().maximize();
    
                   resolve(driver_);
               })
               .catch( e => reject(e))
    
    
        
    
    
            }
            catch (e) {
                reject(e);
    
            }
    
        }).timeout(senteConfig.defaultTimeout*1000,'[buildChrome] [Timeout] Build chrome driver')
    
    }

        */
}
