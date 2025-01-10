/* TEST DEFINATIONS 
********************************************************************************************/    
test_name = '<senteTestName> SAMPLE TEST </senteTestName>';  /* [Mandatory field] */    
test_type = '<senteTestType> web-gui </senteTestType>';  /* [Mandatory field] | options: [web-gui, backend, performance] */

/* LIBRARIES
********************************************************************************************/
const { sente, helper, repo, https, Promise } = require('#libraries');
const { testFlow, argv, log, wait, go } = sente;


/* TEST FLOW
********************************************************************************************/
test = async () => {
   
    await go('https://v17.angular.io/guide')








        
}



/* TEST RUN */
testFlow({"testDefinations":{"test_name": test_name, "test_type": test_type }, "argv":  argv });


