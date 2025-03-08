
const {log,wait_,wait} = require('../logger');
const core = require('./driver');
const Promise = require('bluebird');
const colors = require('chalk');
const figures = require('figures');



let scroll = {};

scroll.scroll = async (horizontal=0,vertical=250) => {

    /* set defaults */        
    horizontal = Number(horizontal);
    vertical = Number(vertical);



    return new Promise (async (resolve,reject)=>{        
        try {


            log.uiCommand('SCROLL', `Horizontal: ${horizontal}, Vertical: ${vertical}`)
            await driver.executeScript(`window.scrollBy(${horizontal},${vertical})`);
            
            await wait_(1);
            await core.takeScreenshot(`SCROLL (Horizontal: ${horizontal}, Vertical: ${vertical})`).catch(e =>  log.warn(e,'takeScreenshot'))
            global.steps.push({description: colors.cyan.bold(`[SCROLL]${figures.play} `) + `Horizontal: ${horizontal}, Vertical: ${vertical}`, status: 'Passed'})

            resolve(true);
        



        }
        catch (e) {
            core.takeScreenshot('[Failed] SCROLL').catch(e =>  log.warn(e,'takeScreenshot'))                
            log.error(e,`SCROLL ERROR`);
            global.steps.push({description: colors.cyan.bold(`[SCROLL]${figures.play} `) + `Horizontal: ${horizontal}, Vertical: ${vertical}`, status: 'Failed'})

            reject(e);
        }
    }).timeout(senteConfig.uiClassTimeout*1000,`[Timeout] [Scroll]`)


}

scroll.scroll.vertical = async (vertical=250) => {

    /* set defaults */        
    let x = 0;
    vertical = Number(vertical);



    return new Promise (async (resolve,reject)=>{        
        try {


            log.uiCommand('SCROLL', `Vertical: ${vertical}`)
            await driver.executeScript(`window.scrollBy(0,${vertical})`);
            
            await wait_(1);
            await core.takeScreenshot(`SCROLL (Vertical: ${vertical})`).catch(e =>  log.warn(e,'takeScreenshot'))

            global.steps.push({description: colors.cyan.bold(`[SCROLL]${figures.play} `) + `Vertical: ${vertical}`, status: 'Passed'})

            resolve(true);
        



        }
        catch (e) {
            core.takeScreenshot('[Failed] SCROLL').catch(e =>  log.warn(e,'takeScreenshot'))                
            log.error(e,`SCROLL ERROR`);
            global.steps.push({description: colors.cyan.bold(`[SCROLL]${figures.play} `) + `Vertical: ${vertical}`, status: 'Failed'})

            reject(e);
        }
    }).timeout(senteConfig.uiClassTimeout*1000,`[Timeout] [Scroll]`)


}

scroll.scroll.horizontal = async (horizontal=250) => {

    /* set defaults */        
    horizontal = Number(horizontal);



    return new Promise (async (resolve,reject)=>{        
        try {


            log.uiCommand('SCROLL', `Horizontal: ${horizontal}`)
            await driver.executeScript(`window.scrollBy(${horizontal},0)`);
            
            await wait_(1);
            await core.takeScreenshot(`SCROLL (Horizontal: ${horizontal})`).catch(e =>  log.warn(e,'takeScreenshot'))
            global.steps.push({description: colors.cyan.bold(`[SCROLL]${figures.play} `) + `Horizontal: ${horizontal}`, status: 'Passed'})

            resolve(true);
        



        }
        catch (e) {
            core.takeScreenshot('[Failed] SCROLL').catch(e =>  log.warn(e,'takeScreenshot'))                
            log.error(e,`SCROLL ERROR`);
            global.steps.push({description: colors.cyan.bold(`[SCROLL]${figures.play} `) + `Horizontal: ${horizontal}`, status: 'Failed'})

            reject(e);
        }
    }).timeout(senteConfig.uiClassTimeout*1000,`[Timeout] [Scroll]`)


}

module.exports = scroll;
