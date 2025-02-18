
const {log,wait_,wait} = require('../logger');
const { webdriver } = require('../../index');
const {until,By} = webdriver
const Promise = require('bluebird');
const core = require('./driver');

module.exports = {};


/*
class name:	Locates elements whose class name contains the search value (compound class names are not permitted)
css selector:	Locates elements matching a CSS selector
id:	Locates elements whose ID attribute matches the search value
name:	Locates elements whose NAME attribute matches the search value
link text:	Locates anchor elements whose visible text matches the search value
partial link text:	Locates anchor elements whose visible text contains the search value. If multiple elements are matching, only the first one will be selected.
tag name:	Locates elements whose tag name matches the search value
xpath:	Locates elements matching an XPath expression
*/


let locator = (opt={}) => {

    // set timeout default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;

    // set default
    if(!opt.type) opt.type = 'xpath'
    if(!opt.search) reject('Search word undefined!')     
                
        

    return new Promise (async (resolve,reject)=>{        
        try {
            opt.index = Number(opt.index);

            let object;

            switch (opt.type) {

                case 'xpath':
                    object = await driver.wait(until.elementLocated(By.xpath(opt.search)),opt.timeout * 1000);
                    break;

                case 'className':
                    object = await driver.wait(until.elementLocated(By.className(opt.search)),opt.timeout * 1000);
                    break;

                case 'css':
                    object = await driver.wait(until.elementLocated(By.css(opt.search)),opt.timeout * 1000);
                    break;

                case 'id':
                    object = await driver.wait(until.elementLocated(By.id(opt.search)),opt.timeout * 1000);
                    break;

                case 'name':
                    object = await driver.wait(until.elementLocated(By.name(opt.search)),opt.timeout * 1000);
                    break;

                case 'linkText':
                    object = await driver.wait(until.elementLocated(By.linkText(opt.search)),opt.timeout * 1000);
                    break;

                case 'partialLinkText':
                    object = await driver.wait(until.elementLocated(By.partialLinkText(opt.search)),opt.timeout * 1000);
                    break;

                case 'tagName':
                    object = await driver.wait(until.elementLocated(By.tagName(opt.search)),opt.timeout * 1000);
                    break;
                
                       
                default:
                    reject('Search type undefined')
                    break;
            }


            resolve(object);

        }
        catch (e) {

            reject(e);
        }
    }).timeout(opt.timeout*1000,`[Element not found! [${opt.search}]`)


}


let see = async (search, opt = {}) => {

    // set default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;
    if(!opt.type) opt.type = 'xpath'
    opt.search = search

    return new Promise (async (resolve,reject)=>{        
        try {

            log.uiCommand('SEE', opt.search)
            
            let element = await locator(opt)

            await core.takeScreenshot(`SEE: ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))
            resolve(element);

        }
        catch (e) {
            core.takeScreenshot('[Failed] SEE: ' + opt.search).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(e,`SEE [${opt.search}]`);

            reject(e);
        }
    }).timeout(opt.timeout*1000,`[Timeout] [SEE: ${opt.search}]`)


}

see.xpath = async (search, opt = {}) => {

    opt.type = 'xpath'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}

see.className = async (search, opt = {}) => {

    opt.type = 'className'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}


see.css = async (search, opt = {}) => {

    opt.type = 'css'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}

see.id = async (search, opt = {}) => {

    opt.type = 'id'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}

see.name = async (search, opt = {}) => {

    opt.type = 'name'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}

see.linkText = async (search, opt = {}) => {

    opt.type = 'linkText'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}

see.partialLinkText = async (search, opt = {}) => {

    opt.type = 'partialLinkText'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}

see.tagName = async (search, opt = {}) => {

    opt.type = 'tagName'
    const _ = await see(search, opt);
    return await Promise.resolve(_);


}


let notSee = async (search, opt = {}) => {

    // set default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;
    if(!opt.type) opt.type = 'xpath'
    opt.search = search

    return new Promise (async (resolve,reject)=>{        
        try {

            log.uiCommand('NOT SEE', opt.search)

            let isFind = true;

            try {
            
                let element = await locator(opt)
            
            }
            catch (e) {
            
                isFind = false;
            }
            
            

            if (!isFind){

                await core.takeScreenshot(`NOT SEE: ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))
                resolve(true); 

            }
            else {

                await core.takeScreenshot(`[Failed] NOT SEE: ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))
                reject(`[NOT SEE] Object found but object should not have been found [${opt.search}]`);
            }


        }
        catch (e) {
            core.takeScreenshot('[Failed] NOT SEE: ' + opt.search).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(e,`NOT SEE [${opt.search}]`);
        }
    }).timeout(opt.timeout*1000,`[Timeout] [NOT SEE: ${opt.search}]`)


}

notSee.xpath = async (search, opt = {}) => {

    opt.type = 'xpath'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}

notSee.className = async (search, opt = {}) => {

    opt.type = 'className'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}


notSee.css = async (search, opt = {}) => {

    opt.type = 'css'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}

notSee.id = async (search, opt = {}) => {

    opt.type = 'id'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}

notSee.name = async (search, opt = {}) => {

    opt.type = 'name'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}

notSee.linkText = async (search, opt = {}) => {

    opt.type = 'linkText'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}

notSee.partialLinkText = async (search, opt = {}) => {

    opt.type = 'partialLinkText'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}

notSee.tagName = async (search, opt = {}) => {

    opt.type = 'tagName'
    const _ = await notSee(search, opt);
    return await Promise.resolve(_);


}






module.exports.see = see;
module.exports.notSee = notSee;
module.exports.locator = locator;
