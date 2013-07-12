/* Unit for init page 8 - Record CRM contacts
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function searchCompany(obj){
    clearCallsStack();
    setPageAfterSearch('#acollapsiblelist');
    // INICIALIZACE CONTROLLERU
    regCtrl('#acollapsiblelist',
            2,
            ['ds:web_search_adresar_pda_json',
             'ds_par:&aparameters=code:'+$('#name').val(),
             'row_events:["set_onclick:openPerson(this)"]',
             'field:partner_nazev',
             'field_ref_val:ident2',
             'callbackFce:$("#acollapsiblelist").show()']);
    initDocs();    
}

function openPerson(obj){
    var tmp = $('#ref_id_'+$(obj).attr('id')).val(); 
    goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(8,'CRM Kontakty | Nová osoba',0);
    initPage(page);
    
    regCtrl('#bt_post', 1, ['on_click:searchCompany(this)']);

    initDocs();
});
