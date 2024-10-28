
const { WebDriver } = require('selenium-webdriver');
const log = require('../logger').log;



module.exports = {};

let go = async (url) => {

    return new Promise (async (resolve,reject)=>{
        try {

            log(`GO ${url}`)
            await driver.get(url); await wait_(1);
            // await senteDriver.takeScreenshot('Go To => ' +url);
            resolve(true);


        }
        catch (e) {

            log.error(`Error go url  on [Url: ${url}]`)
            log.error(e);
            // senteDriver.takeScreenshot('[Failed] Go To => ' +url).then(_=>reject(e));
            reject(e);
        }
    })


}


module.exports.go = go;