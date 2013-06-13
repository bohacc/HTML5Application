/* Unit for init page 1 - Search CRM contacts
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

function anniversaryNextRecord(obj){
    
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
    setNextRowsAmount(50);
    
    regCtrl('#aemail',1,['set_onkeypress:emailEnter(event, this)']);
    
    regCtrl('#adatum', 3, ['ds:web_agenda_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:datum']);
    regCtrl('#acas', 3, ['ds:web_agenda_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:cas']);
    regCtrl('#asvatek', 3, ['ds:web_agenda_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:svatek']);
    
    regCtrl('#cl_crmkontakty', 
            4, 
            ['ds:web_vyroci_pda_json', 
             'ds_par:&aparameters=adni:10&aparameters=code:'+getParam('apartner'), 
             'field_ref_val:ident',
             'listview_footer:setListviewFooterDataInsert',
             'collapsible_id:#avyroci',
             'nested_fields:field_begin;datum;jmeno;udalost;field_end;ident']);
         
    regCtrl('#cl_crmkontakty',
            4,
            ['ds:web_udalosti_seznam3_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner')+'&aparameters=aamount:'+getNextRowsAmount(),
             'field_ref_val:ident',
             'listview_footer:setListviewFooterDataInsert',
             'collapsible_id:#audalosti',
             'nested_fields:pole1;pole2;pole3;pole4;ident']);
         
    regCtrl('#cl_ukoly',
            4,
            ['ds:web_ukoly_seznam3_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner')+'&aparameters=aamount:'+getNextRowsAmount(),
             'field_ref_val:ident',
             'listview_footer:setListviewFooterDataInsert',
             'nested_fields:pole1;pole2;ident']);  
         
    regCtrl('#acollapsiblelist',
            2,
            ['ds:web_last_search_json',
             'ds_par:&aparameters=code:PDA_SEARCH',
             'row_events:["set_onclick:saveSearchText(this)"]',
             'field_ref_val:ident',
             'field:partner_nazev']);         
         
    initDocs();
    
    startTime('#acas');
});