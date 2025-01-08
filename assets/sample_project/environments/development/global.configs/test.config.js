/* default parameters:

        # This parameter determines how many times the test run will be re-run if the test case receives an error. If it is zero, the test will not be re-run in case of an error.
        number_of_test_run_repetitions_on_error : 0

        # download_path, default download directory path
        download_path                   : path.join(process.cwd(),'files','downloads')

        # screenshot_directory, default screenshot download directory path fro web-gui tests
        screenshot_directory            : path.join(process.cwd(),'files','screen_shots')

        # current_language, keyword for translate languge
        current_language                : 'en'

        # sente_timeout, [seconds] If the test is not completed within this period, the test will be automatically terminated as failed.
        sente_timeout                   : 60*10

*/


const path = require('path');


module.exports = {

    /* sente_timeout, [seconds] If the test is not completed within this period, the test will be automatically terminated as failed. */
    sente_timeout                   : 60*10,

    /* browser_type, for web-gui type tests [options: 'firefox, chrome  */
    browser_type                    : 'firefox',

    /* driver_host: current driver url */
    driver_host                     : 'http://127.0.0.1:4101',




}