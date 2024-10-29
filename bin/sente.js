#!/usr/bin/env node

const config = require ('../services/config');
const core = require('../services/core')

const { Command } = require('commander');
const program = new Command();


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

program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });


// program.command('init')
// .description('Sente Initialization')
// // .option('-D, --default','Initlization with default values')
// .action(async _=>{

//     // Sente exist?
//     if (existsSync(process.cwd()+dirSeparator()+'config.js') || existsSync(process.cwd()+dirSeparator()+'parameters.js')){
//         console.log('')
//         console.log(`Sente is already installed in this directory [${process.cwd()}]`);
//         console.log(`Existing settings will be lost if you want to re-install`);
//         console.log('')

//         inquirer
//             .prompt([

//                 {name: "confirmation",
//                     type: "list",
//                     message: "Do you want to continue",
//                     choices: [ "No", "Yes" ]}

//             ])
//             .then(command_confirm=>{
//                 if(command_confirm.confirmation !== 'Yes') {
//                     console.log('')
//                     console.log('Sente initializing canceled.')
//                     console.log('')
//                 }
//                 else {
//                     initializerCli(_);
//                 }
//             });

//     }
//     else {
//         initializerCli(_);
//     }

// });


program
    .arguments('<file> [options]')
    .option('--env <value>',`[Environment] Usage: --env=dev-env1` )
    .option('--config <value>',`[Override Config] Usage: --config=' "parameter1":"value1", "parameter2":["valueX","valueY"], "parameter3":{"parameter4":"valueZ"} '`)
    .option('-a, --attach','Connect to active web-ui session')
    .option('-t, --take_screenshoot','Take screenshot on every step')
    // .option('-d, --debug','Test run debug mode' ,false)
    // .option('-r, --repetition_on_error <number>','Repetition on error',0)
    // .option('-p, --parameters <value>',`Test parameters. Usage:  '{"parameter1":"value1","paremeter2":"value2"}'  `,'{}')
    .action(async file=>{

        let filePath = `${process.cwd()}${core.dirSeparator()}${file}`;


        core.startTest({fileName:file, filePath: filePath},program.opts())
        // // Sente installed?
        // if (!existsSync(process.cwd()+dirSeparator()+'config.js') || !existsSync(process.cwd()+dirSeparator()+'parameters.js')){
        //     console.log('')
        //     console.log(`Sente not installed in this directory [${process.cwd()}]`);
        //     console.log(`To install Sente, you can run the "sente init" command.`);
        //     console.log('')

        // }
        // else {
        //     await Core.startup();

        //     let file = `${process.cwd()}${Core.dirSeparator()}${_}`;

        //     testRunHandle(file, program.opts());
        // }

    });



// program.parse();
program.parse(process.argv);







// program.usage('<command> [options]');
// program.usage('<file> [options]');
// program.version('v' + packageJson.version, '-v, --version', 'current version');

// program.command('init')
//     .description('Sente Initiliazation')
//     // .option('-D, --default','Initlization with default values')
//     .action(async _=>{

//         // Sente exist?
//         if (existsSync(process.cwd()+dirSeparator()+'config.js') || existsSync(process.cwd()+dirSeparator()+'parameters.js')){
//             console.log('')
//             console.log(`Sente is already installed in this directory [${process.cwd()}]`);
//             console.log(`Existing settings will be lost if you want to re-install`);
//             console.log('')

//             inquirer
//                 .prompt([

//                     {name: "confirmation",
//                         type: "list",
//                         message: "Do you want to continue",
//                         choices: [ "No", "Yes" ]}

//                 ])
//                 .then(command_confirm=>{
//                     if(command_confirm.confirmation !== 'Yes') {
//                         console.log('')
//                         console.log('Sente initializing canceled.')
//                         console.log('')
//                     }
//                     else {
//                         initializerCli(_);
//                     }
//                 });

//         }
//         else {
//             initializerCli(_);
//         }

//     });





