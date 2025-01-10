#!/usr/bin/env node

const config = require ('../services/config');
const core = require('../services/core')
const { existsSync,cpSync } = require('fs');
const inquirer = require('inquirer');
const { Command } = require('commander');
const program = new Command();
const {spawn} = require("child_process");
const path = require('path');
const fs = require('fs');
const figures = require('figures');
const colors = require('chalk');




if (process.versions.node && process.versions.node.split('.') && process.versions.node.split('.')[0] !== '20') {
    console.log('NodeJS = 20 is required to run.'); 
    console.log();
    console.log('Please upgrade your NodeJS engine');
    console.log(`Current NodeJS version: ${process.version}`);
    process.exit(1);
}


program
  .name('sente')
  .description(config.senteLogo)
  .usage('<command> [options]')
  .usage('<file> [options]')
  .version(config.senteVersion,'--version, -v', '[Current version]');

// program.command('split')
//   .description('Split a string into substrings and display as an array')
//   .argument('<string>', 'string to split')
//   .option('--first', 'display just the first substring')
//   .option('-s, --separator <char>', 'separator character', ',')
//   .action((str, options) => {
//     const limit = options.first ? 1 : undefined;
//     console.log(str.split(options.separator, limit));
//   });


  program.command('init')
  .description('Sente Initiliazation')
  .action(async _=>{

      // Sente exist?
      if (existsSync(path.join(process.cwd(),'package.json'))){
          console.log('')
          console.log(`Found package.json in this directory [${process.cwd()}]`);
          console.log(`Existing settings will be lost if you want to install`);
          console.log('')

          inquirer
              .prompt([

                  {name: "confirmation",
                      type: "list",
                      message: "Do you want to continue",
                      choices: [ "No", "Yes" ]}

              ])
              .then(command_confirm=>{
                  if(command_confirm.confirmation !== 'Yes') {
                      console.log('')
                      console.log('Sente initializing canceled.')
                      console.log('')
                  }
                  else {
                    copySampleProject();
                  }
              });

      }
      else {

        copySampleProject();


          
      }

  });

  program.command('new-test')
  .description('Generate New Test File')
  .action(async _=>{

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'testName',
        message: 'Enter Test Name:',
        validate: function (input) {
          const isValid = /^[^<>:"/\\|?*\s]+$/.test(input);
          if (!isValid) {
            return 'Test name cannot contain spaces or any of the following characters: < > : " / \\ | ? *';
          }
          return true;
        },
      },
    ]);

    
    const sanitizedTestName = await answers.testName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[<>:"/\\|?*]+/g, '');


    const testFilePath = path.join(process.cwd(), `${sanitizedTestName}.js`);

    if (existsSync(testFilePath)) {
      console.log(colors.red(figures.cross + '  Error:') +` Test file with the name "${sanitizedTestName}.js" already exists in this directory.`);
      return;
    }


    const typeAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'testType',
        message: 'Select Test Type:',
        choices: ['web-gui', 'backend'],
      },
    ]);

    const testType = typeAnswer.testType;

    await newTest(sanitizedTestName, testType);




          
 

  });

  program.command('new-helper')
  .description('Generate New Helper File')
  .action(async _=>{

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'helperName',
        message: 'Enter Helper Name:',
        validate: function (input) {
          const isValid = /^[^<>:"/\\|?*\s]+$/.test(input);
          if (!isValid) {
            return 'Helper name cannot contain spaces or any of the following characters: < > : " / \\ | ? *';
          }
          return true;
        },
      },
    ]);

    
    

    let helperDir = path.join(process.cwd(), 'helpers');

    if (!existsSync(helperDir)) {
      console.log(`The directory "helpers" does not exist in the current working directory.`);
      console.log('Searching in parent directories...');
      
      let currentDir = process.cwd();
      let found = false;

      while (currentDir !== path.parse(currentDir).root) {
      currentDir = path.dirname(currentDir);
      
      const parentHelperDir = path.join(currentDir, 'helpers');
   
      
      
      if (existsSync(parentHelperDir)) {
        console.log(`Found "helpers" directory in parent directory: ${currentDir}`);
        helperDir = path.join(currentDir, 'helpers');
        found = true;
        break;
      }
      }

      if (!found) {
      console.log(colors.red(figures.cross + '  Error:') + ` The directory "helpers" does not exist in any parent directories.`);
      return;
      }
    }

    const sanitizedHelperName = await answers.helperName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[<>:"/\\|?*]+/g, '');

      

      const helperFilePath = path.join(helperDir, `${sanitizedHelperName}.js`);
      

    if (existsSync(helperFilePath)) {
      console.log(colors.red(figures.cross + '  Error:') + ` Helper file with the name "${sanitizedHelperName}.js" already exists in this directory.`);
      return;
    }

    await newHelper(sanitizedHelperName,helperFilePath);




          
 

  });

let copySampleProject = async () => {

  console.log(" Sente Initializing\n");

  let sourceFolder =  path.join(path.resolve(__dirname, '..'),'assets','sample_project')
          
  await cpSync(sourceFolder,process.cwd(),{recursive: true})

  // npm install command
  let run = spawn('npm',['install'], {
    cwd: process.cwd(),
    // stdio: "inherit",
    shell: true
  });
            
  run.stdout.on('data', function (stdout) {

      console.log(stdout.toString());      
                              
  })

  run.stderr.on('data', function (stderr) {

      console.log(stderr.toString());
      
  });

}

let newTest = async (testName,testType) => {

  console.log("Generating Test File\n");

  let sourceFile =  path.join(path.resolve(__dirname, '..'),'assets','new_items','new_test.js');



  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const result = data.replace(/TEST_NAME_HERE/g, testName).replace(/TEST_TYPE_HERE/g, testType);

    const destinationFile = path.join(process.cwd(), `${testName}.js`);
    fs.writeFile(destinationFile, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }


      console.log(colors.green(figures.tick + '  ' + `Test file generated.`) + '\n   ' + destinationFile)
    });
  });

  
  



}
let newHelper = async (helperName,helperFilePath) => {

  console.log("Generating Helper File\n");

  let sourceFile =  path.join(path.resolve(__dirname, '..'),'assets','new_items','new_helper.js');



  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const result = data.replace(/HELPER_NAME/g, helperName);

    fs.writeFile(helperFilePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }


      console.log(colors.green(figures.tick + '  ' + `Helper file generated.`) + '\n   ' + helperFilePath)


      const indexFilePath = path.join(path.dirname(helperFilePath), 'index.js');

      fs.readFile(indexFilePath, 'utf8', (err, indexData) => {
        if (err) {
          console.error(`Error reading index file: ${err}`);
          return;
        }

        const lines = indexData.split('\n');        
        const exportLineIndex = lines.findIndex(line => line.includes('module.exports = exports'));

        if (exportLineIndex === -1) {
          console.error('Error: "module.exports = exports" not found in index.js');
          return;
        }

        const lastNonEmptyLineIndex = (() => {
          for (let i = exportLineIndex - 1; i >= 0; i--) {
        if (lines[i].trim() !== '') {
          return i;
        }
          }
          return -1;
        })();

        if (lastNonEmptyLineIndex !== -1) {
          lines.splice(lastNonEmptyLineIndex + 1, 0, `exports.${helperName} = require('./${helperName}').${helperName}`);
        }
        

        fs.writeFile(indexFilePath, lines.join('\n'), 'utf8', (err) => {
          if (err) {
        console.error(`Error writing index file: ${err}`);
        return;
          }

          console.log(colors.green(figures.tick + '  ' + `Index file updated.`) + '\n   ' + indexFilePath);
        });
      });

      


      
    });
  });

  
  



}

program
    .arguments('<file> [options]')
    .option('--env <value>',`[Environment] Usage: --env=dev-env1` )
    .option('--config <value>',`[Override Config] Usage: --config=' "parameter1":"value1", "parameter2":["valueX","valueY"], "parameter3":{"parameter4":"valueZ"} '`)
    .option('-t, --take_screenshoot','Take screenshot on every step')
    .option('-s, --sente','Test run on sente cloud ')
    // .option('-d, --debug','Test run debug mode' ,false)
    // .option('-r, --repetition_on_error <number>','Repetition on error',0)
    // .option('-p, --parameters <value>',`Test parameters. Usage:  '{"parameter1":"value1","paremeter2":"value2"}'  `,'{}')
    .action(async file=>{
  
        let filePath = path.join(process.cwd(),file);

        core.startTest({fileName:file, filePath: filePath},program.opts())

    });

    program.command('new-environment')
      .description('Generate New Environment')
      .action(async _ => {

        const typeAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'envType',
            message: 'Select Environment Type:',
            choices: ['development', 'production'],
          },
        ]);

        const envNameAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'envName',
            message: 'Enter Environment Name:',
            validate: function (input) {
              const isValid = /^[^<>:"/\\|?*\s]+$/.test(input);
              if (!isValid) {
                return 'Environment name cannot contain spaces or any of the following characters: < > : " / \\ | ? *';
              }
              return true;
            },
          },
        ]);

        const envName = envNameAnswer.envName;

        const envType = typeAnswer.envType;
        let envDir = path.join(process.cwd(), 'environments');

        if (!existsSync(envDir)) {
          console.log(`The directory "environments" does not exist in the current working directory.`);
          console.log('Searching in parent directories...');
          
          let currentDir = process.cwd();
          let found = false;

          while (currentDir !== path.parse(currentDir).root) {
            currentDir = path.dirname(currentDir);
            const parentEnvDir = path.join(currentDir, 'environments');
            
            if (existsSync(parentEnvDir)) {
              console.log(`Found "environments" directory in parent directory: ${currentDir}`);
              envDir = parentEnvDir;
              found = true;
              break;
            }
          }

          if (!found) {
            console.log(colors.red(figures.cross + '  Error:') + ` The directory "environments" does not exist in any parent directories.`);
            return;
          }
        }

        const targetDir = path.join(envDir, envType);
        if (!existsSync(targetDir)) {
          console.log(colors.red(figures.cross + '  Error:') + ` The directory "${envType}" does not exist in the "environments" directory.`);
          return;
        }

        const existingDirs = fs.readdirSync(targetDir).filter(name => name.startsWith('env')).sort();
        const lastEnvNumber = existingDirs.length > 0 ? parseInt(existingDirs[existingDirs.length - 1].replace('env', '')) : 0;
        const newEnvDir = path.join(targetDir, `env${lastEnvNumber + 1}`);
        let environmentKey = 'env'+(lastEnvNumber +1);

        fs.mkdirSync(newEnvDir);
        console.log(colors.green(figures.tick + '  ' + `Environment directory created.`) + '\n   ' + newEnvDir);


        let sourceFile =  path.join(path.resolve(__dirname, '..'),'assets','new_items','configs.js');

        fs.readFile(sourceFile, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file: ${err}`);
            return;
          }

          const config1Path = path.join(newEnvDir, 'configs-1.js');
          const config2Path = path.join(newEnvDir, 'configs-2.js');

          fs.writeFile(config1Path, data, 'utf8', (err) => {
            if (err) {
              console.error(`Error writing file: ${err}`);
              return;
            }
            console.log(colors.green(figures.tick + '  ' + `Config file generated.`) + '\n   ' + config1Path);
          });

          fs.writeFile(config2Path, data, 'utf8', (err) => {
            if (err) {
              console.error(`Error writing file: ${err}`);
              return;
            }
            console.log(colors.green(figures.tick + '  ' + `Config file generated.`) + '\n   ' + config2Path);
          });
        });
        
        const indexFilePath = path.join(path.dirname(newEnvDir), 'index.js');

        fs.readFile(indexFilePath, 'utf8', (err, indexData) => {
          if (err) {
            console.error(`Error reading index file: ${err}`);
            return;
          }

          const lines = indexData.split('\n');
          const exportLineIndex = lines.findIndex(line => line.includes('module.exports = exports'));

          if (exportLineIndex === -1) {
            console.error('Error: "module.exports = exports" not found in index.js');
            return;
          }

          const lastNonEmptyLineIndex = (() => {
            for (let i = exportLineIndex - 1; i >= 0; i--) {
              if (lines[i].trim() !== '') {
                return i;
              }
            }
            return -1;
          })();

          let newConfigLine=`
exports.${environmentKey} = {
        environment_name: '${envName}',
        ...require('./${environmentKey}/configs-1'),
        ...require('./${environmentKey}/configs-2'),
        ...require('./global.configs'),    
};
`
          if (lastNonEmptyLineIndex !== -1) {
            lines.splice(lastNonEmptyLineIndex + 1, 0, newConfigLine);
          }

          fs.writeFile(indexFilePath, lines.join('\n'), 'utf8', (err) => {
            if (err) {
              console.error(`Error writing index file: ${err}`);
              return;
            }

            console.log(colors.green(figures.tick + '  ' + `Index file updated.`) + '\n   ' + indexFilePath);

            setTimeout(_=>{
              console.log( '\n' + colors.green('New environment generated successfully.\nEnvironment Name: ' + envName + '\nEnvironment Key: ' +environmentKey  ) );
            },100)

          });
        });


        

      });

// program.parse();
program.parse(process.argv);

