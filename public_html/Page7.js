/* Unit for init page 7 - Record CRM contacts
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function searchCompany(o){
    var obj = $('#name');
    if($(obj).val().length < 3){
        alert('Zadejte min. 3 znaky.');
        $('#name').focus();
        return false;
    }
    if(search_state.isChange($('#name').val())){
        searchCompanySetDefault(obj);
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
    }else{
        saveNewPartner();
    }
}

function searchCompanySetDefault(obj){
    $('#amsg').hide();
    $('#acollapsiblelist').hide();
    $('#acollapsiblelist').empty();
    $('#bt_post .ui-btn-text').text('uložit').trigger('create');
}

function searchCompanyCallback(){
    if(search_state.isChange($('#name').val())){
        if($('#acollapsiblelist li').length > 0){
            $('#acollapsiblelist').show();
            var html = '<div id="amsg" style="display: none; padding: 2px; text-align: center;">'+
                       '    <div>Firma s podobným jménem je již evidována.</div>'+
                       '    <div>Projděte seznam nalezených shod.</div>'+
                       '</div>';
            $('#bt_post').before(html);
            $('#amsg').slideDown('slow');
            $('#bt_post .ui-btn-text').html('Přesto zapsat novou firmu <br>'+$('#name').val()).trigger('create');
        }else{
            saveNewPartner();
        }
    }
    search_state.str = $('#name').val();    
}

function searchCompanyKeybord(event, obj){
    if(event.keyCode == '13'){
        searchCompany(obj);
    }
}

function saveNewPartner(){
    var tmp = $('#name').val();
    nAjax('web_redir',
          '&aparameters=akod_r:web__json&aparameters=spouzetelo:1&aparameters=code:'+tmp,
          function(data){
              var data_fmt = $.parseJSON(data);
              var partner = decodeURIComponent(data_fmt.partner);
              var state = decodeURIComponent(data_fmt.state);
              var msg = decodeURIComponent(data_fmt.message);
              if(state == "1"){
                  goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+partner);
              }else{
                  alert(msg);
              }
          });    
}

function openPartner(obj){
    var tmp = $('#ref_id_'+$(obj).attr('id')).val(); 
    goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(7,'CRM Kontakty | Nová firma',0);
    initPage(page);
    
    regCtrl('#bt_post', 1, ['on_click:searchCompany()']);
    regCtrl('#name', 1, ['set_onkeypress:searchCompanyKeybord(event, this);searchCompanySetDefault(this)']);

    initDocs();
});
