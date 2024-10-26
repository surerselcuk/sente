const log = require('./logger').log;
const { existsSync} = require('fs');




let core={};

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


















module.exports = core;