/* SECTION RULE DEFINATION
***************************
Usage: "SECTION NAME" |  "RULE ON ERROR"

[RULE ON ERROR] properties: reRun , jump , failOptions

    [reRun]         description:            If this section fails, it will retry the run $(runCount) times,
                    usage:                  reRun: runCount
                    example:                section[' first section name | reRun:2 ']                                         
                    default:                0
                    max:                    3

    [failOptions]   description:            If this section fails, it determines the actions to be taken.
                    options:                [ exitAndFailed , continueAndNoFailed, continueAndFailed] 
                    option description:     exitAndFailed: If the section fails, test will terminate and fail. 
                                            continueAndNoFailed: If the section fails, continue and run the next sections. 
                                            continueAndFailed: If the section fails, continue, run the next sections and fail the test at the end
                    default:                exitAndFailed
                    usage:                  failOptions: exitAndFailed
                    example:                section[' first section name | failOptions: exitAndFailed ']
    
    [jump]          description:            If this section fails, Jump to section [section name] and run
                                            Important: Jump does not work in the last section
                    usage:                  jump: sectionNname
                    example:                section[' first section name | jump: second section name ']                             

Example:            section[' first section name | reRun:2 , jump: secondSectionName , failOptions: exitAndFailed ']  


TEST DEFINATIONS 
*****************/    
test_name = '<senteTestName> SAMPLE TEST 3 </senteTestName>';  /* [Mandatory field] */    
test_type = '<senteTestType> backend </senteTestType>';  /* [Mandatory field] | options: [web-gui, backend, performance] */


/* LIBRARIES
*************/
const { sente, helper, repo } = require('#libraries');
const { webdriver, axios, Promise, https, NodeSSH, random, moment, dragAndDrop } = sente;
const { testFlow, argv, jump, log, now, wait, wait_, translate, importParameter, exportParameter, overrideRepo, myQuery, pgQuery, api, ssh,getDownloadFiles } = sente;
const { go, click, rightClick, doubleClick, see, notSee, write, keyboard, scroll, getText } = sente;


/* TEST FLOW
*************/

section['First Section Name | rerun:2 , jump: Third Section Name , failOptions:continueAndFailed'] = async () => {

    log('this is firt section')
    await wait(3)

    throw new Error('I am a dirty bug')


}

section['Second Section Name' ] = async () => {

    log('this is second section')
    await wait(3)
    
    jump('Fourth Section Name')


}

section['Third Section Name'] = async () => {

    log('this is third section')
    await wait(3)

    jump('Second Section Name')

}

section['Fourth Section Name'] = async () => {

    log('this is fourth section')

}





/* TEST RUN */
testFlow({"testDefinations":{"test_name": test_name, "test_type": test_type }, "argv":  argv });


