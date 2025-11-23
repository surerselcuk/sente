
const {log,wait_,wait, now} = require('../logger');

const Promise = require('bluebird');
const {locator} = require('./locator')
const core = require('./driver');

const colors = require('chalk');
const figures = require('figures');
const { stat } = require('fs');

module.exports = {};





let getText = async (search, opt = {}) => {

    // set default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;
    if(!opt.type) opt.type = 'xpath'
    if (opt.isStepLogActive === undefined) opt.isStepLogActive = true;

    opt.search = search
    

    return new Promise (async (resolve,reject)=>{        
        try {

            log.uiCommand('GET TEXT', opt.search)
            
            let element = await locator(opt)
            let text = await element.getText();                    

            if(opt.isStepLogActive === true) global.steps.push({description: colors.cyan.bold(`[GET TEXT]${figures.play} `) + opt.search , status: 'Passed'})
            
            await wait_(1);
            console.log('[' + now() + ']             ' + colors.green.bold(` ${figures.tick}  `) + 'Text: ' + colors.green.bold(text))
            

            resolve(text);

        }
        catch (e) {

            core.takeScreenshot('[Failed] GET TEXT: ' + opt.search).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(e,`CLICK [${opt.search}]`);
            if(opt.isStepLogActive === true) global.steps.push({description: colors.cyan.bold(`[GET TEXT]${figures.play} `) + opt.search , status: 'Failed'})
            reject(e);
        }
    }).timeout((opt.timeout+1)*1000,`[Timeout] [GET TEXT: ${opt.search}]`)


}

getText.xpath = async (search, opt = {}) => {

    opt.type = 'xpath'
    const _ = await click(search, opt);    
    return await Promise.resolve(_);


}

getText.className = async (search, opt = {}) => {

    opt.type = 'className'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}


getText.css = async (search, opt = {}) => {

    opt.type = 'css'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

getText.id = async (search, opt = {}) => {

    opt.type = 'id'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

getText.name = async (search, opt = {}) => {

    opt.type = 'name'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

getText.linkText = async (search, opt = {}) => {

    opt.type = 'linkText'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

getText.partialLinkText = async (search, opt = {}) => {

    opt.type = 'partialLinkText'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

getText.text = async (search, opt = {}) => {

    opt.type = 'text'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

getText.partialText = async (search, opt = {}) => {

    opt.type = 'partialText'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}

getText.tagName = async (search, opt = {}) => {

    opt.type = 'tagName'
    const _ = await click(search, opt);
    return await Promise.resolve(_);


}






module.exports.getText = getText;



