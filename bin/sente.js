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

program
  .command('new')
  .description('Generate New Item')
  .action(async () => {
    const { itemType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'itemType',
        message: 'What would you like to generate?',
        choices: ['Test', 'Helper', 'Environment', 'Language', 'Object Repository'],
      },
    ]);

    if (itemType === 'Test') {
      await generateNewTest();
    } else if (itemType === 'Helper') {
      await generateNewHelper();
    } else if (itemType === 'Environment') {
      await generateNewEnvironment();
    } else if (itemType === 'Language') {
      await generateNewLanguage();
    } else if (itemType === 'Object Repository') {
      await generateNewObjectRepository();
    }
  });

async function generateNewObjectRepository() {
  let repoDir = path.join(process.cwd(), 'object_repository');

  if (!existsSync(repoDir)) {
    console.log(`The directory "object_repository" does not exist in the current working directory.`);
    console.log('Searching in parent directories...');

    let currentDir = process.cwd();
    let found = false;

    while (currentDir !== path.parse(currentDir).root) {
      currentDir = path.dirname(currentDir);
      const parentRepoDir = path.join(currentDir, 'object_repository');

      if (existsSync(parentRepoDir)) {
        console.log(`Found "object_repository" directory in parent directory: ${currentDir}`);
        repoDir = parentRepoDir;
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(colors.red(figures.cross + '  Error:') + ` The directory "object_repository" does not exist in any parent directories.`);
      return;
    }
  }

  const repoGroups = fs.readdirSync(repoDir).filter(name => fs.lstatSync(path.join(repoDir, name)).isDirectory());
  repoGroups.push('New Group');

  const { repoGroup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'repoGroup',
      message: 'Select Repository Group:',
      choices: repoGroups,
    },
  ]);

  let targetGroupDir = repoGroup === 'New Group' ? await createNewRepoGroup(repoDir) : path.join(repoDir, repoGroup);

  const { repoName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'repoName',
      message: 'Enter Repository Name:',
      validate: function (input) {
        input = input.toLowerCase();
        const isValid = /^[a-zA-Z][a-zA-Z0-9_-]{0,29}$/.test(input);
        if (!isValid) {
          return 'Repository name must start with a letter and can only contain English letters, numbers, underscores, and hyphens, and cannot exceed 30 characters.';
        }
        return true;
      },
      filter: function (input) {
        return input.toLowerCase();
      },
    },
  ]);

  const repoFilePath = path.join(targetGroupDir, `${repoName}.js`);

  if (existsSync(repoFilePath)) {
    console.log(colors.red(figures.cross + '  Error:') + ` Repository file with the name "${repoName}.js" already exists in this directory.`);
    return;
  }

  const sourceFile = path.join(path.resolve(__dirname, '..'), 'assets', 'new_items', 'object_repository.js');
  fs.copyFileSync(sourceFile, repoFilePath);
  console.log(colors.green(figures.tick + '  ' + `Repository file generated.`) + '\n   ' + repoFilePath);

  const indexFilePath = path.join(targetGroupDir, 'index.js');
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
      lines.splice(lastNonEmptyLineIndex + 1, 0, `exports.${repoName} = require('./${repoName}');`);
    }
    
  
  
    fs.writeFile(indexFilePath, lines.join('\n'), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing index file: ${err}`);
        return;
      }
  
      console.log(colors.green(figures.tick + '  ' + `Index file updated.`) + '\n   ' + indexFilePath);

      setTimeout(() => {
        console.log('\n' + colors.green('New object repository file generated successfully.'));
        console.log('Repo: ' + colors.green(repoName));
      }, 100);

    });
  });



}

async function createNewRepoGroup(repoDir) {
  let { groupName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'groupName',
      message: 'Enter New Group Name:',
      validate: function (input) {
        input = input.toLowerCase();
        const isValid = /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(input);
        if (!isValid) {
          return 'Group name must start with a letter and can only contain English letters, numbers, underscores, and hyphens.';
        }
        if (input.length > 30) {
          return 'Group name cannot exceed 30 characters.';
        }
        if (fs.existsSync(path.join(repoDir, input))) {
          return 'Group name already exists. Please enter a different name.';
        }
        return true;
      },
      filter: function (input) {
        return input.toLowerCase();
      },
    },
  ]);

  groupName = groupName.toString().toLowerCase();

  const newGroupDir = path.join(repoDir, groupName);
  await fs.mkdirSync(newGroupDir);

  const sourceIndexFile = path.join(path.resolve(__dirname, '..'), 'assets', 'new_items', 'object_repository_index.js');
  const targetIndexFile = path.join(newGroupDir, 'index.js');
  fs.copyFileSync(sourceIndexFile, targetIndexFile);

  console.log(colors.green(figures.tick + '  ' + `New group directory created.`) + '\n   ' + newGroupDir);

  // update index file
  const indexFilePath = path.join(repoDir, 'index.js');
  await fs.readFile(indexFilePath, 'utf8', async (err, indexData) => {
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
      lines.splice(lastNonEmptyLineIndex + 1, 0, `exports.${groupName} = require('./${groupName}');`);
    }
    
  
  
    await fs.writeFileSync(indexFilePath, lines.join('\n'), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing index file: ${err}`);
        return;
      }
  
      console.log(colors.green(figures.tick + '  ' + `Index file updated.`) + '\n   ' + indexFilePath);
    });
  });


  return newGroupDir;
}

async function generateNewLanguage() {
  let languageDir = path.join(process.cwd(), 'languages');

  if (!existsSync(languageDir)) {

    let currentDir = process.cwd();
    let found = false;

    while (currentDir !== path.parse(currentDir).root) {
      currentDir = path.dirname(currentDir);
      const parentLanguageDir = path.join(currentDir, 'languages');

      if (existsSync(parentLanguageDir)) {
        languageDir = parentLanguageDir;
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(colors.red(figures.cross + '  Error:') + ` The directory "languages" does not exist in any parent directories.`);
      return;
    }
  }

  const validLanguageCodes = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh': 'Chinese', 'ja': 'Japanese', 'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi', 'bn': 'Bengali', 'pa': 'Punjabi', 'jv': 'Javanese', 'ms': 'Malay', 'id': 'Indonesian', 'vi': 'Vietnamese', 'th': 'Thai', 'tr': 'Turkish', 'fa': 'Persian', 'ur': 'Urdu', 'pl': 'Polish', 'uk': 'Ukrainian', 'ro': 'Romanian', 'nl': 'Dutch', 'el': 'Greek', 'hu': 'Hungarian', 'sv': 'Swedish', 'fi': 'Finnish', 'da': 'Danish', 'no': 'Norwegian', 'cs': 'Czech', 'sk': 'Slovak', 'bg': 'Bulgarian', 'sr': 'Serbian', 'hr': 'Croatian', 'sl': 'Slovenian', 'lt': 'Lithuanian', 'lv': 'Latvian', 'et': 'Estonian', 'is': 'Icelandic', 'mt': 'Maltese', 'ga': 'Irish', 'cy': 'Welsh', 'af': 'Afrikaans', 'sw': 'Swahili', 'am': 'Amharic', 'yo': 'Yoruba', 'ig': 'Igbo', 'ha': 'Hausa', 'zu': 'Zulu', 'xh': 'Xhosa', 'st': 'Southern Sotho', 'tn': 'Tswana', 'ts': 'Tsonga', 've': 'Venda', 'nr': 'Southern Ndebele', 'ss': 'Swati', 'ny': 'Chichewa', 'rw': 'Kinyarwanda', 'ln': 'Lingala', 'kg': 'Kongo', 'lu': 'Luba-Katanga', 'to': 'Tongan', 'fj': 'Fijian', 'sm': 'Samoan', 'mi': 'Maori', 'haw': 'Hawaiian', 'ht': 'Haitian Creole', 'qu': 'Quechua', 'gn': 'Guarani', 'ay': 'Aymara', 'tt': 'Tatar', 'ba': 'Bashkir', 'cv': 'Chuvash', 'ce': 'Chechen', 'cu': 'Church Slavonic', 'kv': 'Komi', 'kj': 'Kuanyama', 'kr': 'Kanuri', 'ki': 'Kikuyu', 'rn': 'Kirundi', 'sg': 'Sango', 'sn': 'Shona', 'so': 'Somali', 'ty': 'Tahitian', 'bi': 'Bislama', 'ho': 'Hiri Motu', 'mg': 'Malagasy', 'mh': 'Marshallese', 'na': 'Nauruan', 'pi': 'Pali', 'vo': 'Volapük', 'wa': 'Walloon', 'wo': 'Wolof', 'za': 'Zhuang'
  };
  const { languageCode } = await inquirer.prompt([
    {
      type: 'input',
      name: 'languageCode',
      message: 'Enter Language Code (e.g., "en" for English):',
      validate: function (input) {
        input = input.toLowerCase();
        if (!validLanguageCodes[input]) {
          return 'Invalid language code. Please enter a valid two-letter language code (e.g., "en" for English).';
        }
        return true;
      },
      filter: function (input) {
        return input.toLowerCase();
      },
    },
  ]);

  const languageName = validLanguageCodes[languageCode];

  const { confirmLanguage } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmLanguage',
      message: `Did you mean "${languageName}"?`,
      default: true,
    },
  ]);

  if (!confirmLanguage) {
    console.log(colors.red(figures.cross + '  Error:') + ' Language confirmation failed.');
    return;
  }

  const languageFilePath = path.join(languageDir, `${languageCode}.js`);

  if (existsSync(languageFilePath)) {
    console.log(colors.red(figures.cross + '  Error:') + ` Language file with the code [${validLanguageCodes[languageCode]}] "${languageCode}.js" already exists in this directory.`);
    return;
  }

  const sourceFile = path.join(path.resolve(__dirname, '..'), 'assets', 'new_items', 'new_language.js');
  const fileHeader = `/* This file is a translation file for ${validLanguageCodes[languageCode]}.*/\n\n`;
  const fileContent = fs.readFileSync(sourceFile, 'utf8');
  fs.writeFileSync(languageFilePath, fileHeader + fileContent);
  console.log(colors.green(figures.tick + '  ' + `Language file generated.`) + '\n   ' + languageFilePath);

  const indexFilePath = path.join(languageDir, 'index.js');
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
      lines.splice(lastNonEmptyLineIndex + 1, 0, `exports.${languageCode} = require('./${languageCode}');`);
    }

    const keywordsLineIndex = lines.findIndex(line => line.includes('exports.keywords ='));

    if (keywordsLineIndex !== -1) {
      const keywordsLine = lines[keywordsLineIndex];
      const keywordsArrayMatch = keywordsLine.match(/exports\.keywords\s*=\s*\[(.*)\]/);

      if (keywordsArrayMatch && keywordsArrayMatch[1] !== undefined) {
      const keywordsArrayContent = keywordsArrayMatch[1].trim();
      const newKeywordsArrayContent = keywordsArrayContent ? `${keywordsArrayContent}, '${languageCode}'` : `'${languageCode}'`;
      lines[keywordsLineIndex] = `exports.keywords = [${newKeywordsArrayContent}];`;
      }
    }

 

    fs.writeFile(indexFilePath, lines.join('\n'), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing index file: ${err}`);
        return;
      }

      console.log(colors.green(figures.tick + '  ' + `Index file updated.`) + '\n   ' + indexFilePath);

      setTimeout(() => {
        console.log('\n' + colors.green('New language translate file generated successfully.'));
        console.log('Language: ' + colors.green(validLanguageCodes[languageCode]));
      }, 100);
      
    });
  });
}


if (process.versions.node && process.versions.node.split('.') && process.versions.node.split('.')[0] < '20') {
    console.log('NodeJS = 20 is required to run.'); 
    console.log();
    console.log('Please upgrade your NodeJS engine');
    console.log(`Current NodeJS version: ${process.version}`);
    process.exit(1);
}


async function generateNewTest() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'testName',
      message: 'Enter Test Name:',
      validate: function (input) {
        input = input.toLowerCase();
        const isValid = /^[a-zA-Z][a-zA-Z0-9_-]{0,29}$/.test(input);
        if (!isValid) {
          return 'Test name must start with a letter and can only contain English letters, numbers, underscores, and hyphens, and cannot exceed 30 characters.';
        }
        return true;
      },
      filter: function (input) {
        return input.toLowerCase();
      },
    },
  ]);

  const sanitizedTestName = answers.testName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[<>:"/\\|?*]+/g, '');

  const testFilePath = path.join(process.cwd(), `${sanitizedTestName}.js`);

  if (existsSync(testFilePath)) {
    console.log(colors.red(figures.cross + '  Error:') + ` Test file with the name "${sanitizedTestName}.js" already exists in this directory.`);
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

  const sectionAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'hasSections',
      message: 'Does the test have multiple sections?',
      default: false,
    },
  ]);

  const hasSections = sectionAnswer.hasSections;

  await newTest(sanitizedTestName, testType, hasSections);
}

async function generateNewHelper() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'helperName',
      message: 'Enter Helper Name:',
      validate: function (input) {
        input = input.toLowerCase();
        const isValid = /^[a-zA-Z][a-zA-Z0-9_-]{0,29}$/.test(input);
        if (!isValid) {
          return 'Helper name must start with a letter and can only contain English letters, numbers, underscores, and hyphens, and cannot exceed 30 characters.';
        }
        return true;
      },
      filter: function (input) {
        return input.toLowerCase();
      },
    },
  ]);

  let helperDir = path.join(process.cwd(), 'helpers');

  if (!existsSync(helperDir)) {

    let currentDir = process.cwd();
    let found = false;

    while (currentDir !== path.parse(currentDir).root) {
      currentDir = path.dirname(currentDir);
      const parentHelperDir = path.join(currentDir, 'helpers');

      if (existsSync(parentHelperDir)) {
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

  const sanitizedHelperName = answers.helperName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[<>:"/\\|?*]+/g, '');

  const helperFilePath = path.join(helperDir, `${sanitizedHelperName}.js`);

  if (existsSync(helperFilePath)) {
    console.log(colors.red(figures.cross + '  Error:') + ` Helper file with the name "${sanitizedHelperName}.js" already exists in this directory.`);
    return;
  }

  await newHelper(sanitizedHelperName, helperFilePath);
}

async function generateNewEnvironment() {
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
        input = input.toUpperCase();
        const isValid = /^[a-zA-Z][a-zA-Z0-9 _-]{0,99}$/.test(input);
        if (!isValid) {
          return 'Environment name must start with a letter, can only contain English letters, numbers, spaces, underscores, and hyphens, and cannot exceed 100 characters.';
        }
        return true;
      },
      filter: function (input) {
        return input.toUpperCase();
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
  let environmentKey = 'env' + (lastEnvNumber + 1);

  fs.mkdirSync(newEnvDir);
  console.log(colors.green(figures.tick + '  ' + `Environment directory created.`) + '\n   ' + newEnvDir);

  let sourceFile = path.join(path.resolve(__dirname, '..'), 'assets', 'new_items', 'configs.js');

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

    let newConfigLine = `
exports.${environmentKey} = {
  environment_name: '${envName}',
  ...require('./${environmentKey}/configs-1'),
  ...require('./${environmentKey}/configs-2'),
  ...require('./global.configs'),    
};
`;

    if (lastNonEmptyLineIndex !== -1) {
      lines.splice(lastNonEmptyLineIndex + 1, 0, newConfigLine);
    }

    fs.writeFile(indexFilePath, lines.join('\n'), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing index file: ${err}`);
        return;
      }

      console.log(colors.green(figures.tick + '  ' + `Index file updated.`) + '\n   ' + indexFilePath);

      setTimeout(() => {
        console.log('\n' + colors.green('New environment generated successfully.'));
        console.log('Name      : ' + colors.green(envName));
        console.log('Key       : ' + colors.green(environmentKey));
        console.log('Location  : ' + colors.green(envType.toUpperCase()));
      }, 100);
    });
  });
}

program
  .name('sente')
  .description(config.senteLogo)
  .usage('<command> [options]')
  .usage('<file> [options]')
  .version(config.senteVersion,'--version, -v', '[Current version]');


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

let newTest = async (testName,testType, hasSections = false) => {

  console.log("Generating Test File\n");

  let sourceFile =  path.join(path.resolve(__dirname, '..'),'assets','new_items', hasSections ? 'new_test_with_section.js': 'new_test.js');



  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const result = data.replace(/TEST_NAME_HERE/g, testName).replace(/TEST_TYPE_HERE/g, testType);

    let targetDir = process.cwd();
    if (existsSync(path.join(targetDir, 'package.json')) && existsSync(path.join(targetDir, 'tests'))) {
      targetDir = path.join(targetDir, 'tests');
    }

    const destinationFile = path.join(targetDir, `${testName}.js`);
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

          setTimeout(() => {
            console.log('\n' + colors.green('New helper generated successfully.'));
            console.log('Helper Name: ' + colors.green(helperName));
          }, 100);

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
    .action(async file=>{
  
        let filePath = path.join(process.cwd(),file);

        core.startTest({fileName:file, filePath: filePath},program.opts())

    });




program.parse(process.argv);

