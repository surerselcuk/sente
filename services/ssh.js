
const {log, now} = require('./logger');
const core = require('./core');
const colors = require('chalk');
const figures = require('figures');
const Promise = require('bluebird');
const { NodeSSH } = require('node-ssh');


let sshFunctions = {};


/**
 * Uploads files to a remote server via SSH.
 * 
 * This function establishes an SSH connection using the provided `sshConfig` 
 * and uploads the specified files to the remote server. 
 * If any file in the `files` list is missing the `local` or `remote` parameter, an error is thrown.
 * 
 * @param {Object} properties - The required parameters for the function.
 * @param {Object} properties.sshConfig - SSH connection details.
 * @param {Array} properties.files - List of files to be uploaded.
 * @param {string} properties.files[].local - Local file path.
 * @param {string} properties.files[].remote - Remote file path on the server.
 * @param {number} [properties.timeout] - Maximum allowed execution time (in seconds). Default: `senteConfig.defaultTimeout`.
 * 
 * @returns {Promise<void>} Resolves when the file upload is successful, rejects if an error occurs.
 * 
 * @throws {Error} Throws an error if `sshConfig`, `files`, or `files[].local`, `files[].remote` are missing.
 */
sshFunctions.uploadFiles = async (properties = {}) => {

    

    // validations
    if(!properties || !core.isObject(properties)) throw new Error('config is required, must json object')
    if (!properties.sshConfig) throw new Error('The "sshConfig" parameter is required');
    if (!properties.files || !Array.isArray(properties.files)) throw new Error('The "files" parameter is required and must be an array');

    const { files , sshConfig } = properties;

    let filesForPrint ='';

    for ( let file of files ) {
        if (!file.local || !file.remote) throw new Error('The "files.local" and "files.remote" parameter is required');
        filesForPrint += `${file.local}, `
    }


    // set defaults
    if (!properties.timeout) properties.timeout = senteConfig.defaultTimeout;    


    return new Promise(async (resolve, reject) => {
                
        
        log.uiCommand('UPLOAD FILES',`Uploading [${filesForPrint}] to ${sshConfig.host}`)        

        let sshConnection = new NodeSSH();
        await sshConnection.connect(sshConfig)
            .then( async ()=> {

                await sshConnection.putFiles(files)
                    .then(function() {
                        log.success("Upload Success")
                        resolve();
                    }, function(error) {
                            throw new Error (error)
                    })
                    .catch(err => { 
                        sshConnection.dispose(); 
                        reject (err);
                    });                
                    
            })
            .then(_ => { 
                sshConnection.dispose(); 
            })
            .catch(err => {
                sshConnection.dispose();
                reject(err);
            });

    }).timeout(properties.timeout * 1000, '[uploadFilesWithSsh] [Timeout]');
};


/**
 * Executes a command on a remote server via SSH.
 * 
 * This function establishes an SSH connection using the provided `sshConfig` 
 * and executes the specified command on the remote server. 
 * If the command produces an error in `stderr`, it throws an error.
 * 
 * @param {Object} properties - The required parameters for the function.
 * @param {Object} properties.sshConfig - SSH connection details.
 * @param {string} properties.command - The command to be executed on the remote server.
 * @param {number} [properties.timeout] - Maximum allowed execution time (in seconds). Default: `senteConfig.defaultTimeout`.
 * 
 * @returns {Promise<void>} Resolves when the command execution is successful, rejects if an error occurs.
 * 
 * @throws {Error} Throws an error if `sshConfig` or `command` is missing, or if the command execution returns an error.
 */

sshFunctions.execCommand = async (properties = {}) => {

    

    // validations
    if(!properties || !core.isObject(properties)) throw new Error('config is required, must json object')
    if (!properties.sshConfig) throw new Error('The "sshConfig" parameter is required');
    if (!properties.command) throw new Error('The "command" parameter is required');

    const { command , sshConfig } = properties;


    // set defaults
    if (!properties.timeout) properties.timeout = senteConfig.defaultTimeout;    


    return new Promise(async (resolve, reject) => {
                
        
        log.uiCommand('EXECUTES COMMAND via SSH',`${command} , Remote Server: ${sshConfig.host}`)        

        let sshConnection = new NodeSSH();
        await sshConnection.connect(sshConfig)
            .then( async ()=> {

                await sshConnection.execCommand(command, {}).then(function(result) {
                    log(result.stdout)
                    resolve();
                    if (result.stderr) throw new Error(result.stderr)
                });

                    
            })
            .then(_ => { 
                sshConnection.dispose(); 
            })
            .catch(err => {
                sshConnection.dispose();
                reject(err);
            });

    }).timeout(properties.timeout * 1000, '[uploadFilesWithSsh] [Timeout]');
};




module.exports = sshFunctions;