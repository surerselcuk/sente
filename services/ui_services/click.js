
const {log,wait_,wait} = require('../logger');

const Promise = require('bluebird');
const {locator} = require('./locator')
const core = require('./driver');
const colors = require('chalk');
const figures = require('figures');


module.exports = {};





let click = async (search, opt = {}) => {

    // set default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;
    if(!opt.type) opt.type = 'xpath'
    opt.search = search
    

    return new Promise (async (resolve,reject)=>{        
        try {

            log.uiCommand('CLICK', opt.search)
            
            let element = await locator(opt)
            
            try {
            
                
                await element.click();
                await wait_(1);
                await core.takeScreenshot(`CLICK: ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))
            
            }
            catch (e) {
            
                await driver.actions().click(element).perform(); 
                await wait_(1);
                await core.takeScreenshot(`CLICK: ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))
            
            }
            
            

            global.steps.push({description: colors.cyan.bold(`[CLICK]${figures.play} `) + opt.search, status: 'Passed'})
              
            resolve(element);

        }
        catch (e) {

            core.takeScreenshot('[Failed] CLICK: ' + opt.search).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(e,`CLICK [${opt.search}]`);
            global.steps.push({description: colors.cyan.bold(`[CLICK]${figures.play} `) + opt.search , status: 'Failed'})

            reject(e);
        }
    }).timeout((opt.timeout+1)*1000,`[Timeout] [CLICK: ${opt.search}]`)


}

click.xpath = async (search, opt = {}) => {

    opt.type = 'xpath'
    const _ = await click(search, opt);    
    return await Promise.resolve(_);


}

click.className = async (search, opt = {}) => {

    opt.type = 'className'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}


click.css = async (search, opt = {}) => {

    opt.type = 'css'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

click.id = async (search, opt = {}) => {

    opt.type = 'id'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

click.name = async (search, opt = {}) => {

    opt.type = 'name'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

click.linkText = async (search, opt = {}) => {

    opt.type = 'linkText'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

click.partialLinkText = async (search, opt = {}) => {

    opt.type = 'partialLinkText'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

click.text = async (search, opt = {}) => {

    opt.type = 'text'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

click.partialText = async (search, opt = {}) => {

    opt.type = 'partialText'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

click.tagName = async (search, opt = {}) => {

    opt.type = 'tagName'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}


let rightClick = async (search, opt = {}) => {

    // set default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;
    if(!opt.type) opt.type = 'xpath'
    opt.search = search

    return new Promise (async (resolve,reject)=>{        
        try {

            log.uiCommand('RIGHT CLICK', opt.search)
            
            let element = await locator(opt)
            await driver.actions().contextClick(element).perform();           
            
            await wait_(1);
            await core.takeScreenshot(`RIGHT CLICK: ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))

            global.steps.push({description: colors.cyan.bold(`[RIGHT CLICK]${figures.play} `) + opt.search, status: 'Passed'})

            resolve(element);

        }
        catch (e) {
            core.takeScreenshot('[Failed] RIGHT CLICK: ' + opt.search).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(e,`RIGHT CLICK [${opt.search}]`);
            global.steps.push({description: colors.cyan.bold(`[RIGHT CLICK]${figures.play} `) + opt.search , status: 'Failed'})

            reject(e);
        }
    }).timeout((opt.timeout+1)*1000,`[Timeout] [RIGHT CLICK: ${opt.search}]`)


}

rightClick.xpath = async (search, opt = {}) => {

    opt.type = 'xpath'
    const _ = await rightClick(search, opt);    
    return await Promise.resolve(_);


}

rightClick.className = async (search, opt = {}) => {

    opt.type = 'className'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}


rightClick.css = async (search, opt = {}) => {

    opt.type = 'css'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}

rightClick.id = async (search, opt = {}) => {

    opt.type = 'id'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}

rightClick.name = async (search, opt = {}) => {

    opt.type = 'name'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}

rightClick.linkText = async (search, opt = {}) => {

    opt.type = 'linkText'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}

rightClick.partialLinkText = async (search, opt = {}) => {

    opt.type = 'partialLinkText'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}

rightClick.text = async (search, opt = {}) => {

    opt.type = 'text'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}

rightClick.partialText = async (search, opt = {}) => {

    opt.type = 'partialText'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}

rightClick.tagName = async (search, opt = {}) => {

    opt.type = 'tagName'
    const _ = await rightClick(search, opt);
    return await Promise.resolve(_);


}


let doubleClick = async (search, opt = {}) => {

    // set default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;
    if(!opt.type) opt.type = 'xpath'
    opt.search = search

    return new Promise (async (resolve,reject)=>{        
        try {

            log.uiCommand('DOUBLE CLICK', opt.search)
            
            let element = await locator(opt)
            await driver.actions().doubleClick(element).perform();           

            await wait_(1);
            await core.takeScreenshot(`DOUBLE CLICK: ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))
            global.steps.push({description: colors.cyan.bold(`[DOUBLE CLICK]${figures.play} `) + opt.search, status: 'Passed'})

            resolve(element);

        }
        catch (e) {
            core.takeScreenshot('[Failed] DOUBLE CLICK: ' + opt.search).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(e,`DOUBLE CLICK [${opt.search}]`);
            global.steps.push({description: colors.cyan.bold(`[DOUBLE CLICK]${figures.play} `) + opt.search , status: 'Failed'})

            reject(e);
        }
    }).timeout((opt.timeout+1)*1000,`[Timeout] [DOUBLE CLICK: ${opt.search}]`)


}

doubleClick.xpath = async (search, opt = {}) => {

    opt.type = 'xpath'
    const _ = await doubleClick(search, opt);    
    return await Promise.resolve(_);


}

doubleClick.className = async (search, opt = {}) => {

    opt.type = 'className'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}


doubleClick.css = async (search, opt = {}) => {

    opt.type = 'css'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}

doubleClick.id = async (search, opt = {}) => {

    opt.type = 'id'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}

doubleClick.name = async (search, opt = {}) => {

    opt.type = 'name'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}

doubleClick.linkText = async (search, opt = {}) => {

    opt.type = 'linkText'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}

doubleClick.partialLinkText = async (search, opt = {}) => {

    opt.type = 'partialLinkText'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}

doubleClick.text = async (search, opt = {}) => {

    opt.type = 'text'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}

doubleClick.partialText = async (search, opt = {}) => {

    opt.type = 'partialText'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}

doubleClick.tagName = async (search, opt = {}) => {

    opt.type = 'tagName'
    const _ = await doubleClick(search, opt);
    return await Promise.resolve(_);


}





module.exports.click = click;
module.exports.rightClick = rightClick;
module.exports.doubleClick = doubleClick;


