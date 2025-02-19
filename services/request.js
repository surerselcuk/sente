
const {log, now} = require('./logger');
const core = require('./core');
const colors = require('chalk');
const figures = require('figures');
const axios = require('axios');
const Promise = require('bluebird');
const https = require('https');



/**
 * Makes an HTTP request using Axios with the provided configuration.
 *
 * @param {Object} config - The configuration object for the request.
 * @param {string} config.method - The HTTP method to use for the request (e.g., 'GET', 'POST'). This parameter is required.
 * @param {string} [config.url] - The URL to send the request to.
 * @param {string} [config.baseURL] - The base URL to use for the request.
 * @param {Array|Function} [config.transformRequest] - Allows changes to the request data before it is sent to the server.
 * @param {Array|Function} [config.transformResponse] - Allows changes to the response data to be made before it is passed to then/catch.
 * @param {Object} [config.headers] - The headers to be sent with the request.
 * @param {Object} [config.params] - The URL parameters to be sent with the request.
 * @param {Function} [config.paramsSerializer] - A function to serialize the params.
 * @param {Object} [config.data] - The data to be sent as the request body.
 * @param {number} [config.timeout] - The number of milliseconds before the request times out. Defaults to `senteConfig.defaultTimeout * 1000`.
 * @param {string} [config.timeoutErrorMessage] - The error message to be displayed if the request times out.
 * @param {boolean} [config.withCredentials] - Indicates whether or not cross-site Access-Control requests should be made using credentials.
 * @param {Function} [config.adapter] - Allows custom handling of requests.
 * @param {Object} [config.auth] - HTTP Basic auth credentials.
 * @param {string} [config.responseType] - The type of data that the server will respond with.
 * @param {string} [config.responseEncoding] - The encoding to use for the response.
 * @param {string} [config.xsrfCookieName] - The name of the cookie to use as a value for xsrf token.
 * @param {string} [config.xsrfHeaderName] - The name of the HTTP header that carries the xsrf token value.
 * @param {Function} [config.onUploadProgress] - A function to handle progress events for uploads.
 * @param {Function} [config.onDownloadProgress] - A function to handle progress events for downloads.
 * @param {number} [config.maxContentLength] - The maximum size of the HTTP response content in bytes.
 * @param {Function} [config.validateStatus] - A function to determine if the response status code is valid.
 * @param {number} [config.maxRedirects] - The maximum number of redirects to follow.
 * @param {string} [config.socketPath] - The path to use for UNIX domain sockets.
 * @param {Object} [config.httpAgent] - The agent to use for HTTP requests.
 * @param {Object} [config.httpsAgent] - The agent to use for HTTPS requests. Defaults to a new https.Agent with `rejectUnauthorized` set to false.
 * @param {Object} [config.proxy] - The proxy configuration.
 * @param {Object} [config.cancelToken] - A cancel token to cancel the request.
 * @param {boolean} [config.decompress] - Indicates whether or not the response body should be decompressed.
 * @returns {Promise<Object>} A promise that resolves with the response data or rejects with an error.
 * @throws {Error} If the "method" parameter is not provided.
 * @see {@link  https://www.npmjs.com/package/axios#axios-api|Options}
 */
let api = (properties = {}) => {

    

    // validations
    if(!properties || !core.isObject(properties)) throw new Error('config is required, must json object')
    if (!properties.method) throw new Error('The "method" parameter is required');

    // set defaults
    if (!properties.timeout) properties.timeout = senteConfig.defaultTimeout * 1000;
    if (!properties.httpsAgent) properties.httpsAgent = new https.Agent({ rejectUnauthorized: false, });

    // generate properties For Print
    let propertiesForLog = {};
    if(properties.method) propertiesForLog.method = properties.method
    if(properties.url) propertiesForLog.url = properties.url
    if(properties.baseURL) propertiesForLog.baseURL = properties.baseURL
    if(properties.data) propertiesForLog.data = properties.data
    if(properties.headers) propertiesForLog.headers = properties.headers



    return new Promise((resolve, reject) => {
        
        
        
        log.uiCommand('SEND REQUEST','')
        console.log(propertiesForLog);
        console.log();

        

        axios(properties)
            .then(response => {
                log.uiCommand('RESPONSE','')
                const countKeys = (obj) => {
                    let count = 0;
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            count++;
                            if (typeof obj[key] === 'object' && obj[key] !== null) {
                                count += countKeys(obj[key]);
                            }
                        }
                    }
                    return count;
                };
                
                try {
                    const responseData = JSON.stringify(response.data, null, 5);
                    if (responseData.length > 1500) {
                        console.log(responseData.substring(0, 1500) + '... (more items)');
                    } else {
                        console.log(responseData);
                    }
                } catch (e) {
                    console.log(response.data);
                }
                console.log();

                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    }).timeout(properties.timeout, '[Api] [Timeout]');
};




module.exports = api;