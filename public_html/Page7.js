/* Unit for init page 7 - Record CRM contacts
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
             'row_events:["set_onclick:openPartner(this)"]',
             'field:partner_nazev',
             'field_ref_val:ident2',
             'callbackFce:searchCompanyCallback()']);
    initDocs();    
}

function searchCompanyCallback(){
    if($('#acollapsiblelist li').length > 0){
        $('#acollapsiblelist').show();
        var html = '<div id="amsg" style="display: none; padding: 2px; background-color: #FAD160;">'+
                   '    <div>Zadaný partner možná existuje</div>'+
                   '    <div>Níže jsou vypsány shody</div>'+
                   '</div>';
        $('#bt_post').before(html);
        $('#amsg').slideDown('slow');
        $('#bt_post').text('přesto uložit').trigger('create');
    }else{
        saveNewPartner();
    }
}

function searchCompanyKeybord(event, obj){
    if(event.keyCode == '13'){
        searchCompany(obj);
    }
}

function saveNewPartner(){
    var tmp = '';
    goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
}

function openPartner(obj){
    var tmp = $('#ref_id_'+$(obj).attr('id')).val(); 
    goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(7,'CRM Kontakty | Nová firma',0);
    initPage(page);
    
    regCtrl('#bt_post', 1, ['on_click:searchCompany(this)']);
    regCtrl('#name', 1, ['set_onkeypress:searchCompanyKeybord(event, this)']);

    initDocs();
});
