
const { WebDriver } = require('selenium-webdriver');
const log = require('../logger').log;
const core = require('./driver');



module.exports = {};

let go = async (url) => {

    return new Promise (async (resolve,reject)=>{
        try {

            log.uiCommand('GO', url)
            await driver.get(url); await wait_(1);
            await core.takeScreenshot(`GO: ${url}`)
            resolve(true);


        }
        catch (e) {

            core.takeScreenshot('[Failed] Go: ' +url);
            log.error(`Error go url  on [Url: ${url}]`)
            log.error(e);
            reject(e);
        }
    })


}


module.exports.go = go;