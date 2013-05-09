/* Unit for init page 1
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNKCE PRO FORMULAR -------

function setPageAfterSearch(){
    $('#acollapsiblelist').hide();
    $('#acollapsiblelist').empty();
};

function setPageAfterSearchCallback(){
    $('#acollapsiblelist').show();
}

function printResult(obj){
    // INICIALIZACE CONTROLLERU
    
    regCtrl('#acollapsiblelist',
            2,
            ['ds:web_search_adresar_pda_json',
             'ds_par:&aparameters=code:'+$(obj).val(),
             'row_events:["set_onclick:saveSearchText(this)"]',
             'field:partner_nazev',
             'field_ref_val:ident2',
             'callbackFce:setPageAfterSearchCallback()']);
    initDocs();
};

function saveSearchText(obj){
    var tmp = $('#ref_id_'+$(obj).attr('id')).val(); 
    nAjax('web_redir',
          '&aparameters=akod_r:web_search_text_save_json&aparameters=spouzetelo:1&aparameters=code:'+tmp,
          function(data){
              goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
          });
}

function emailEnter(event, obj){
    if(event.keyCode == '13'){
        if($(obj).val().length < 3){
            alert("Zadejte minimálně 3 znaky");
        }else{
            clearCallsStack();
            setPageAfterSearch();
            printResult(obj);    
        }
    }
}



// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(1);
    initPage(page);
    regCtrl('#aemail',1,['set_onkeypress:emailEnter(event, this)']);
    regCtrl('#acollapsiblelist',
            2,
            ['ds:web_last_search_json',
             'ds_par:&aparameters=code:PDA_SEARCH',
             'row_events:["set_onclick:saveSearchText(this)"]',
             'field_ref_val:ident',
             'field:partner_nazev']);
    initDocs();
});