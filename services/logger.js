
const moment = require('moment');
const isObject = require('isobject');
const boxen = require('boxen');
const colors = require('chalk');
const figures = require('figures');
const styles = {
    error: colors.redBright.bold,
    failedCase: colors.bgRed.whiteBright.bold,
    passedCase: colors.bgGreen.whiteBright.bold,
    success: colors.green.bold,
    commandSuccess: colors.greenBright.bold,
    command: colors.cyan.bold,
    warn:colors.bgYellow.whiteBright.bold,
    log: colors.white,
    bold: colors.bold,
    step: colors.blue.bold,
    case: colors.magenta.bold,
    helper: colors.cyan.bold
};




let logger={};



logger.wait = (seconds=3)=> {
    return new Promise(resolve => {

        log(colors.yellow(`[Wait ${seconds}s]`));
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

logger.log.error = (logValue_,opt={boxen:false}) => {
    
    try {logValue = logValue_.toString() } catch (e) {}
    if(opt.boxen) console.log(boxen(colors.white('[' + logger.now() + '] ') + colors.red.bold(figures.cross + ' [ERROR] ') + logValue,{borderColor:'red'}))
    else console.log('[' + logger.now() + '] ' + colors.red.bold(figures.cross + ' [ERROR] ') + logValue)

    console.log(logValue)


    

}
logger.log.warn = (logValue,opt={boxen:false}) => {
    

    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }
    if(opt.boxen) console.log(boxen(colors.yellow('[' + logger.now() + '] ') + colors.yellow.bold(figures.warning + ' [WARN] ') + logValue,{borderColor:'red'}))
    else console.log('[' + logger.now() + '] ' + colors.yellow.bold(figures.warning + ' [WARN] ') + logValue)

}

logger.log.success = (logValue) => {
    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }
    
    console.log(styles.success(` ${figures.tick} ${logValue} `));

};

logger.log.uiCommand = (commandName, logValue) => {

    text = '[' + logger.now() + '] '
    text += styles.command(`[${commandName}]${figures.play}  `);
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