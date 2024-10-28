module.exports = {};

const axios = require('axios');
const { WebDriver } = require('selenium-webdriver');
const _http = require('selenium-webdriver/http');
const log = require('../logger').log;




let killAllSessionsOnGrid = async(gridHost) => {

    log(`Clearing all sessions on grid [${gridHost}]`)

    await clearQueOnGrid(gridHost);
    await wait_();

    return axios({
            method: 'get',
            timeout: 20000,
            url: `${gridHost}/status`
        }, {})
        .then(async(res) => {

            if (res.data.value.nodes[0].slots.length > 0) {
                
                for (let i of res.data.value.nodes[0].slots) {
                    
                    if(i.session !== null) {                        
                        let currentDriverForSession = await getDriver(i.session.sessionId,gridHost);
                        await currentDriverForSession.quit();
                        await wait_(1);
                        log(`Session killed on grid(${gridHost}), sessionId: ${i.session.sessionId}`)
                    } else {
                        log(`No active session on grid (${gridHost})`)
                    }


                }
                return Promise.resolve(true);
            } else return Promise.resolve(true)


        })
        .catch((error) => {
            
            return Promise.resolve(false);

        })


}
let getFirstSessionOnGrid = async(gridHost) => {

    log(`Connect to active web-ui session on [${gridHost}]`)

    return new Promise(async (resolve,reject) => {

        try {

            await axios({
                method: 'get',
                timeout: 20000,
                url: `${gridHost}/status`
            }, {})
            .then(async(res) => {
    
                if (res.data.value.nodes[0].slots.length > 0) {
                    
                    for (let i of res.data.value.nodes[0].slots) {
                        
                        if(i.session !== null) {      
                            let currentDriverForSession = await getDriver(i.session.sessionId,gridHost);
                            resolve(currentDriverForSession)
                        } else {
                            reject(`No active session on grid (${gridHost})`)
                        }
    
    
                    }
                    
                    resolve(true);

                } else reject(`No active session on grid (${gridHost})`)
    
    
            })
            .catch((error) => {
                
                return Promise.reject(error);
    
            })
        }
        catch (e) {

            reject(e);
        }


    })




}
let clearQueOnGrid = async(gridHost) => {

    log(`Cleaning Que on Grid (${gridHost})`)
    return axios({
            method: 'delete',
            timeout: 20000,
            url: `${gridHost}/se/grid/newsessionqueue/queue`,
            headers: {"X-REGISTRATION-SECRET":""}
        }, {})
        .then(async(res) => {

            return Promise.resolve(true);
        })
        .catch((error) => {
            log.error(`Queue clean error on Grid (${gridHost})`)
            log.error(error)
            return Promise.resolve(false);

        })


}
let getDriver = async(sessionId,gridHost) => {

    try {


        let currentDriverForSession = new WebDriver(
            sessionId,
            new _http.Executor(Promise.resolve(gridHost)
                .then(
                    url => new _http.HttpClient(url, null, null))
            )
        );
        

        return Promise.resolve(currentDriverForSession);
    } catch (e) {
        return Promise.reject(e);
    }

};




module.exports.killAllSessionsOnGrid = killAllSessionsOnGrid;
module.exports.getDriver = getDriver;
module.exports.getFirstSessionOnGrid = getFirstSessionOnGrid;




