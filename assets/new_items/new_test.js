/* TEST DEFINATIONS 
********************/    
test_name = '<senteTestName> TEST_NAME_HERE </senteTestName>';  /* [Mandatory field] */    
test_type = '<senteTestType> TEST_TYPE_HERE </senteTestType>';  /* [Mandatory field] | options: [web-gui, backend] */


/* LIBRARIES
*************/
const { sente, helper, repo } = require('#libraries');
const { webdriver, axios, Promise, https } = sente;
const { testFlow, argv, jump, log, now, wait, wait_, translate, importParameter, exportParameter, overrideRepo, myQuery, pgQuery, api } = sente;
const { go, click, rightClick, see, notSee, write, keyboard, scroll, getText } = sente;


/* TEST FLOW
*************/
test = async () => {

    /*
        
        Write your test codes here.


    */









        
}



/* TEST RUN */
testFlow({"testDefinations":{"test_name": test_name, "test_type": test_type }, "argv":  argv });


