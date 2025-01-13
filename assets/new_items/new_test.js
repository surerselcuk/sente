/* TEST DEFINATIONS 
********************************************************************************************/    
test_name = '<senteTestName> TEST_NAME_HERE </senteTestName>';  /* [Mandatory field] */    
test_type = '<senteTestType> TEST_TYPE_HERE </senteTestType>';  /* [Mandatory field] | options: [web-gui, backend, performance] */

/* LIBRARIES
********************************************************************************************/
const { sente, helper, repo, https, Promise } = require('#libraries');
const { testFlow, argv, jump, log, wait, go } = sente;


/* TEST FLOW
********************************************************************************************/
test = async () => {

    /*
        
        Write your test codes here.


    */









        
}



/* TEST RUN */
testFlow({"testDefinations":{"test_name": test_name, "test_type": test_type }, "argv":  argv });


