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

  program
    .command('set')
    .description('Set Default Environment')
    .action(async () => {
      let envDir = path.join(process.cwd(), 'environments');

      if (!existsSync(envDir)) {
        let currentDir = process.cwd();
        let found = false;

        while (currentDir !== path.parse(currentDir).root) {
          currentDir = path.dirname(currentDir);
          const parentEnvDir = path.join(currentDir, 'environments');

          if (existsSync(parentEnvDir)) {
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

      const parentAppFilePath = path.join(path.dirname(envDir), 'app.js');

      if (!existsSync(parentAppFilePath)) {
        console.log(colors.red(figures.cross + '  Error:') + ` The app.js file does not exist in the parent "environments" directory.`);
        return;
      }

      const parentAppData = await fs.readFileSync(parentAppFilePath, 'utf8');
      const defaultEnvLine = parentAppData.split('\n').find(line => line.includes('global.senteConfig.defaultEnvironment'));

      if (defaultEnvLine) {
        const currentDefaultEnv = defaultEnvLine.split('=')[1].replace(/['";]/g, '').trim();
        const { confirmChange } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmChange',
            message: `The default environment is "${currentDefaultEnv}". Do you want to change it?`,
            default: true,
          },
        ]);

        if (!confirmChange) {
          console.log(colors.yellow(figures.warning + '  ' + `Default environment remains "${currentDefaultEnv}".`));
          return;
        }
      } else {
        console.log(colors.red(figures.cross + '  Error:') + ` The default environment setting was not found in the app.js file.`);
        return;
      }

      const { envGroup } = await inquirer.prompt([
        {
          type: 'list',
          name: 'envGroup',
          message: 'Select Environment Group:',
          choices: ['Development', 'Production'],
        },
      ]);

      const targetDir = path.join(envDir, envGroup.toLowerCase());
      const indexFilePath = path.join(targetDir, 'index.js');

      if (!existsSync(indexFilePath)) {
        console.log(colors.red(figures.cross + '  Error:') + ` The index.js file does not exist in the "${envGroup}" directory.`);
        return;
      }
      

      const indexData = await fs.readFileSync(indexFilePath, 'utf8');
      
      const envList = indexData
        .split('\n')
        .filter(line => line.trim().startsWith('exports.env'))
        .map(line => line.match(/exports\.(env\d+)/)[1]);

      const { selectedEnv } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedEnv',
          message: 'Select Environment:',
          choices: envList,
        },
      ]);



      const appFilePath = path.join(path.dirname(envDir), 'app.js');

      if (!existsSync(appFilePath)) {
        console.log(colors.red(figures.cross + '  Error:') + ` The app.js file does not exist in the "environments" directory.`);
        return;
      }

      const envPrefix = envGroup == 'Development' ? 'dev' : 'prod';

      let appData = await fs.readFileSync(appFilePath, 'utf8');
      appData = appData.replace(/global\.senteConfig\.defaultEnvironment\s*=\s*['"].*?['"];/, `global.senteConfig.defaultEnvironment = '${envPrefix}-${selectedEnv}';`);

      fs.writeFileSync(appFilePath, appData, 'utf8')      

      
      console.log(colors.green(figures.tick + '  ' + `Default environment set to "${envPrefix}-${selectedEnv}".`) );



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

  let targetGroupDir = repoGroup === 'New Group' ? await generateNewRepoGroup(repoDir) : path.join(repoDir, repoGroup);

  const { repoName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'repoName',
      message: 'Enter Repository Name:',
      validate: function (input) {
        input = input.toLowerCase();
        const isValid = /^[a-zA-Z][a-zA-Z0-9_-]{0,49}$/.test(input);
        if (!isValid) {
          return 'Repository name must start with a letter and can only contain English letters, numbers, underscores, and hyphens, and cannot exceed 50 characters.';
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

async function generateNewRepoGroup(repoDir) {
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
        if (input.length > 50) {
          return 'Group name cannot exceed 50 characters.';
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

  console.log(colors.green(figures.tick + '  ' + `New group directory generated.`) + '\n   ' + newGroupDir);

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
  let testDir = findTestDir();
  if (!testDir) return;

  const folderSelection = await selectOrCreateFolder(testDir);
  if (!folderSelection) return;

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'testName',
      message: 'Enter Test Name:',
      validate: validateTestName,
      filter: sanitizeTestName,
    },
  ]);

  const sanitizedTestName = sanitizeTestName(answers.testName);
  const testFilePath = path.join(folderSelection, `${sanitizedTestName}.js`);
  
  if (fs.existsSync(testFilePath)) {
    console.log(colors.red(figures.cross + '  Error:') + ` Test file "${sanitizedTestName}.js" already exists.`);
    return;
  }

  const typeAnswer = await inquirer.prompt([
    { type: 'list', name: 'testType', message: 'Select Test Type:', choices: ['web-gui', 'backend'] },
  ]);
  
  const sectionAnswer = await inquirer.prompt([
    { type: 'confirm', name: 'hasSections', message: 'Does the test have multiple sections?', default: false },
  ]);

  await newTest(sanitizedTestName, typeAnswer.testType, sectionAnswer.hasSections, folderSelection);
}

function findTestDir() {
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    const potentialDir = path.join(currentDir, 'tests');
    if (fs.existsSync(potentialDir)) return potentialDir;
    currentDir = path.dirname(currentDir);
  }
  console.log(colors.red(figures.cross + '  Error:') + ' "tests" directory not found.');
  return null;
}

async function selectOrCreateFolder(baseDir) {
  const folders = await getAllFolders(baseDir);

  

  const folderChoices = folders.map(folder => {
    const folderDepth = folder.split(path.sep).length - baseDir.split(path.sep).length;
    const indentation = ' '.repeat(folderDepth * 2); // Adjust indentation level
    return {
      name: `${indentation}📂 ${path.basename(folder)}`, // Indentation based on folder depth
      value: folder
    };
  });

  const { selectedFolder } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedFolder',
      message: 'Select a folder for the new test:',
      choices: [
        {
          name: '📁 tests', // Icon for the tests folder
          value: 'tests'
        },
        ...folderChoices,
        new inquirer.Separator(),
        {
          name: '➕ New Directory',
          value: 'Create New Folder',
        },
      ],
    },
  ]);

  let targetPath = baseDir;

  if (selectedFolder !== 'tests' && selectedFolder !== 'Create New Folder') {
    // targetPath = path.join(baseDir, selectedFolder);
    targetPath = selectedFolder;
  }

  if (selectedFolder === 'Create New Folder') {
    const { newFolder } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newFolder',
        message: 'Enter new folder name:',
        validate: input => input.trim() ? true : 'Folder name cannot be empty.',
      },
    ]);
    const newFolderName = sanitizeTestName(newFolder);
    
    // Ensure the new folder is created under the 'tests' directory
    targetPath = path.join(baseDir, newFolderName);


    
    // Ensure the folder exists
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
  }

  
  return targetPath;
}



function getAllFolders(dir, folders = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {

        folders.push(fullPath);  // Add full path of current folder
        getAllFolders(fullPath, folders);  // Continue for subfolders

    }
  });
  return folders;
}




function validateTestName(input) {
  input = sanitizeTestName(input);
  return /^[a-zA-Z][a-zA-Z0-9_-]{0,49}$/.test(input) || 'Invalid test name format.';
}

function sanitizeTestName(input) {
  return input.trim().replace(/\s+/g, '_').replace(/[<>:"/\\|?*]+/g, '').toLowerCase();
}

async function newTest(testName, testType, hasSections, targetDir) {
  console.log("Generating Test File\n");
  
  let sourceFile = path.join(__dirname, '..', 'assets', 'new_items', hasSections ? 'new_test_with_section.js' : 'new_test.js');
  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }
    const result = data.replace(/TEST_NAME_HERE/g, testName).replace(/TEST_TYPE_HERE/g, testType);
    const destinationFile = path.join(targetDir, `${testName}.js`);
    fs.writeFile(destinationFile, result, 'utf8', err => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      console.log(colors.green(figures.tick + '  ' + `Test file generated.`) + '\n   ' + destinationFile);
    });
  });
}




async function getDirectoriesForHelper(srcPath) {
  const entries = await fs.promises.readdir(srcPath, { withFileTypes: true });
  let dirs = [{ fullPath: srcPath, displayName: '📂 helpers' }];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDirs = await getDirectoriesForHelper(path.join(srcPath, entry.name));
      dirs = dirs.concat(subDirs.map(subDir => ({
        fullPath: subDir.fullPath,
        displayName: `  📂 ${path.relative(srcPath, subDir.fullPath)}`

      })));
    }
  }

  return dirs;
}

async function generateNewHelper() {
  let helperDir = path.join(process.cwd(), 'helpers');

  if (!fs.existsSync(helperDir)) {
    let currentDir = process.cwd();
    let found = false;

    while (currentDir !== path.parse(currentDir).root) {
      currentDir = path.dirname(currentDir);
      const parentHelperDir = path.join(currentDir, 'helpers');

      if (fs.existsSync(parentHelperDir)) {
        helperDir = parentHelperDir;
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(colors.red(figures.cross + '  Error:') + ` The directory "helpers" does not exist in any parent directories.`);
      return;
    }
  }

  // Tüm alt klasörleri al ve "New Directory" seçeneğini ekle
  let directories = await getDirectoriesForHelper(helperDir);
  
  directories.push({ fullPath: 'New Directory', displayName: '➕ New Directory' });
  

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedDir',
      message: 'Select a directory to create the helper in:',
      choices: directories.map(dir => ({ name: dir.displayName, value: dir.fullPath })),
    },
  ]);

  let selectedDir = answers.selectedDir;

  // Kullanıcı "New Directory" seçtiyse, yeni bir klasör adı sor
  if (selectedDir === 'New Directory') {
    const newDirAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'newDirName',
        message: 'Enter the name for the new directory:',
        validate: function (input) {
          input = input.trim().replace(/\s+/g, '_').toLowerCase();
          const isValid = /^[a-zA-Z][a-zA-Z0-9_-]{0,49}$/.test(input);
          if (!isValid) {
            return 'Directory name must start with a letter and can only contain English letters, numbers, underscores, and hyphens, and cannot exceed 50 characters.';
          }
          return true;
        },
        filter: function (input) {
          return input.trim().replace(/\s+/g, '_').toLowerCase();
        },
      },
    ]);

    selectedDir = path.join(helperDir, newDirAnswer.newDirName);
    if (!fs.existsSync(selectedDir)) {
      await fs.promises.mkdir(selectedDir, { recursive: true });
      console.log(colors.green(figures.tick + '  Success:') + ` New directory created: ${selectedDir}`);
    }
  }

  // Helper adı sor
  const helperAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'helperName',
      message: 'Enter Helper Name:',
      validate: function (input) {
        input = input.trim().replace(/\s+/g, '_').toLowerCase();
        const isValid = /^[a-zA-Z][a-zA-Z0-9_-]{0,49}$/.test(input);
        if (!isValid) {
          return 'Helper name must start with a letter and can only contain English letters, numbers, underscores, and hyphens, and cannot exceed 50 characters.';
        }
        return true;
      },
      filter: function (input) {
        return input.trim().replace(/\s+/g, '_').toLowerCase();
      },
    },
  ]);

  const sanitizedHelperName = helperAnswer.helperName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[<>:"/\\|?*]+/g, '');

  const helperFilePath = path.join(selectedDir, `${sanitizedHelperName}.js`);

  if (fs.existsSync(helperFilePath)) {
    console.log(colors.red(figures.cross + '  Error:') + ` Helper file with the name "${sanitizedHelperName}.js" already exists in this directory.`);
    return;
  }
  
  
  

  await newHelper(sanitizedHelperName, helperFilePath, helperDir);
}

let newHelper = async (helperName,helperFilePath,helperMainDir) => {

  console.log("Generating Helper File\n");

  let helperFunctionName = helperName.split('_').map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('');

  let sourceFile =  path.join(path.resolve(__dirname, '..'),'assets','new_items','new_helper.js');



  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const result = data.replace(/HELPER_NAME/g, helperFunctionName);

    fs.writeFile(helperFilePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }


      console.log(colors.green(figures.tick + '  ' + `Helper file generated.`) + '\n   ' + helperFilePath)


      const indexFilePath = path.join(helperMainDir, 'index.js');

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


        let selectedHelperdirName = path.basename(path.dirname(helperFilePath));
        let requirePath = selectedHelperdirName === 'helpers' ? helperName : selectedHelperdirName + '/' +helperName        
  

        if (lastNonEmptyLineIndex !== -1) {
          lines.splice(lastNonEmptyLineIndex + 1, 0, `exports.${helperFunctionName} = require('./${requirePath}').${helperFunctionName}`);
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
  console.log(colors.green(figures.tick + '  ' + `Environment directory generated.`) + '\n   ' + newEnvDir);

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



program
    .arguments('<file> [options]')
    .option('--env <value>',`[Environment] Usage: --env=dev-env1` )
    .option('--config <value>',`[Override Config] Usage: --config=' "parameter1":"value1", "parameter2":["valueX","valueY"], "parameter3":{"parameter4":"valueZ"} '`)
    .option('-t, --take_screenshoot','Take screenshot on every step')
    .option('-s, --sente','Test run on sente cloud ')
    .option('-n, --new','Always open new web gui session')
    .option(' ' )
    .option(' ' , 'User guide     : ' + colors.green('https://sente-1.gitbook.io'))
    .option(' ' , 'Git Repository : ' + colors.green('https://github.com/surerselcuk/sente'))
    .option(' ' , 'Support        : ' + colors.blue('surerselcuk@gmail.com'))

    .action(async file=>{
  
        let filePath = path.join(process.cwd(),file);

        core.startTest({fileName:file, filePath: filePath},program.opts())

    });



program.parse(process.argv);

