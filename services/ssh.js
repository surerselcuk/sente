
const { log } = require('./logger');
const core = require('./core');
const Promise = require('bluebird');
const { NodeSSH } = require('node-ssh');

const sshFunctions = {};

/**
 * Creates and connects an SSH connection.
 * @param {Object} sshConfig - SSH connection details.
 * @returns {Promise<NodeSSH>} Connected SSH instance.
 */
const createConnection = async (sshConfig) => {
    const ssh = new NodeSSH();
    await ssh.connect(sshConfig);
    return ssh;
};

/**
 * Validates common properties and sets default timeout.
 * @param {Object} properties
 */
const validateAndSetDefaults = (properties) => {
    if (!properties || !core.isObject(properties)) throw new Error('config is required, must be a json object');
    if (!properties.sshConfig) throw new Error('The "sshConfig" parameter is required');
    if (!properties.timeout) properties.timeout = senteConfig.defaultTimeout;
};

/**
 * Uploads files to a remote server via SSH.
 *
 * @param {Object} properties
 * @param {Object} properties.sshConfig - SSH connection details.
 * @param {Array} properties.files - List of files to upload.
 * @param {string} properties.files[].local - Local file path.
 * @param {string} properties.files[].remote - Remote file path.
 * @param {number} [properties.timeout] - Timeout in seconds. Default: `senteConfig.defaultTimeout`.
 * @returns {Promise<void>}
 */
sshFunctions.uploadFiles = async (properties = {}) => {
    validateAndSetDefaults(properties);

    if (!properties.files || !Array.isArray(properties.files)) {
        throw new Error('The "files" parameter is required and must be an array');
    }

    const { files, sshConfig, timeout } = properties;

    const filesForPrint = files.map((file) => {
        if (!file.local || !file.remote) throw new Error('Each file must have "local" and "remote" properties');
        return file.local;
    }).join(', ');

    log.uiCommand('UPLOAD FILES', `Uploading [${filesForPrint}] to ${sshConfig.host}`);

    return new Promise(async (resolve, reject) => {
        let lastError;

        for (let attempt = 1; attempt <= 3; attempt += 1) {
            let ssh;
            try {

                ssh = await createConnection(sshConfig); 
                await Promise.delay(1000);
                
                await ssh.putFiles(files);
                await Promise.delay(3000);

                for (const file of files) {
                    const verifyResult = await ssh.execCommand(`[ -e "${file.remote}" ] && echo File Validation OK || echo MISSING`, {});
                    if ((verifyResult.stdout || '').trim().indexOf('File Validation OK') === -1) {
                        throw new Error(`Remote file verification failed: ${file.remote}`);
                    }
                }

                
                log.success('Upload Success');
                resolve();
                return;
            } catch (err) {
                if (ssh) ssh.dispose();
                lastError = err;
                log(`[uploadFiles] Attempt ${attempt}/3 failed: ${err.message}`);
                if (attempt === 3) {
                    reject(lastError);
                    return;
                }
                await Promise.delay(5000);
            } finally {
                if (ssh) ssh.dispose();
            }
        }
    }).timeout(timeout * 1000, '[uploadFilesWithSsh] [Timeout]');
};

/**
 * Executes a command on a remote server via SSH.
 *
 * @param {Object} properties
 * @param {Object} properties.sshConfig - SSH connection details.
 * @param {string} properties.command - Command to execute.
 * @param {number} [properties.timeout] - Timeout in seconds. Default: `senteConfig.defaultTimeout`.
 * @returns {Promise<Object>} Resolves with the command result.
 */
sshFunctions.execCommand = async (properties = {}) => {
    validateAndSetDefaults(properties);

    if (!properties.command) throw new Error('The "command" parameter is required');

    const { command, sshConfig, timeout } = properties;

    log.uiCommand('EXECUTES COMMAND via SSH', `${command} , Remote Server: ${sshConfig.host}`);

    return new Promise(async (resolve, reject) => {
        let ssh;
        try {
            ssh = await createConnection(sshConfig);
            const result = await ssh.execCommand(command, {});
            if (result.stderr) throw new Error(result.stderr);
            log(result.stdout);
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (ssh) ssh.dispose();
        }
    }).timeout(timeout * 1000, '[execCommand] [Timeout]');
};

module.exports = sshFunctions;