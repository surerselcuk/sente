const log = require('./logger').log;
const { existsSync} = require('fs');




let core={};

core.dirSeparator=()=>{
    return (/^win/.test(process.platform)) ? '\\' : '/';
}

core.wait= (seconds)=> {
    return new Promise(resolve => setTimeout(resolve, seconds*1000))
}


core.translate =  (code) => {
    
    try {
        

        let res;
        let codeArray=   code.split('.');

    
        if(!global.senteConfig.languages.keywords) global.senteConfig.languages.keywords = global.senteConfig.defaultLanguageKeywords
        if(!global.config.currentLanguage) global.config.currentLanguage = global.senteConfig.defaultLanguage;
    
        

        if(global.senteConfig.languages.keywords.indexOf(global.config.currentLanguage)<0) {
    
            log(global.config.currentLanguage + ' language packet not found! ')
            return '[' + global.config.currentLanguage + ' language packet not found!]' 
    
        }
        else {
            
            res = global.senteConfig.languages[global.config.currentLanguage]
    
            for (let i of codeArray){
                
                if (!res[`${i}`]) throw new Error (i + ' undefined')
                    else res=   res[`${i}`];
                
                
        
            }
        
            return res;
    
        }
        


    }

    catch (e) {

        core.log.error('[Translate Service] ' + e)
        return code
    }
    




};

core.startTest = async (file,options) => {
    try {
        if(existsSync(file.filePath)) {

            let run_parameters = '';
            if(options.env) run_parameters += ' --env=' + options.env.toLowerCase();

            let defaultConfig =` --config='{`
            defaultConfig += `"file_name":"${file.fileName}", "file_path":"${file.filePath}"`
            if(options.config) defaultConfig += ' , ' + options.config
            defaultConfig += `}'`
            
            run_parameters += defaultConfig

    
    
            await require("child_process").spawnSync('node', [file.filePath, run_parameters], {
                cwd: process.cwd(),
                stdio: "inherit",
                shell: true
            });
            
        }
        else {
            log.error(`File not found! [${file}] `);
            
        }

    }
    catch (e) {
        log.error(e);
        
    }
    finally {
        process.exit();
    }

}



















module.exports = core;