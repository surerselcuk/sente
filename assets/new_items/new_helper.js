/* LIBRARIES
********************************************************************************************/
const repo = require('#object_repository');
const { sente } = require('#libraries');
const { webdriver, axios, Promise, https } = sente;
const { log, now, wait, wait_, translate, importParameter, exportParameter, overrideRepo, myQuery, pgQuery, api } = sente;
const { go, click, rightClick, see, notSee, write, keyboard, scroll, getText } = sente;



/* HELPER FLOW
********************************************************************************************/
module.exports = {

    /**
     * Write Helper Definations.
     * 
     * @async
     * @function changeConfigMap
     * @param {Object} options - function options.
     * @param {Object} options.parameter1 - parameter1 defination.
     * @param {Object} options.parameter2 - parameter2 defination.
     * @throws {Error} Throws an error when there are missing parameters.
     * @returns {Promise<void>} return defination
     */
    HELPER_NAME : async (options={}) => {    

        const {parameter1, parameter2} = options;
        if(!parameter1 || !parameter2 ) throw new Error ('Missing Option Value')
    
        /*
            
            Write your helper codes here.


        */








    }


}
