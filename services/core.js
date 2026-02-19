let core={};
const { existsSync, mkdirSync, chmodSync, readdirSync, statSync, rmdirSync, readFileSync, writeFileSync} = require('fs');
const path = require('path');
core.random = require('random');
const axios = require('axios');
const log = require('./logger').log;
const os = require('os');
const moment = require('moment');




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

            let defaultConfig =`{`

            // set default config
            let fileFullPath = require('path').resolve(file.fileName)
            let fileName = require('path').basename(file.fileName)           
            defaultConfig += `"file_name":"${fileName}", "file_full_path":"${fileFullPath.replace(/\\/g, "\\\\")}" `   

            // set configs that come with cli 
            if(options.config) defaultConfig += ' , ' + options.config

            // set take-screenshoot
            if(options.take_screenshoot) defaultConfig += ' , "take_screenshoot":"true" '

            // set sente cloud
            if(options.sente) defaultConfig += ' , "run_on_sente_cloud":"true" '

            // set new web gui session
            if(options.new) defaultConfig += ' , "always_new_web_gui_session":"true" '

            // end configs
            defaultConfig += `}`
            
            run_parameters += ' --config=' + Buffer.from(defaultConfig, 'utf-8').toString('base64');


    
    
            await require("child_process").spawnSync('node', [file.filePath, run_parameters], {
                cwd: process.cwd(),
                stdio: "inherit",
                shell: true
            });
            
        }
        else {
            log.error(`Test File Not Found! `);
            
        }

    }
    catch (e) {
        log.error(e);
        
    }
    finally {
        process.exit();
    }

}

core.overrideRepo = (ObjectRepoField,InsertItems,keyWord='<sente>') => {
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

core.generateRandomNamedDirectory = async(path_) => {

    if (!existsSync(path_))   await mkdirSync(path_, { recursive: true });
    

    let directoryName = core.random.int(100000, 999999) + '' + core.random.int(100000, 999999) + '' + core.random.int(100000, 999999);
    let fullPath = path.join(path_,directoryName)

    if (!existsSync(fullPath)) {
       
        try { 
            await mkdirSync(fullPath, { recursive: true });
            await chmodSync(fullPath, '0777');
        } catch (e) {
            log.warn(`Could not set directory permissions [${fullPath}]`)
        }
    }
    else { log.warn( fullPath + ' is exist!')}
   
    return [fullPath,directoryName];

}

core.cleanEmptyFoldersRecursively = async(folder) => {
    
    try {

        if (!existsSync(folder)) {
            return;
        }
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
          let stats = await statSync(folder);
          let now = new Date().getTime();
          let endTime = new Date(stats.ctime).getTime() + 86400000; // 24 hours in milliseconds

          if (now > endTime) {
            await rmdirSync(folder);
          }
          return;
        }
    }
    catch (e) {
        log.warn('[cleanEmptyFoldersRecursively] Error')
        console.log(e)
    }

}
core.duration = (opt) => {
    
    if(!opt.startDate) throw new Error('startDate must')
    if(!opt.endDate) opt.endDate = new Date().getTime();
    if(!opt.unit) opt.unit = 'ms';
    if (['s','ms'].indexOf(opt.unit) == -1) throw new Error('Unit must ms or s')
    if(isNaN(opt.startDate) || isNaN(opt.startDate))  throw new Error('Value sent to seconds-converter must be a number.')
            

    let d, h, m, s 
    let duration = ''

    s = Math.abs(Math.round(opt.endDate - opt.startDate))

    if (opt.unit === 'ms') s = Math.abs(Math.round(s/1000))
    if(s<1) s = 1;

  m = Math.floor(s / 60)
  s = s % 60
  h = Math.floor(m / 60)
  m = m % 60
  d = Math.floor(h / 24)
  h = h % 24

  if(d !==0) duration += ' ' + d + ' days ';
  if(h !==0) duration += ' ' + h + ' hours ';
  if(m !==0) duration += ' ' + m + ' minutes ';
  if(s !==0) duration += ' ' + s + ' seconds';

//   return {days: d, hours: h, minutes: m, seconds: s}
    return duration

}

core.importParameter = async(key) => {

    if(!key) throw new Error('key undefined!')

    if(config.run_on_sente_cloud) {
        if(!config['exported_test_parameter_' + key]) {        
            log.warn(`[Import Parameter] ${key} undefined!` );
            return false;
        }
        else return config['exported_test_parameter_' + key]
    }
    else {

        let parameterFile = path.join(os.tmpdir(),'sente_parameter_bus.json');
        if( !existsSync(parameterFile)) {
            log.error(`[Import Parameter] "sente_parameter_bus.json" file undefined!` )
            return false;
        }
        
        let fileData = await readFileSync(parameterFile);
    
        let fileJson = JSON.parse(fileData);
    
        if(!fileJson['exported_test_parameter_' + key]) {
            log.warn(`[Import Parameter] ${key} undefined!` )
            return false;
        }
        else {
            try{
                return JSON.parse(fileJson['exported_test_parameter_' + key])
            }
            catch(e) {
                return fileJson['exported_test_parameter_' + key]
            }

            }
        

    }


   

};

core.exportParameter = async(key,value, options = {isPermanent : false}) => {

    if(!key || !value) throw new Error('[exportParameter] key or value undefined!')
    // value = value.toString().trim().replace(/\s+/g, '_')

    if(core.isObject(value) || Array.isArray(value)) {
        try {
            value = JSON.stringify(value);
        } catch (e) {
            log.warn('An error occurred while consolidating test export data with the configuration file. This error may be caused by one of the parameters in your configuration file or exportedTest being unable to convert to proper JSON format.');
            return;
        }
    }

    if (typeof value === 'string') {
        try {
            value = (value.trim() === '') ? value : value.trim()
            .replace(/\'/g, '"')  // tek tırnakları çift tırnağa çevir
            .replace(/\n/g, '\\n')  // satır sonu karakterlerini escape et
            .replace(/\r/g, '\\r')  // carriage return karakterlerini escape et
            .replace(/\t/g, '\\t')  // tab karakterlerini escape et
            
            value = JSON.stringify(value);
        } catch (e) {
            log.warn('An error occurred while converting string value to JSON format.');
            return;
        }
    }

    
    if(config.run_on_sente_cloud) { 

        if(options.isPermanent === true)  console.log(`<senteExportTestParameter>exported_test_parameter_permanent_${key}<sente>${value}</senteExportTestParameter>`);
        else  console.log(`<senteExportTestParameter>exported_test_parameter_${key}<sente>${value}</senteExportTestParameter>`);

    }else {


        let parameterFile = path.join(os.tmpdir(),'sente_parameter_bus.json');
        let fileJson = {};
    
        if( existsSync(parameterFile)) {
            let fileData = await readFileSync(parameterFile);
            fileJson = JSON.parse(fileData);
        }
        
    
        fileJson['exported_test_parameter_' + key] = value
        let writeData = await JSON.stringify(fileJson)
        await writeFileSync(parameterFile,writeData)
        return;

    }

   

};
core.isObject = (variable) => {
    return variable && typeof variable === 'object' && !Array.isArray(variable);
};
core.getDownloadFiles = async() => {
    
    try {

        let directory = config.download_directory;

        if (!existsSync(directory)) {
            log.warn(`Directory does not exist: ${directory}`);
            return [];
        }

        const files = readdirSync(directory);

        if (files.length === 0) {
        log.warn(`No files found in directory: ${directory}`);
        return [];
        } else {
        log.info(`Found ${files.length} files in directory: ${directory}`);
        }

        return files.map(file => {
        const filePath = path.join(directory, file);
        const stats = statSync(filePath);
            return {
                name: file,
                extension: path.extname(file),
                fullPath: filePath,
                modifiedDate: moment(stats.mtime).format('YYYY-MM-DD HH:mm:ss'), // Format the date
                size: `${stats.size} bytes` // Specify the unit for size
            };
        }).sort((a, b) => b.modifiedDate - a.modifiedDate);

    }
    catch (e) {
        log.warn('[getDownloadFiles] Error')
        console.log(e)
    }

}






module.exports = core;