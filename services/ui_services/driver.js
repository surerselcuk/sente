module.exports = {};

const axios = require('axios');
const { WebDriver } = require('selenium-webdriver');
const _http = require('selenium-webdriver/http');
const log = require('../logger').log;
const jimp = require('jimp');
const { existsSync, mkdirSync, chmodSync, readdirSync, statSync, rmdirSync} = require('fs');
const logger = require('../logger');
const path = require('path');
const Promise = require('bluebird');
const  core = require('../core')



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
                        
                        if(i.session !== null) {                        
                            let currentDriverForSession = await getDriver(i.session.sessionId,gridHost);
                            await currentDriverForSession.quit();
                            await wait_(1);
                            log(`Session killed on grid(${gridHost}), sessionId: ${i.session.sessionId}`)
                        } 
    
    
                    }
                    resolve(true);
                } else resolve(true)
    
    
            })
            .catch((error) => { reject(error); });
        }
        catch (e) {
            reject(e);
        }


    }).timeout(senteConfig.defaultTimeout * 1000,'[killAllSessionsOnGrid] [Timeout] Kill all sessions on grid')




}

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

let getDriver= async(sessionId,gridHost) => {
    
    return new Promise (async (resolve,reject)=> {

        try{

            let currentDriverForSession = new WebDriver(
                sessionId,
                new _http.Executor(Promise.resolve(gridHost)
                    .then(
                        url => new _http.HttpClient(url, null, null))
                )
            );
            
    
            resolve(currentDriverForSession);
        }
        catch (e) {reject(e)}
    

    }).timeout(senteConfig.defaultTimeout * 1000,'[getDriver] [Timeout] Get Driver On Grid')
    


}




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
                if (!existsSync(config.screenshot_directory))   await mkdirSync(config.screenshot_directory);

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
                                            
                                            if(config.run_on_sente_cloud) console.log(`<senteScreenshot>${imgFile}</senteScreenshot>`);
                                        resolve();
                                    })
                                    .catch(err => reject(err));
                            })
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



