/*TEST DEFINATIONS 
*******************/    
test_name = '<senteTestName> SAMPLE TEST 1 </senteTestName>';  /* [Mandatory field] */    
test_type = '<senteTestType> backend </senteTestType>';  /* [Mandatory field] | options: [web-gui, backend, performance] */


/* LIBRARIES
*************/
const { sente, helper, repo } = require('#libraries');
const { webdriver, axios, Promise, https, NodeSSH, random } = sente;
const { testFlow, argv, jump, log, now, wait, wait_, translate, importParameter, exportParameter, overrideRepo, myQuery, pgQuery, api, ssh  } = sente;
const { go, click, rightClick, doubleClick, see, notSee, write, keyboard, scroll, getText } = sente;


/* TEST FLOW
*************/
test = async () => {
   
    log('Hello World');








        
}



/* TEST RUN */
testFlow({"testDefinations":{"test_name": test_name, "test_type": test_type }, "argv":  argv });


