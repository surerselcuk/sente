/* TEST DEFINATIONS 
********************************************************************************************/    
    test_name = '<senteTestName> TALOOOOOdf asdf asdf asdf asd fa sdfasd </senteTestName>';  /* [Mandatory field] */    
    test_type = '<senteTestType> backend </senteTestType>'; /* [Mandatory field] | options: [web-gui, backend, performance] */

/* LIBRARIES
********************************************************************************************/
const {sente} = require('#libraries');




/* TEST FLOW
********************************************************************************************/
section['Birinci Bölüm | rerun:4, failOptions: continueAndFailed'] = async () => {
    /* SECTION RULE DEFINATION
    *****************************
    *  Usage: "SECTION NAME" |  "RULE ON ERROR"

        [RULE ON EROR] properties: reRun , jump , failOptions

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
                            usage:                  jump: sectionNname
                            example:                section[' first section name | jump: second section name '] 

        Example:            section[' first section name | reRun:2 , jump: secondSectionName , failOptions: exitAndFailed '] 
    *****************************************************************************************************************************************/
    

    
    await wait(3)
    throw new Error('Aloooo')

}

section['İkinci Bölüm'] = async () => {

    await wait(3)
    throw new Error('88888 BEBEBE')

}

section['Üçüncü Bölüm | rerun:2,' ] = async () => {

    await wait(3)
}

section['dördüncü Bölüm'] = async () => {

    await wait(3)
}

section['beşinci Bölüm | jump:İkinci Bölüm'] = async () => {

    await wait(3)
}




/* TEST RUN */
sente.testFlow({"testDefinations":{"test_name": test_name, "test_type": test_type }, "argv": sente.argv, "buildDriver": helper.buildDriver });


