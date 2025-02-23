
const moment = require('moment');
const isObject = require('isobject');
const boxen = require('boxen');
const colors = require('chalk');
const figures = require('figures');
const styles = {
    error: colors.bgRed.whiteBright.bold,
    failedCase: colors.bgRed.whiteBright.bold,
    passedCase: colors.bgGreen.whiteBright.bold,
    success: colors.green.bold,
    commandSuccess: colors.greenBright.bold,
    command: colors.cyan.bold,
    warn:colors.bgYellow.whiteBright.bold,
    info:colors.yellowBright.bold,
    log: colors.white,
    bold: colors.bold,
    step: colors.blue.bold,
    case: colors.magenta.bold,
    helper: colors.cyan.bold
};



let logger={};



logger.wait = (seconds=3,description='')=> {
    return new Promise(resolve => {

        if(description.toString().trim() === '' ) logger.log(colors.yellow(`[Wait ${seconds}s]` ));
        else {
            logger.log(colors.yellow(`[Wait ${seconds}s]`) + ' ' + description.toString().trim());
        }

        setTimeout(resolve, Number(seconds)*1000);

    })

}
// slient wait
logger.wait_ = (seconds=3)=> {
    return new Promise(resolve => {

        setTimeout(resolve, Number(seconds)*1000);

    })

}


logger.now = (format = 'YYYY-MM-DD HH:mm:ss:SSS') => {
    return moment().format(format).trim();
}



logger.log = (logValue,opt={boxen:false}) => {
    

    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }

    if(opt.boxen) console.log(boxen('[' + logger.now() + '] ' + logValue))
        else console.log('[' + logger.now() + '] ' + logValue)

}

logger.log.error = (logValue_,source='') => {
    
    try {logValue = JSON.stringify(logValue_, Object.getOwnPropertyNames(logValue_))  } catch (e) {logValue = logValue_.toString()}

    if(source.toString().trim() !=='') source = `[${source}]\n`

    console.log('[' + logger.now() + '] ' + figures.cross + '  ' + styles.error('[ERROR]') + ' ' + colors.red(source) + colors.red(logValue))

  


    

}
logger.log.warn = (logValue_,source='') => {
    
    try {logValue = JSON.stringify(logValue_, Object.getOwnPropertyNames(logValue_))  } catch (e) {logValue = logValue_.toString()}    
    if(source.toString().trim() !=='') source = `[${source}]\n`
    console.log('[' + logger.now() + '] ' + figures.warning + '  ' + styles.warn('[WARN]') + ' ' + colors.yellow(source) + colors.yellow(logValue))


}
logger.log.info = (logValue_) => {
    
    let logValue;

    try {logValue = JSON.stringify(logValue_, Object.getOwnPropertyNames(logValue_))  } catch (e) {logValue = logValue_.toString()}    
   
    console.log('[' + logger.now() + '] ' + styles.info(figures.info) + ' ' + logValue )


}

logger.log.passed = () => {
    
    console.log('\n\n')
    console.log(styles.success(` ${figures.tick}  [TEST PASSED] `));
    console.log('\n');

};

logger.log.success = (logValue,opt={boxen:false}) => {
    

    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }

    if(opt.boxen) console.log(boxen('[' + logger.now() + '] ' + styles.success(` ${figures.tick} `) + logValue))
        else console.log('[' + logger.now() + '] ' + styles.success(` ${figures.tick} `) + ' ' + logValue)

}



logger.log.failed = (logValue_) => {

    try {logValue = JSON.stringify(logValue_, Object.getOwnPropertyNames(logValue_))  } catch (e) {logValue = logValue_.toString()}    

    
    console.log('\n\n' + figures.cross + '  ' + styles.error(`[TEST FAILED]`));
    console.log(colors.red(logValue))
    console.log('\n')


};

logger.log.uiCommand = (commandName, logValue) => {

    text = '[' + logger.now() + '] '
    text += styles.command(`[${commandName.toString().trim().toUpperCase()}]${figures.play}  `);
    text += logValue.toString()
    console.log(text);

}



logger.log.boxen = (logValue,options={}) => {
    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }
    console.log(boxen(logValue,options));
};






















module.exports = logger;