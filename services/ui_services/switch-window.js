
const {log,wait_,wait} = require('../logger');
const core = require('./driver');
const Promise = require('bluebird');
const colors = require('chalk');
const figures = require('figures');



let switchToWindow = {};

let goWindow = async(orderNo) => {
    let window = [];

    await driver.getAllWindowHandles().then(async d => {
        if (orderNo === 'last') {
            await driver.switchTo().window(d[(d.length - 1)]);
            await window.push(d[orderNo]);
        } else {
            await driver.switchTo().window(d[orderNo]);
            await window.push(d[(d.length - 1)]);

        }
    });

    await driver.sleep(2000);
    await driver.getTitle().then(d => window.push(d));
    return window;
};

switchToWindow.switchToWindow = async (opt = {contains: false, timeout: senteConfig.uiClassTimeout, isStepLogActive: true}) => {
     

    if (!opt.winName || opt.winName.trim() === '') {
        throw new Error('switchToWindow: winName is required');
    }




    return new Promise (async (resolve,reject)=>{        
        try {


            log.uiCommand('SWITCH TO WINDOW', `Window Name: ${opt.winName}`)

            let i;
            let w = [];
            do {
                winName = "";
                w = [];


                await driver.getAllWindowHandles().then(d => w = d);

                for (i = 0; i < w.length; i++) {
                    await goWindow(i).then((d) => {
                        winName = d[1];
                    });
                    if (winName === opt.winName) i = 100;
                    if( (opt.contains === false && winName === opt.winName) || (opt.contains === true && winName.indexOf(opt.winName) > -1)) i = 100;
                }

            }
            while ((opt.contains === false && winName !== opt.winName) || (opt.contains === true && winName.indexOf(opt.winName) === -1));


            await wait_(1);
            await core.takeScreenshot(`SWITCH TO WINDOW (Window Name: ${opt.winName}})`).catch(e =>  log.warn(e,'takeScreenshot'))
            if(opt.isStepLogActive === true) global.steps.push({description: colors.cyan.bold(`[SWITCH TO WINDOW]${figures.play} `) + ` Window Name: ${opt.winName}`, status: 'Passed'})

            resolve(true);
        



        }
        catch (e) {
            core.takeScreenshot('[Failed] SCROLL').catch(e =>  log.warn(e,'takeScreenshot'))                
            log.error(e,`SCROLL ERROR`);
            if(opt.isStepLogActive === true) global.steps.push({description: colors.cyan.bold(`[SWITCH TO WINDOW]${figures.play} `) + ` Window Name: ${opt.winName}`, status: 'Failed'})

            reject(e);
        }
    }).timeout((opt.timeout+2000)*1000,`[Timeout] [Scroll]`)


}



module.exports = switchToWindow;
