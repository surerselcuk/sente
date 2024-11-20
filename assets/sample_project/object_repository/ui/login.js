

module.exports= {

    username_input: `//input[@id='forms_login_dataform_username']`,
    password_input: `//input[@id='forms_login_dataform_password']`,
    remember_checkbox: `//*[@id='data_form_field_remember']`,
    rememberChecked: `//*[@id='data_form_field_remember']//div[contains(@class,'checked')]`,
    login_button: `//button[@id='m_login_signin_submit']`,
    edit_button: `//button[@id='common_buttons_action_edit']`,
    languageSelect_button: `//button[@id='language-select']`,
    language_option: {id:`language-option-`},
    captchaRefresh_button: `//button[@id='forms_login_dataform_captcha_text-button-suffix']`,


    
    popup:{
        serverManager:{
            add_button: `//button[@id='popups_manage_servers_popup_common_buttons_action_add']`,
            delete_button: `//button[@id='popups_manage_servers_popup_common_buttons_action_remove']`,
            clearAll_button: `//button[@id='popups_manage_servers_popup_common_buttons_action_clear_all']`,
            defaultServer_link: `//div[@class='ui-helper-clearfix ng-star-inserted']//*[text()='default-server']`,

            serverTag_input: `//*[@id='popups_manage_servers_popup_data_form_dataform_label']`,
            serverUrl_input: `//*[@id='popups_manage_servers_popup_data_form_dataform_base_path']`,
            websocket_input: `//*[@id='popups_manage_servers_popup_data_form_dataform_websocket_path']`,
            update_button: `//button[@id='popups_manage_servers_popup_common_buttons_action_update']`,


        }
    }

};





