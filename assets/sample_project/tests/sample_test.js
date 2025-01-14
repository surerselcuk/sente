/*TEST DEFINATIONS 
*******************/    
test_name = '<senteTestName> SAMPLE TEST 1 </senteTestName>';  /* [Mandatory field] */    
test_type = '<senteTestType> web-gui </senteTestType>';  /* [Mandatory field] | options: [web-gui, backend, performance] */


/* LIBRARIES
*************/
const { sente, helper, repo } = require('#libraries');
const { webdriver, axios, Promise, https } = sente;
const { testFlow, argv, jump, log, now, wait, wait_, translate, random, importParameter, exportParameter, overrideRepo, myQuery, pgQuery, api } = sente;
const { go, click, rightClick, see, notSee, write, keyboard } = sente;


/* TEST FLOW
*************/
test = async () => {
   
    await go('https://v17.angular.io/guide')








        
}



/* TEST RUN */
testFlow({"testDefinations":{"test_name": test_name, "test_type": test_type }, "argv":  argv });


