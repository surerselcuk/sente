module.exports = {};

const axios = require('axios');
const _http = require('selenium-webdriver/http');
const {log,wait_,wait} = require('../logger');
const jimp = require('jimp');
const { existsSync, mkdirSync, chmodSync, readdirSync, statSync, rmdirSync} = require('fs');
const logger = require('../logger');
const path = require('path');
const Promise = require('bluebird');
const  core = require('../core')
const { webdriver } = require('../../index');

/**
 * Asynchronously builds a driver based on the provided options.
 *
 * @param {Object} [opt={}] - Options for building the driver.
 * @param {boolean} [opt.generate_new_session=false] - Flag to determine whether to generate a new session. Default is false.
 * @returns {Promise<void>} A promise that resolves when the driver is successfully built.
 * @throws {Error} Throws an error if mandatory configuration is invalid or if the browser type is unsupported.
 */
let buildDriver = async (opt = {}) => {


    return new Promise( async (resolve,reject)=> {

        try {
            
            if(!opt.generate_new_session) opt.generate_new_session=false;
            if(config.always_new_web_gui_session) opt.generate_new_session=true;

            
            // Mandatory Config Validation
            if(!config.browser_type) throw new Error('browser_type invalid')
            if(!config.driver_host) throw new Error('driver_url invalid')

                
            // Attach to active web gui session
            if(!opt.generate_new_session) {

                await getFirstSessionOnGrid(config.driver_host)
                            .then(async _=>{
                                driver = await _
                                let sessionid = await _.session_
                                config.web_gui_sessionid = sessionid

                                // set download directory
                                try { config.download_directory = await core.importParameter(config.driver_host+'_download_path');
                                    log(`Browser download directory set to [${config.download_directory}]`)
                                 } catch(e){}

                                log(`Driver Up [sessionid: ${sessionid}]`)
                                resolve();
                            })
                            .catch(e=>{
                                log.warn(e);
                                opt.generate_new_session = true;
                            })
    
            }
            else opt.generate_new_session = true;

            if(opt.generate_new_session){

                    // kill all sessions on grid
                    await killAllSessionsOnGrid(config.driver_host)

            
                    // set download path
                    let downloadDirectory
                    if(config.download_path){
                        await core.cleanEmptyFoldersRecursively(config.download_path);
                        await wait_(1);
                        downloadDirectory = await core.generateRandomNamedDirectory(config.download_path);
                        config.download_directory = downloadDirectory[0];                    
                        config.download_path_on_grid = path.posix.join(config.download_path_on_grid, downloadDirectory[1])
                        try { core.exportParameter(config.driver_host+'_download_path' ,config.download_directory ) } catch(e){}

                    }

                // select build function by browse type
                let buildFunc;
                switch (config.browser_type) {
                    case 'firefox'      : 

                        if(helper.buildFirefox && typeof helper.buildFirefox === 'function') buildFunc = helper.buildFirefox
                        else buildFunc = buildFirefox;

                        break;

                    case 'chrome'      : 

                        if(helper.buildChrome && typeof helper.buildChrome === 'function') buildFunc = helper.buildChrome
                        else buildFunc = buildChrome;

                        break;

                    default             : reject('browser_type invalid');
                }

                // build driver
                await buildFunc()
                .then(async _=> { 
                            driver = await _
                            let sessionData = await _.session_
                            config.web_gui_sessionid = sessionData.id_
                            log(`Driver Up [sessionid: ${sessionData.id_}]`)
                            resolve(); 
                        } );


            }


        }

        catch (e) {
            reject(e);
        }


                
    })

}
/**
 * Builds a Firefox WebDriver instance with specified options and configurations.
 * 
 * @returns {Promise<webdriver.WebDriver>} A promise that resolves to a configured Firefox WebDriver instance.
 * 
 * @throws {Error} If there is an issue building the Firefox WebDriver instance.
 * 
 * @example
 * buildFirefox().then(driver => {
 *     // Use the driver instance
 * }).catch(error => {
 *     console.error('Error building Firefox WebDriver:', error);
 * });
 * 
 * @see {@link  https://www.selenium.dev/documentation/webdriver/browsers|Options}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types|Common MIME Types}
 */
let buildFirefox = async () => {

    return new Promise (async (resolve,reject)=>{

        try {
           
            log(`Building driver on [${config.browser_type} - ${config.driver_host}]`)

            const options = new webdriver.firefox.Options(); //More Info: https://www.selenium.dev/documentation/webdriver/browsers/
    
            if(config.download_path) {
                options.setPreference("browser.download.dir", config.download_path_on_grid)
                options.setPreference("browser.download.folderList", 2) // 0: download to the desktop, 1: download to the default "Downloads" directory, 2: use the directory you specify in "browser.download.dir"
                options.setPreference("browser.download.panel.showing", false)
                options.setPreference("browser.download.manager.showWhenStarting", false)
                options.setPreference("browser.helperApps.neverAsk.saveToDisk", "multipart/x-zip,application/zip,application/x-zip-compressed,application/x-compressed,application/msword,application/csv,text/csv,image/png ,image/jpeg, application/pdf, text/html,text/plain,  application/excel, application/vnd.ms-excel, application/x-excel, application/x-msexcel, application/octet-stream") //More Info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
                options.setPreference("browser.helperApps.alwaysAsk.force", false)
            }    
                options.setPreference("security.OCSP.enabled", 0);
        
        
            await new webdriver.Builder()
                         .forBrowser(webdriver.Browser.FIREFOX)
                         .setFirefoxOptions(options)        
                         .usingServer(config.driver_host)
                         .withCapabilities(webdriver.Capabilities.firefox()
                         .set("acceptInsecureCerts", true)
                         .set("acceptSslCerts", true))            
                         .build()
                         .then( async driver_=> {
                                                        
                            if( config.download_directory ){
                                log(`Browser download directory on worker set to [${config.download_directory}] usage: config.download_directory`)
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

 
    



};
/**
 * Builds a Chrome WebDriver instance with specified options and configurations.
 * 
 * @returns {Promise<webdriver.WebDriver>} A promise that resolves to a configured Chrome WebDriver instance.
 * 
 * @throws {Error} If there is an issue building the Chrome WebDriver instance.
 * 
 * @example
 * buildChrome().then(driver => {
 *     // Use the driver instance
 * }).catch(error => {
 *     console.error('Error building Chrome WebDriver:', error);
 * });
 * 
 * @see {@link  https://www.selenium.dev/documentation/webdriver/browsers|Options}
 */
let buildChrome = async () => {

    return new Promise (async (resolve,reject)=>{

        try {
           
            log(`Building driver on [${config.browser_type} - ${config.driver_host}]`)

            const options = new webdriver.chrome.Options(); // More Info: https://www.selenium.dev/documentation/webdriver/browsers/
       
    
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
            

            await new webdriver.Builder()
            .forBrowser(webdriver.Browser.CHROME)
            .usingServer(config.driver_host)
            .setChromeOptions(options.setAcceptInsecureCerts(true))
            .build()
            .then( async driver_=> {
                                            
                if( config.download_directory ){
                    log(`Browser download directory on worker set to [${config.download_directory}] usage: config.download_directory`)
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

};
let killAllSessionsOnGrid = async(gridHost) => {

    log(`Clearing all sessions on grid [${gridHost}]`)
 
    await clearQueOnGrid(gridHost).catch(e=>{log.warn('[clearQueOnGrid]'); log.warn(e)});
    await logger.wait_(1);

    return new Promise(async (resolve,reject) => {

        try {

            axios({
                method: 'get',
                timeout: senteConfig.defaultTimeout * 1000,
                url: `${gridHost}/status`
            }, {})
            .then(async(res) => {
    
                if (res.data.value.nodes[0].slots.length > 0) {
                    
                    for (let i of res.data.value.nodes[0].slots) {

                        try {
                        
                            if(i.session !== null) {                        
                                let currentDriverForSession = await getDriver(i.session.sessionId,gridHost);
                                await currentDriverForSession.quit();
                                await wait_(1);
                                log(`Session killed on grid(${gridHost}), sessionId: ${i.session.sessionId}`)
                            } 
                        
                        
                        }
                        catch (e) {
                        
                            axios({
                                method: 'delete',
                                timeout: senteConfig.defaultTimeout * 1000,
                                url: `${gridHost}/session/${i.session.sessionId}`,
                                headers: {"X-REGISTRATION-SECRET":""}
                            }, {})
                            .then(_=>{log(`Session killed on grid(${gridHost}), sessionId: ${i.session.sessionId}`)})
                            .catch(_=>{log.warn(_,'killAllSessionsOnGrid => delete session')})
                        
                        }
                        
                        
    
    
                    }
                    resolve(true);
                } else resolve(true)
    
    
            })
            .catch((error) => {log.warn('[killAllSessionsOnGrid]'); log.warn(error); resolve(true); });
        }
        catch (e) {
            log.warn(error); 
            resolve(true);
        }


    }).timeout(senteConfig.defaultTimeout * 1000,'[killAllSessionsOnGrid] [Timeout] Kill all sessions on grid')




}

/**
 * Connects to the active web-ui session on the specified grid host and retrieves the driver for the first active session.
 *
 * @param {string} gridHost - The host URL of the grid to connect to.
 * @returns {Promise<Object>} - A promise that resolves with the driver for the first active session, or rejects with an error message if no active session is found or if an error occurs.
 *
 * @throws {Error} - If there is an error connecting to the grid or retrieving the session information.
 */
let getFirstSessionOnGrid = async(gridHost) => {

    log(`Connect to active web-ui session on [${gridHost}]`)

    return new Promise(async (resolve,reject) => {

        try {

            await axios({
                method: 'get',
                timeout: senteConfig.defaultTimeout * 1000,
                url: `${gridHost}/status`
            }, {})
            .then(async(res) => {
    
                if (res.data.value.nodes[0].slots.length > 0) {
                    
                    for (let i of res.data.value.nodes[0].slots) {
                        
                        if(i.session !== null) {      
                            let currentDriverForSession = await getDriver(i.session.sessionId,gridHost);
                            resolve(currentDriverForSession)
                        } else {
                            reject(`No active session on grid (${gridHost})`)
                        }
    
    
                    }
                    

                } else reject(`No active session on grid (${gridHost})`)
    
    
            })
            .catch(e =>  reject(e) );

        }
        catch (e) {
            reject(e);
        }


    }).timeout(senteConfig.defaultTimeout * 1000,'[getFirstSessionOnGrid] [Timeout] Get Driver On Grid for first session')




}


let clearQueOnGrid= async(gridHost) => {
    
    return new Promise (async (resolve,reject)=> {

        try{

            log(`Cleaning Que on Grid (${gridHost})`)

            axios({
                    method: 'delete',
                    timeout: senteConfig.defaultTimeout * 1000,
                    url: `${gridHost}/se/grid/newsessionqueue/queue`,
                    headers: {"X-REGISTRATION-SECRET":""}
                }, {})
                .then(res => resolve(true))
                .catch(e =>  reject(e) );    
        }
        catch (e) {reject(e)}
    

    }).timeout(senteConfig.defaultTimeout * 1000,'[clearQueOnGrid] [Timeout] Clear Que On Grid')
    


}

/**
     * Retrieves a WebDriver instance for the specified session ID and grid host.
     *
     * @param {string} sessionId - The session ID of the WebDriver instance to retrieve.
     * @param {string} gridHost - The host URL of the grid where the session is running.
     * @param {Object} [options={}] - Additional options for configuring the WebDriver instance.
     * @param {boolean} [options.acceptInsecureCerts=true] - Whether to accept insecure SSL certificates.
     * @param {boolean} [options.acceptSslCerts=true] - Whether to accept SSL certificates.
     * @returns {Promise<webdriver.WebDriver>} - A promise that resolves with the WebDriver instance for the specified session.
     *
     * @throws {Error} - If there is an error retrieving the WebDriver instance.
     */
let getDriver = async (sessionId, gridHost, options = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const defaultOptions = {
                acceptInsecureCerts: true,
                acceptSslCerts: true,
            };
            const finalOptions = { ...defaultOptions, ...options };

            let currentDriverForSession = new webdriver.WebDriver(
                sessionId,
                new _http.Executor(Promise.resolve(gridHost)
                    .then(url => new _http.HttpClient(url, null, null))
                )
            );

            if (finalOptions.acceptInsecureCerts) {
                await currentDriverForSession
                    .manage()
                    .setTimeouts({ implicit: 10000 });
            }

            resolve(currentDriverForSession);
        } catch (e) {
            reject(e);
        }
    }).timeout(senteConfig.defaultTimeout * 1000, '[getDriver] [Timeout] Get Driver On Grid');
};



let takeScreenshot = (text='') => {
    return new Promise(async (resolve,reject)=>{
    
        try{

            // is take_screenshoot true 
            if( config.take_screenshoot && config.take_screenshoot === 'true' ) {

                // is exist config.screenshot_directory 
                if(!config.screenshot_directory) {
                    throw new Error(`'config.screenshot_directory' undefined. If config.take_screenshoot === 'true', config.screenshot_directory  must`);                    
                }

                // is exist screenshot_directory 
                if (!existsSync(config.screenshot_directory))   await mkdirSync(config.screenshot_directory, { recursive: true });


                    // generate file name
                let formatFilePath = config.file_path.replace(new RegExp(path.sep, 'g'),'_')
                let imgFileName =  formatFilePath + '_' + Date.now()+'.png';
                let imgFile=path.join(config.screenshot_directory,imgFileName)

                // set sente logo location
                let logoFile = path.join(senteConfig.project_path,'assets','img','s.png')


                // take screenshot
                await driver.takeScreenshot()
                        .then(function(data) {
                            
                            let scrShot = Buffer.from(data, 'base64');

                            jimp.read(logoFile)
                                .then(logo => {
                                    jimp.read(scrShot)
                                        .then(image => {
                                            loadedImage = image;
                                            return jimp.loadFont(jimp.FONT_SANS_32_WHITE); // Beyaz yazı fontu
                                        })
                                        .then(font => {
                                            // Metnin genişlik ve yüksekliğini hesapla
                                            const textWidth = jimp.measureText(font, text);
                                            const textHeight = jimp.measureTextHeight(font, text, textWidth);
                                            const textX = 10;
                                            const textY = loadedImage.bitmap.height - 50;
                            
                                            // Siyah arka plan oluştur ve metnin altına ekle
                                            const background = new jimp(textWidth + 20, textHeight + 10, 0x000000FF);
                                            loadedImage.blit(background, textX - 5, textY - 5);
                            
                                            // Logo ve metni ekleyerek resmi güncelle
                                            loadedImage
                                                .blit(logo, loadedImage.bitmap.width - 200, loadedImage.bitmap.height - 120)
                                                .print(font, textX, textY, text)
                                                .resize(1400, jimp.AUTO)
                                                .write(imgFile);
                            
                                            if (config.run_on_sente_cloud) {
                                                console.log(`<senteScreenshot>${imgFile}</senteScreenshot>`);
                                            }
                                            resolve();
                                        })
                                        .catch(err => reject(err));
                                })
                                .catch(err => reject(err));
                            



                        })





            }
            else resolve(true);
                


        }
        catch (e) {reject(e)}
    }).timeout(senteConfig.defaultTimeout*1000,'[takeScreenshot] [Timeout] Take Screenshot')


}



module.exports.killAllSessionsOnGrid = killAllSessionsOnGrid;
module.exports.getDriver = getDriver;
module.exports.getFirstSessionOnGrid = getFirstSessionOnGrid;
module.exports.takeScreenshot = takeScreenshot;
module.exports.buildDriver = buildDriver;



