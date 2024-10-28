let core={};
module.exports = {};

const { existsSync, mkdirSync, chmodSync, readdirSync, statSync, rmdirSync} = require('fs');
const path = require('path');
core.random = require('random');
const axios = require('axios');
const log = require('./logger').log;



core.dirSeparator=()=>{
    return (/^win/.test(process.platform)) ? '\\' : '/';
}


core.translate =  (code) => {
    
    try {
        

        let res;
        let codeArray = code.split('.');  
        

        if(global.senteConfig.languages.keywords.indexOf(global.config.current_language)<0) {
    
            log(global.config.current_language + ' language packet not found! ')
            return '[' + global.config.current_language + ' language packet not found!]' 
    
        }
        else {
            
            res = global.senteConfig.languages[global.config.current_language]
    
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

            // set default config
            let fileFullPath = require('path').resolve(file.fileName)
            let fileName = require('path').basename(file.fileName)           
            defaultConfig += `"file_name":"${fileName}", "file_full_path":"${fileFullPath}" `   

            // set configs that come with cli 
            if(options.config) defaultConfig += ' , ' + options.config

            // set attach_to_active_web_gui_session
            if(options.attach) defaultConfig += ' , "attach_to_active_web_gui_session":"true" '

            // set take-screenshoot
            if(options.take_screenshoot) defaultConfig += ' , "take_screenshoot":"true" '

            // end configs
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

core.overrideRepo = (ObjectRepoField,InsertItems,keyWord='XXXX') => {
    try {
        if(!ObjectRepoField) throw new Error('[overrideRepo] Repo field undefined!')
        if(!InsertItems || InsertItems==='') throw new Error('[overrideRepo] InsertItems  undefined!')


        // multi items insert
        if(Array.isArray(InsertItems)){

            
            if(InsertItems.length === 1) {
                
                return ObjectRepoField.toString().replace(new RegExp(keyWord, 'g'),InsertItems); 
            }
            else {

                for(let i=0; i<InsertItems.length; i++) {
     
                    ObjectRepoField = ObjectRepoField.replace( keyWord,InsertItems[i])
                    if(i+1 === InsertItems.length ) return ObjectRepoField;
   
                 }   


            }




        }
        // single item insert
        else {

            return ObjectRepoField.toString().replace(new RegExp(keyWord, 'g'),InsertItems);

        }



        
    } catch (e) {

        log.error(e);
        return ObjectRepoField
        
    }

   

};

core.generateRandomNamedDirectory = async(path) => {

    if (!existsSync(path))   await mkdirSync(path);

    let directoryName = core.random.int(100000, 999999) + '' + core.random.int(100000, 999999) + '' + core.random.int(100000, 999999);
    let fullPath = path + core.dirSeparator() + directoryName

    if (!existsSync(fullPath)) {
       
        try { 
            await mkdirSync(fullPath);
            await chmodSync(fullPath, '0777');
        } catch (e) {
            log.warn(`Could not set directory permissions [${fullPath}]`)
        }
    }
    else { log.warn( fullPath + ' is exist!')}
   
    return fullPath;

}

core.cleanEmptyFoldersRecursively = async(folder) => {

    try {
        let isDir = await statSync(folder).isDirectory();
        if (!isDir) {
          return;
        }
        let files = await readdirSync(folder);
        if (files.length > 0) {
          await files.forEach(async function (file) {
            var fullPath = path.join(folder, file);
            await core.cleanEmptyFoldersRecursively(fullPath);
          });
    
          // re-evaluate files; after deleting subfolder
          // we may have parent folder empty now
          files = await readdirSync(folder);
        }
    
        if (files.length == 0) {
          await rmdirSync(folder);
          return;
        }
    }
    catch (e) {
        log.warn('[cleanEmptyFoldersRecursively] Error')
        console.log(e)
    }



}






module.exports = core;