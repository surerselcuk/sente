
const {log,wait_,wait} = require('../logger');
const core = require('./driver');
const Promise = require('bluebird');
const colors = require('chalk');
const figures = require('figures');


module.exports = {};

let go = async (url, opt = {}) => {

    /* set defaults */        
        /* timeout */                           
        if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;  // seconds



    return new Promise (async (resolve,reject)=>{        
        try {


            log.uiCommand('GO', url)
            await driver.get(url); await wait_(1);
            
            global.steps.push({description: colors.cyan.bold(`[GO]${figures.play} `) + url, status: 'Passed'})
            await core.takeScreenshot(`GO: ${url}`).catch(e =>  log.warn(e,'takeScreenshot'))
            resolve(true);
        



        }
        catch (e) {
            core.takeScreenshot('[Failed] GO: ' +url).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(`Error go url  on [Url: ${url}]`)
            log.error(e,`Error go url  on [Url: ${url}]`);
            global.steps.push({description: colors.cyan.bold(`[GO]${figures.play} `) + url , status: 'Failed'})
            reject(e);
        }
    }).timeout((opt.timeout+1)*1000,`[Timeout] [Go: ${url}]`)


}



module.exports.go = go;
