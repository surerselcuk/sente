/* TEST DEFINATIONS 
********************************************************************************************/    
test_name = '<senteTestName> MADANANAN asdf asdf asdf asd fa sdfasd </senteTestName>';  /* [Mandatory field] */    
test_type = '<senteTestType> web-gui </senteTestType>'; /* [Mandatory field] | options: [web-gui, backend, performance] */

/* LIBRARIES
********************************************************************************************/
const {sente} = require('#libraries');


/* TEST FLOW
********************************************************************************************/
let test = async () => {

await go('https://v17.angular.io/guide/versions')
await go('https://v17.angular.io/guide')







}



/* TEST RUN */
sente.testFlow({"callback":test, "testDefinations":{"test_name": test_name, "test_type": test_type }, "argv": sente.argv, "buildDriver": helper.buildDriver });


