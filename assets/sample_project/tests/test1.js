/* TEST DEFINATIONS 
********************************************************************************************/    
    test_name = '<senteTestName> TALOOOOOdf asdf asdf asdf asd fa sdfasd </senteTestName>';  /* [Mandatory field] */    
    test_type = '<senteTestType> web-gui </senteTestType>'; /* [Mandatory field] | options: [web-gui, backend, performance] */

/* LIBRARIES
********************************************************************************************/
    const {sente} = require('#libraries');
const { wait } = require('senteio/services/logger');


/* TEST FLOW
********************************************************************************************/
let test = async () => {
    
    await go('https://v17.angular.io/guide/versions')
    // await go('https://v17.angular.io/guide')
    // await find(`//*[contains(text(),'Docs')]`)

    // await sente.go2('https://v17.angular.io/guide')
    // let a = await driver.wait(until.elementLocated(By.xpath(`//h1[@id="version-compatibility"]`)), 10000);

    await see(`//*[text()='Version compatibility']`)
    // await click(`//button[@title='Docs menu']`);
    // await doubleClick(`//button[@title='Docs menu']`);
    // await rightClick.id(`//button[@title='Docs menu']`);
    await write(`//input[@type='search']`,['Adana','MADANA'])

    await wait(10)




    

}



/* TEST RUN */
sente.testFlow({"callback":test, "testDefinations":{"test_name": test_name, "test_type": test_type }, "argv": sente.argv, "buildDriver": helper.buildDriver });


