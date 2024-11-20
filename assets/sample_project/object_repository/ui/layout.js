

module.exports= {

    
    common: {
        blockUi: `//div[@class='m-page-loader m-page-loader--base m-page-loader--non-block']`,
        no_button: `//*[@id='common_buttons_action_no']`,
        yes_button: `//*[@id='common_buttons_action_yes']`,
        pageNumber_link: `(//p-paginator//span[contains(@class,'XXXX')]//button)[XXXX]`,
        tree_link: `//div[@role='treeitem' and contains(.,'XXXX')]`,


    },

    header: {
        quickSearch_button: `//li[@id='m_quicksearch']`,
        userLogo_link: `//*[@class="m-topbar__userpic"]`,
        logout_button: `//*[@class="btn m-btn--pill btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder"]`,

    },

    bottom:{

    }
    


};





