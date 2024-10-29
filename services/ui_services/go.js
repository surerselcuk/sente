
const { WebDriver } = require('selenium-webdriver');
const log = require('../logger').log;
const core = require('./driver');
const Promise = require('bluebird');
const colors = require('chalk');



module.exports = {};

let go = async (url, opt = {}) => {

    return new Promise (async (resolve,reject)=>{
        
        // set options
        if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout * 1000;


        try {

            // option defaults
            if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;

            // set timeout
            timeout = setTimeout( _=> { reject(`Timeout [GO ${url}]`)},opt.timeout * 1000)

            log.uiCommand('GO', url)
            await driver.get(url); await wait_(1);
            await core.takeScreenshot(`GO: ${url}`).catch(e =>  log.warn(e,'takeScreenshot'))


            resolve(true);

        }
        catch (e) {
            core.takeScreenshot('[Failed] GO: ' +url).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(`Error go url  on [Url: ${url}]`)
            log.error(e,`Error go url  on [Url: ${url}]`);
            reject(e);
        }
    }).timeout(opt.timeout,`[Timeout] [Go: ${url}]`)


}


module.exports.go = go;