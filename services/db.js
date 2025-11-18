

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
 * @param {number} dBConfig.port - The database port number.
 * @param {string} dBConfig.database - The name of the database.
 * @param {string} dBConfig.user - The database user.
 * @param {string} dBConfig.password - The database user's password.
 * @param {number} [dBConfig.connectionLimit=999] - Maximum number of connections in the pool.
 * @param {number} [dBConfig.queueLimit=0] - Maximum number of connection requests the pool will queue.
 * @param {boolean} [dBConfig.multipleStatements=true] - Allow multiple mysql statements per query.
 * @param {number} [dBConfig.connectTimeout=10000] - Connection timeout in milliseconds.
 * @param {boolean} [dBConfig.insecureAuth=true] - Allow connecting to MySQL instances that ask for the old (insecure) authentication method.
 * @returns {Promise<Array>} - A promise that resolves with the query results as an array.
 * @throws {Error} - Throws an error if the query string or connection parameters are missing or invalid.
 * @see {@link https://sidorares.github.io/node-mysql2/docs/examples/connections/create-connection#createconnectionconfig|Options}
 */
db.myQuery =  async (query, dBConfig_ = global.config.dBConfig) => {
  
    /* 
    *  Mysql db query function
    *  Properties:
    *
    *             query: [string] db select, update, insert etc. 
    *
    *             dBConfig_={ 
    *                 host: [string] db host or Ip,
    *                 port: [string] db port number
    *                 database: [string] db name
    *                 user: [string] db port number
    *                 password: [string] db port number
    *               }
    */

    let timeoutForBluebird = senteConfig.defaultTimeout*1000;
    
    return new Promise(async(resolve, reject) => {

        let connection;

        try {
        
                // Properties validation
                if(!dBConfig_ || !query || !core.isObject(dBConfig_)) throw new Error('Query String and Connection parameters required!')
                    if(!dBConfig_.host || !dBConfig_.port || !dBConfig_.database || !dBConfig_.user|| !dBConfig_.password) throw new Error('host, port, database,user and password  required!')
                    
                    // default values
                    if(!dBConfig_.connectionLimit) dBConfig_.connectionLimit = 999;
                    if(!dBConfig_.queueLimit) dBConfig_.queueLimit = 0;
                    if(!dBConfig_.multipleStatements) dBConfig_.multipleStatements = true;
                    if(!dBConfig_.connectTimeout) dBConfig_.connectTimeout= 1000*10;
                    if(!dBConfig_.insecureAuth) dBConfig_.insecureAuth = true
                    dBConfig_.port = Number(dBConfig_.port);

                    timeoutForBluebird = dBConfig_.connectTimeout + 2000;
                                
                    log.uiCommand('EXEC QUERY',query)
            
                    // Connect to db                    
                    try {
                    
                        connection = await mysql.createConnection(dBConfig_)
                                
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


    
    }).timeout(timeoutForBluebird,'[myQuery] [Timeout]');   


}


/**
 * Executes a PostgreSQL query using the provided configuration.
 *
 * @param {string} query - The SQL query to be executed.
 * @param {Object} [dBConfig_=global.config.dBConfig_] - The database configuration object.
 * @param {string} dBConfig_.user - The database user.
 * @param {string} dBConfig_.password - The database user's password.
 * @param {string} dBConfig_.host - The database host or IP address.
 * @param {number} dBConfig_.port - The database port number.
 * @param {string} dBConfig_.database - The name of the database.
 * @param {string} [dBConfig_.connectionString] - Connection string (e.g., postgres://user:password@host:5432/database).
 * @param {any} [dBConfig_.ssl] - SSL configuration, passed directly to node.TLSSocket.
 * @param {any} [dBConfig_.types] - Custom type parsers.
 * @param {number} [dBConfig_.statement_timeout] - Statement timeout in milliseconds.
 * @param {number} [dBConfig_.query_timeout] - Query timeout in milliseconds.
 * @param {number} [dBConfig_.lock_timeout] - Lock timeout in milliseconds.
 * @param {string} [dBConfig_.application_name] - The name of the application that created this Client instance.
 * @param {number} [dBConfig_.connectionTimeoutMillis] - Connection timeout in milliseconds.
 * @param {number} [dBConfig_.idle_in_transaction_session_timeout] - Idle transaction session timeout in milliseconds.
 * @returns {Promise<Object>} - A promise that resolves with the query results.
 * @throws {Error} - Throws an error if the query string or connection parameters are missing or invalid.
 * @see {@link https://node-postgres.com/features/connecting#programmatic|Options}
 */
db.pgQuery =  async (query, dBConfig_ = global.config.dBConfig_) => {
  
    /* 
      Postgre db query function
      Properties:
    
        query: [string] db select, update, insert etc. 

        dBConfig_ = {
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
                if(!dBConfig_ || !query || !core.isObject(dBConfig_)) throw new Error('Query String and Connection parameters required!')
                    if(!dBConfig_.host || !dBConfig_.port || !dBConfig_.database || !dBConfig_.user|| !dBConfig_.password) throw new Error('host, port, database,user and password  required!')
                    
                    // default values
                    if(!dBConfig_.connectionTimeoutMillis) dBConfig_.connectionTimeoutMillis = 1000*10;
                    if(!dBConfig_.query_timeout) dBConfig_.query_timeout = 1000*10;
                    dBConfig_.port = Number(dBConfig_.port);


                    timeoutForBluebird = dBConfig_.query_timeout + 2000;


                                
                    log.uiCommand('EXEC QUERY',query)
                    
            
                    // Connect to db                   
                    try {
                    
                        connection = await new Client(dBConfig_);
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
        


    
    }).timeout(timeoutForBluebird,'[pgQuery] [Timeout]');   


}




module.exports = db;