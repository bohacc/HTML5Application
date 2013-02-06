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
    
    regCtrl('acollapsiblelist',
            2,
            ['ds:web_search_adresar_pda_json',
             'ds_par:&aparameters=code:'+$(obj).val(),
             'row_onclick:saveSearchText(this);',
             'field:partner',
             'field_ref_val:partner',
             'callbackFce:setPageAfterSearchCallback()']);
    initDocs();
};

function saveSearchText(obj){
    var tmp = $(obj).next().val(); 
    nAjax('web_redir',
          '&aparameters=akod_r:web_search_text_save_json&aparameters=spouzetelo:1&aparameters=code:'+tmp,
          function(data){
              $.mobile.changePage('web_redir_backend?ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
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

$(document).live('pageinit', function(event){
  regCtrl('aemail',1,['onkeypress:emailEnter(event, this)']);
  regCtrl('acollapsiblelist',
          2,
          ['ds:web_last_search_json',
           'ds_par:&aparameters=code:PDA_SEARCH',
           'row_onclick:saveSearchText(this)',
           'field_ref_val:partner',
           'field:str']);
  initDocs();
});