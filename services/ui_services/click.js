const log = require ('../logger').log;

let click = {};

click.click = (element,opt={}) => {
    
    core.log('DENEME')
    // if(!opt.index) opt.index=0; else opt.index = Number(opt.index);
    // if(!opt.delay) opt.delay=config.defaultDelay;
    // let webElement;

    // element = element.trim();
    // return new Promise (async (resolve,reject)=>{
    //     let elementFullPath = element;
    //     let elementInfoText = element;

    //     try{
    //         if(!par.driver) throw new Error('Driver Not Found');

    //         if(element.substr(0,5) === '@css=') {
    //             elementFullPath = element.substr(5,element.length-5)
    //             elementInfoText = element.substr(5,element.length-5)
    //             commandStart('Click',elementInfoText)
    //             webElement = await par.driver.wait(until.elementLocated(By.css(elementFullPath)),opt.delay*1000);
    //         }
    //         else if(element.substr(0,11) === '@className=') {
    //             elementFullPath = element.substr(11,element.length-5)
    //             elementInfoText = element.substr(11,element.length-5)
    //             commandStart('Click',elementInfoText)
    //             webElement = await par.driver.wait(until.elementLocated(By.className(elementFullPath)),opt.delay*1000);
    //         }
    //         else if(element.substr(0,1) === '@') {
    //             elementFullPath = `//*[${element}]`
    //             elementInfoText = element.split('=')[1]
    //         }
    //         else if(element.substr(0,6) === 'text()') {
    //             elementFullPath = `//*[${element}]`
    //             elementInfoText = element.split('=')[1]
    //         }
    //         else if(element.substr(0,1) !== '/') {
    //             elementFullPath = `//*[contains(text(),"${element}")] | //*[contains(@placeholder,"${element}")] `
    //         }



    //         if(webElement) {
    //             debug(`Try Click (${elementFullPath})`)
    //             await webElement.click();
    //         }
    //         else if(opt.index === 0) {
    //             commandStart('Click',elementInfoText)
    //             let timeout = false;
    //             let timeoutInterval = setTimeout(_=>{timeout=true},opt.delay*1000);

    //             debug('Try Click in loop '+elementFullPath);
    //             for(let i = 1; i<11; i++){
    //                 try{
    //                     let elementFullPath_=`(${elementFullPath})[${i}]`;

    //                     webElement = await par.driver.wait(until.elementLocated(By.xpath(elementFullPath_)),100);
    //                     await webElement.click();
    //                     clearTimeout(timeoutInterval);
    //                     break;
    //                 }
    //                 catch (e) {
    //                     if(timeout) {debug(`Element click error in loop (${elementFullPath})`); debug(e); throw new Error();}
    //                     if(i===10) { i=0;await wait(1);}
    //                 }
    //             }
    //         }
    //         else{
    //             debug(`Try Click (${elementFullPath})[${opt.index}]`)
    //             commandStart('Click',elementInfoText)
    //             webElement = await par.driver.wait(until.elementLocated(By.xpath(`(${elementFullPath})[${opt.index}]`)),opt.delay*1000);
    //             await webElement.click();

    //         }


    //         await commandSuccess();
    //         await wait(1);
    //         await takeScreenshot('Click to ['+elementInfoText+']')
    //         resolve(webElement);

    //     }
    //     catch  (e) {
    //         error(`Error click to ${elementInfoText}  element: ${elementInfoText !== elementFullPath ? elementFullPath : ''}`)
    //         error(e);
    //         takeScreenshot('[Failed] Click to ['+elementInfoText+']').then(_=>reject(e));

    //     }
    // })

}


module.exports = click;