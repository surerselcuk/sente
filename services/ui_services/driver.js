module.exports = {};

const axios = require('axios');
const { WebDriver } = require('selenium-webdriver');
const _http = require('selenium-webdriver/http');
const log = require('../logger').log;
const jimp = require('jimp');
const { existsSync, mkdirSync, chmodSync, readdirSync, statSync, rmdirSync} = require('fs');
const core = require('../core');
const path = require('path');




let killAllSessionsOnGrid = async(gridHost) => {

    log(`Clearing all sessions on grid [${gridHost}]`)

    await clearQueOnGrid(gridHost);
    await wait_();

    return axios({
            method: 'get',
            timeout: 20000,
            url: `${gridHost}/status`
        }, {})
        .then(async(res) => {

            if (res.data.value.nodes[0].slots.length > 0) {
                
                for (let i of res.data.value.nodes[0].slots) {
                    
                    if(i.session !== null) {                        
                        let currentDriverForSession = await getDriver(i.session.sessionId,gridHost);
                        await currentDriverForSession.quit();
                        await wait_(1);
                        log(`Session killed on grid(${gridHost}), sessionId: ${i.session.sessionId}`)
                    } else {
                        log(`No active session on grid (${gridHost})`)
                    }


                }
                return Promise.resolve(true);
            } else return Promise.resolve(true)


        })
        .catch((error) => {
            
            return Promise.resolve(false);

        })


}
let getFirstSessionOnGrid = async(gridHost) => {

    log(`Connect to active web-ui session on [${gridHost}]`)

    return new Promise(async (resolve,reject) => {

        try {

            await axios({
                method: 'get',
                timeout: 20000,
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
                    
                    resolve(true);

                } else reject(`No active session on grid (${gridHost})`)
    
    
            })
            .catch((error) => {
                
                return Promise.reject(error);
    
            })
        }
        catch (e) {

            reject(e);
        }


    })




}
let clearQueOnGrid = async(gridHost) => {

    log(`Cleaning Que on Grid (${gridHost})`)
    return axios({
            method: 'delete',
            timeout: 20000,
            url: `${gridHost}/se/grid/newsessionqueue/queue`,
            headers: {"X-REGISTRATION-SECRET":""}
        }, {})
        .then(async(res) => {

            return Promise.resolve(true);
        })
        .catch((error) => {
            log.error(`Queue clean error on Grid (${gridHost})`)
            log.error(error)
            return Promise.resolve(false);

        })


}
let getDriver = async(sessionId,gridHost) => {

    try {


        let currentDriverForSession = new WebDriver(
            sessionId,
            new _http.Executor(Promise.resolve(gridHost)
                .then(
                    url => new _http.HttpClient(url, null, null))
            )
        );
        

        return Promise.resolve(currentDriverForSession);
    } catch (e) {
        return Promise.reject(e);
    }

};
let takeScreenshot = (text='') => {

    return new Promise(async (resolve,reject)=>{
        try{

            // is take_screenshoot true and 
            if( config.take_screenshoot && config.take_screenshoot === 'true' ) {

                // is exist config.screenshot_directory 
                if(!config.screenshot_directory) {
                    log.warn(`Config 'config.screenshot_directory' undefined. If config.take_screenshoot === 'true', config.screenshot_directory  must`)
                    resolve();
                }

                // is exist screenshot_directory 
                if (!existsSync(config.screenshot_directory))   await mkdirSync(config.screenshot_directory);

                // generate file name
                let formatFilePath = config.file_path.replace(new RegExp(core.dirSeparator(), 'g'),'_')
                let imgFileName =  formatFilePath + '_' + Date.now()+'.png';
                let imgFile=config.screenshot_directory+core.dirSeparator() + imgFileName;

                // set sente logo location
                let logoFile = senteConfig.project_path + core.dirSeparator() + 'assets' + core.dirSeparator() +'img' + core.dirSeparator() + 's.png';

                // take screenshot
                await driver.takeScreenshot()
                        .then(function(data) {
                            let scrShot = Buffer.from(data, 'base64');
                            jimp.read(logoFile)
                            .then(logo => {
                                jimp.read(scrShot)
                                    .then(function (image) {
                                        loadedImage = image;
                                        return jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        
                                    })
                                    .then(function (font) {
                                        loadedImage
                                            .blit(logo, loadedImage.bitmap.width-200, loadedImage.bitmap.height-120)
                                            .print(font, 10, loadedImage.bitmap.height-50, text)
                                            .resize(1400,jimp.AUTO)
                                            .write(imgFile);
        

        
                                        resolve();
                                    })
                                    .catch(function (err) {
                                        log.error(`Error on takeScreenshot`)
                                        console.log(err);
                                        resolve();
                                    });
                            })
                        })





            }
            else {
                resolve();
            }
                



        }
        catch (e) {
            log.warn(`Error on take Screenshot`)
            console.log(e);
            resolve();

        }
    })


}



module.exports.killAllSessionsOnGrid = killAllSessionsOnGrid;
module.exports.getDriver = getDriver;
module.exports.getFirstSessionOnGrid = getFirstSessionOnGrid;
module.exports.takeScreenshot = takeScreenshot;





