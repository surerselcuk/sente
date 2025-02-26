

let db={};
const {log, now} = require('./logger');
const core = require('./core');
const mysql = require('mysql2/promise');
const { Client } = require('pg');
const colors = require('chalk');
const figures = require('figures');
const Promise = require('bluebird');

/**
 * Executes a MySQL query using the provided configuration.
 *
 * @param {string} query - The SQL query to be executed.
 * @param {Object} [dBConfig=global.config.dBConfig] - The database configuration object.
 * @param {string} dBConfig.host - The database host or IP address.
 * @param {string} dBConfig.port - The database port number.
 * @param {string} dBConfig.database - The name of the database.
 * @param {string} dBConfig.user - The database user.
 * @param {string} dBConfig.password - The database user's password.
 * @returns {Promise<Object>} - A promise that resolves with the query results.
 * @throws {Error} - Throws an error if the query string or connection parameters are missing or invalid.
 * @see {@link  https://sidorares.github.io/node-mysql2/docs/examples/connections/create-connection#createconnectionconfig|Options}
 */
db.myQuery =  async (query, dBConfig = global.config.dBConfig) => {
  
    /* 
    *  Mysql db query function
    *  Properties:
    *
    *             query: [string] db select, update, insert etc. 
    *
    *             dBConfig={ 
    *                 host: [string] db host or Ip,
    *                 port: [string] db port number
    *                 database: [string] db name
    *                 user: [string] db port number
    *                 password: [string] db port number
    *               }
    */
    
    return new Promise(async(resolve, reject) => {

        let connection;

        try {
        
                // Properties validation
                if(!dBConfig || !query || !core.isObject(dBConfig)) throw new Error('Query String and Connection parameters required!')
                    if(!dBConfig.host || !dBConfig.port || !dBConfig.database || !dBConfig.user|| !dBConfig.password) throw new Error('host, port, database,user and password  required!')
                    
                    // default values
                    if(!dBConfig.connectionLimit) dBConfig.connectionLimit = 999;
                    if(!dBConfig.queueLimit) dBConfig.queueLimit = 0;
                    if(!dBConfig.multipleStatements) dBConfig.multipleStatements = true;
                    if(!dBConfig.connectTimeout) dBConfig.connectTimeout= 1000*10;
                    if(!dBConfig.insecureAuth) dBConfig.insecureAuth = true
                    dBConfig.port = Number(dBConfig.port);
                                
                    log.uiCommand('EXEC QUERY',query)
            
                    // Connect to db                    
                    try {
                    
                        connection = await mysql.createConnection(dBConfig)
                                
                    }
                    catch (e) {
                    
                        log.error('DB CONNECTION FAILED!');
                        try { connection.end(); } catch (e) {}
                        reject(e)
                    
                    }
                    
               
                    
                    // Exec query
                    const [result, fields] = await connection.query(query);
                    try { connection.end(); } catch (e) {}

                    console.log('[' + now() + ']               ' + colors.green.bold(` ${figures.tick}  `) + 'Row Count: ' + colors.green.bold(result.length))

                    resolve(Array.from(result))
                    
                    
                    
        
        }
        catch (e) {
        
            try { connection.end(); } catch (e) {}
            reject(e);
        
        }
        finally {
            try { connection.end(); } catch (e) {}
        }


    
    }).timeout(senteConfig.defaultTimeout*1000,'[myQuery] [Timeout]');   


}


/**
 * Executes a PostgreSQL query using the provided configuration.
 *
 * @param {string} query - The SQL query to be executed.
 * @param {Object} [dBConfig=global.config.dBConfig] - The database configuration object.
 * @param {string} dBConfig.user - The database user.
 * @param {string} dBConfig.password - The database user's password.
 * @param {string} dBConfig.host - The database host or IP address.
 * @param {number} dBConfig.port - The database port number.
 * @param {string} dBConfig.database - The name of the database.
 * @param {string} [dBConfig.connectionString] - Connection string (e.g., postgres://user:password@host:5432/database).
 * @param {any} [dBConfig.ssl] - SSL configuration, passed directly to node.TLSSocket.
 * @param {any} [dBConfig.types] - Custom type parsers.
 * @param {number} [dBConfig.statement_timeout] - Statement timeout in milliseconds.
 * @param {number} [dBConfig.query_timeout] - Query timeout in milliseconds.
 * @param {number} [dBConfig.lock_timeout] - Lock timeout in milliseconds.
 * @param {string} [dBConfig.application_name] - The name of the application that created this Client instance.
 * @param {number} [dBConfig.connectionTimeoutMillis] - Connection timeout in milliseconds.
 * @param {number} [dBConfig.idle_in_transaction_session_timeout] - Idle transaction session timeout in milliseconds.
 * @returns {Promise<Object>} - A promise that resolves with the query results.
 * @throws {Error} - Throws an error if the query string or connection parameters are missing or invalid.
 * @see {@link https://node-postgres.com/features/connecting#programmatic|Options}
 */
db.pgQuery =  async (query, dBConfig = global.config.dBConfig) => {
  
    /* 
      Postgre db query function
      Properties:
    
        query: [string] db select, update, insert etc. 

        dBConfig = {
                user?: string, // default process.env.PGUSER || process.env.USER
                password?: string or function, //default process.env.PGPASSWORD
                host?: string, // default process.env.PGHOST
                port?: number, // default process.env.PGPORT
                database?: string, // default process.env.PGDATABASE || user
                connectionString?: string, // e.g. postgres://user:password@host:5432/database
                ssl?: any, // passed directly to node.TLSSocket, supports all tls.connect options
                types?: any, // custom type parsers
                statement_timeout?: number, // number of milliseconds before a statement in query will time out, default is no timeout
                query_timeout?: number, // number of milliseconds before a query call will timeout, default is no timeout
                lock_timeout?: number, // number of milliseconds a query is allowed to be en lock state before it's cancelled due to lock timeout
                application_name?: string, // The name of the application that created this Client instance
                connectionTimeoutMillis?: number, // number of milliseconds to wait for connection, default is no timeout
                idle_in_transaction_session_timeout?: number // number of milliseconds before terminating any session with an open idle transaction, default is no timeout
            }
    */
    
    return new Promise(async(resolve, reject) => {

        let connection;

        try {
        
                // Properties validation
                if(!dBConfig || !query || !core.isObject(dBConfig)) throw new Error('Query String and Connection parameters required!')
                    if(!dBConfig.host || !dBConfig.port || !dBConfig.database || !dBConfig.user|| !dBConfig.password) throw new Error('host, port, database,user and password  required!')
                    
                    // default values
                    if(!dBConfig.connectionTimeoutMillis) dBConfig.connectionLimit = 1000*10;
                    if(!dBConfig.query_timeout) dBConfig.queueLimit = 1000*10;
                    dBConfig.port = Number(dBConfig.port);

                                
                    log.uiCommand('EXEC QUERY',query)
                    
            
                    // Connect to db                   
                    try {
                    
                        connection = await new Client(dBConfig);
                        await connection.connect();    
                    }
                    catch (e) {
                    
                        log.error('DB CONNECTION FAILED!');
                        try { connection.end() } catch (e) {}
                        reject(e)
                    
                    }
                    
               
                    
                    // Exec query
                    const result = await connection.query(query);
                    try { connection.end() } catch (e) {}

                    console.log('[' + now() + ']               ' + colors.green.bold(` ${figures.tick}  `) + 'Row Count: ' + colors.green.bold(result.rowCount))

                    resolve(Array.from(result.rows))
                    
                    
                    
        
        }
        catch (e) {
            
            try { connection.end() } catch (e) {}
            reject(e);
        
        }
        finally {
            try { connection.end() } catch (e) {}
        }
        


    
    }).timeout(senteConfig.defaultTimeout*1000,'[pgQuery] [Timeout]');   


}




module.exports = db;