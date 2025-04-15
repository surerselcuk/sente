
const {log,wait_,wait} = require('../logger');

const Promise = require('bluebird');
const {locator} = require('./locator')
const core = require('./driver');
const colors = require('chalk');
const figures = require('figures');

module.exports = {};





let write = async (search,keys, opt = {}) => {

    // set default
    if(!opt.timeout) opt.timeout = senteConfig.uiClassTimeout;
    if(!opt.type) opt.type = 'xpath'
    if (opt.isStepLogActive === undefined) opt.isStepLogActive = true;
    opt.search = search
  

    return new Promise (async (resolve,reject)=>{        
        try {

            log.uiCommand('WRITE', '"' + keys.toString() + '" to ' +opt.search)
            
            let element = await locator(opt)
            try { await element.clear(); } catch(e) {}
            
           
            
                
            if(Array.isArray(keys)){
                for(let key of keys) {
                    await element.sendKeys(key);
                }
            }
            else {await element.sendKeys(keys);}
            
            await wait_(1);
            await core.takeScreenshot(`WRITE: "${keys.toString()}" to ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))
        

            
            
            if(opt.isStepLogActive === true) global.steps.push({description: colors.cyan.bold(`[WRITE]${figures.play} `) + '"' + keys.toString() + '" to ' + opt.search, status: 'Passed'})

              
            resolve(element);

        }
        catch (e) {

            core.takeScreenshot(`[Failed] WRITE: "${keys.toString()}" to ${opt.search}`).catch(e =>  log.warn(e,'takeScreenshot'))            
            log.error(e,`WRITE: "${keys.toString()}" to ${opt.search}`);
            if(opt.isStepLogActive === true) global.steps.push({description: colors.cyan.bold(`[WRITE]${figures.play} `) + '"' + keys.toString() + '" to ' + opt.search, status: 'Failed'})

            reject(e);
        }
    }).timeout((opt.timeout+1)*1000,`[Timeout] [WRITE: ${keys.toString()}]`)


}

write.xpath = async (search,keys, opt = {}) => {

    opt.type = 'xpath'
    const _ = await write(search,keys, opt);    
    return await Promise.resolve(_);


}

write.className = async (search,keys, opt = {}) => {

    opt.type = 'className'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}


write.css = async (search,keys, opt = {}) => {

    opt.type = 'css'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}

write.id = async (search,keys, opt = {}) => {

    opt.type = 'id'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}

write.name = async (search,keys, opt = {}) => {

    opt.type = 'name'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}

write.linkText = async (search,keys, opt = {}) => {

    opt.type = 'linkText'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}

write.partialLinkText = async (search,keys, opt = {}) => {

    opt.type = 'partialLinkText'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}

write.text = async (search,keys, opt = {}) => {

    opt.type = 'text'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}

write.partialText = async (search,keys, opt = {}) => {

    opt.type = 'partialText'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}

write.tagName = async (search,keys, opt = {}) => {

    opt.type = 'tagName'
    const _ = await write(search,keys, opt);
    return await Promise.resolve(_);


}


let keyboard = {
    NULL:         '\uE000',
    CANCEL:       '\uE001',  // ^break
    HELP:         '\uE002',
    BACK_SPACE:   '\uE003',
    TAB:          '\uE004',
    CLEAR:        '\uE005',
    RETURN:       '\uE006',
    ENTER:        '\uE007',
    SHIFT:        '\uE008',
    CONTROL:      '\uE009',
    ALT:          '\uE00A',
    PAUSE:        '\uE00B',
    ESCAPE:       '\uE00C',
    SPACE:        '\uE00D',
    PAGE_UP:      '\uE00E',
    PAGE_DOWN:    '\uE00F',
    END:          '\uE010',
    HOME:         '\uE011',
    ARROW_LEFT:   '\uE012',
    LEFT:         '\uE012',
    ARROW_UP:     '\uE013',
    UP:           '\uE013',
    ARROW_RIGHT:  '\uE014',
    RIGHT:        '\uE014',
    ARROW_DOWN:   '\uE015',
    DOWN:         '\uE015',
    INSERT:       '\uE016',
    DELETE:       '\uE017',
    SEMICOLON:    '\uE018',
    EQUALS:       '\uE019',

    NUMPAD0:      '\uE01A',  // number pad keys
    NUMPAD1:      '\uE01B',
    NUMPAD2:      '\uE01C',
    NUMPAD3:      '\uE01D',
    NUMPAD4:      '\uE01E',
    NUMPAD5:      '\uE01F',
    NUMPAD6:      '\uE020',
    NUMPAD7:      '\uE021',
    NUMPAD8:      '\uE022',
    NUMPAD9:      '\uE023',
    MULTIPLY:     '\uE024',
    ADD:          '\uE025',
    SEPARATOR:    '\uE026',
    SUBTRACT:     '\uE027',
    DECIMAL:      '\uE028',
    DIVIDE:       '\uE029',

    F1:           '\uE031',  // function keys
    F2:           '\uE032',
    F3:           '\uE033',
    F4:           '\uE034',
    F5:           '\uE035',
    F6:           '\uE036',
    F7:           '\uE037',
    F8:           '\uE038',
    F9:           '\uE039',
    F10:          '\uE03A',
    F11:          '\uE03B',
    F12:          '\uE03C',

    COMMAND:      '\uE03D',  // Apple command key
    META:         '\uE03D',  // alias for Windows key

    /**
     * Japanese modifier key for switching between full- and half-width
     * characters.
     * @see <https://en.wikipedia.org/wiki/Language_input_keys>
     */
    ZENKAKU_HANKAKU: '\uE040',
};

module.exports.write = write;
module.exports.keyboard = keyboard;


