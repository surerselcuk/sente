
const moment = require('moment');
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


isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

logger.now = () => {
    return `[${moment().format('YYYY-MM-DD HH:mm:ss:SSS').trim()}] `;
}

logger.log = (logValue,opt={boxen:false}) => {
    

    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }

    if(opt.boxen) console.log(boxen(logger.now() + logValue))
        else console.log(logger.now() + logValue)

}

logger.log.error = (logValue,opt={boxen:false}) => {
    

    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }
    if(opt.boxen) console.log(boxen(colors.white(logger.now()) + colors.red.bold(figures.cross + ' [ERROR] ') + logValue,{borderColor:'red'}))
    else console.log(logger.now() + colors.red.bold(figures.cross + ' [ERROR] ') + logValue)

}

logger.log.success = (logValue) => {
    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }
    
    console.log(styles.success(` ${figures.tick} ${logValue} `));

};

logger.log.boxen = (logValue,options={}) => {
    if(logValue){
        if(isObject(logValue))logValue=JSON.stringify(logValue);
        else logValue=logValue.toString();
    }
    console.log(boxen(logValue,options));
};






















module.exports = logger;