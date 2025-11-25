/* default parameters:

    # This parameter determines how many times the test run will be re-run if the test case encounters an error. If it is zero, the test will not be re-run in case of an error.
    number_of_test_run_repetitions_on_error : 0

    # download_path, default download directory path
    download_path                   : path.join(senteConfig.testRunProjectPath,'files','downloads')

    # screenshot_directory, default screenshot download directory path for web-gui tests
    screenshot_directory            : path.join(senteConfig.testRunProjectPath,'files','screen_shots')

    # current_language, keyword for translation language
    current_language                : 'en'

    # sente_timeout, [seconds] If the test is not completed within this period, the test will be automatically terminated as failed.
    sente_timeout                   : 60*10

    # browser_type, for web-gui type tests [options: 'firefox, chrome etc.]
    browser_type                    : 'chrome'

    # driver_host: current driver URL 

    # This parameter specifies whether a new driver session should always be started during web-gui tests. 
      If true, a new driver session is always started before the test begins. 
      If false, the existing driver session is used.
      default: false      
    always_new_web_gui_session      : false

    # When the Test Script runs, all test parameters are displayed in a configuration table at the beginning of the test log. 
      If you have parameters that you do not want to appear in this table, specify them as a string in the hidden_config_names parameter, separated by ||.          
      You can refer to the example below:
    hidden_config_names : 'parameter_1 || parameter_2'
    
*/




const path = require('path');


module.exports = {

    /* sente_timeout, [seconds] If the test is not completed within this period, the test will be automatically terminated as failed. */
    sente_timeout                   : 60*10,

    /* browser_type, for web-gui type tests [options: 'firefox, chrome etc. */
    browser_type                    : 'chrome',

    /* driver_host: current driver url */
    driver_host                     : 'http://127.0.0.1:4101',

    /* This parameter specifies whether a new driver session should always be started during web-gui tests. 
       If true, a new driver session is always started before the test begins. 
       If false, the existing driver session is used. */
    always_new_web_gui_session      : true


}