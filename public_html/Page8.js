/* Unit for init page 8 - Record CRM contacts
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function verifyPerson(){
    var res = true;
    var obj = $('#first-name');
    if($(obj).val().length < 1){
        alert('Zadejte jméno.');
        $('#first-name').focus();
        res = false;
    }    
    obj = $('#last-name');
    if($(obj).val().length < 1 && res){
        alert('Zadejte příjmení.');
        $('#last-name').focus();
        res = false;
    }
    if($(obj).val().length < 3 && res){
        alert('Zadejte min. 3 znaky.');
        $('#last-name').focus();
        res = false;
    }
    return res;
}
function searchPerson(o){
    if(!verifyPerson()){
        return false;
    }
    if(search_state.isChange($('#last-name').val())){
        searchPersonSetDefault(null);
        clearCallsStack();
        setPageAfterSearch('#acollapsiblelist');
        // INICIALIZACE CONTROLLERU
        regCtrl('#acollapsiblelist',
                2,
                ['ds:web_search_adresar_pda_json',
                 'ds_par:&aparameters=code:'+$('#last-name').val()+'&aparameters=type:3'+'&aparameters=aamount:'+getNextRowsAmount(),
                 'row_events:["set_onclick:openPerson(this)"]',
                 'field:partner_nazev',
                 'field_ref_val:ident2',
                 'call_for_next_rows:1',
                 'nested_fields:ident;rows_count',
                 'callbackFce:searchPersonCallback()']);
        initDocs();    
    }else{
        saveNewPerson();
    }
}

function searchPersonSetDefault(obj){
    $('#amsg').hide();
    $('#acollapsiblelist').hide();
    $('#acollapsiblelist').empty();
    $('#bt_post .ui-btn-text').text('uložit').trigger('create');
}

function searchPersonCallback(){
    if(search_state.isChange($('#last-name').val())){
        if($('#acollapsiblelist li').length > 0){
            $('#acollapsiblelist').show();
            var html = '<div id="amsg" style="display: none; padding: 2px; text-align: center;">'+
                       '    <div>Osoba s podobným jménem je již evidována.</div>'+
                       '    <div>Projděte seznam nalezených shod.</div>'+
                       '</div>';
            $('#bt_post').before(html);
            $('#amsg').slideDown('slow');
            var name = $('#first-name').val() + ' ' + $('#last-name').val();
            $('#bt_post .ui-btn-text').html('Přesto zapsat novou osobu <br>'+name).trigger('create');
        }else{
            saveNewPerson();
        }
    }
    search_state.str = $('#last-name').val();    
}

function searchPersonKeybord(event, obj){
    if(event.keyCode == '13'){
        searchPerson(obj);
    }
}

function openPerson(obj){
    var tmp = $('#ref_id_'+$(obj).attr('id')).val(); 
    goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
}

function saveNewPerson(obj){
    var first_name = $('#first-name').val();
    var last_name = $('#last-name').val();
    var partner = getPartner();
    nAjax('web_redir',
          '&aparameters=akod_r:web_zalozit_osobu_json&aparameters=spouzetelo:1&aparameters=first_name:'+first_name+'&aparameters=last_name:'+last_name+'&aparameters=apartner:'+partner,
          function(data){
              var data_fmt = $.parseJSON(data);
              var partner = decodeURIComponent(data_fmt.ident);
              var state = decodeURIComponent(data_fmt.state);
              var msg = decodeURIComponent(data_fmt.message);
              if(state == "1"){
                  goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+partner);
              }else{
                  alert(msg);
              }
          });    
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(8,'CRM Kontakty | Nová osoba',0);
    initPage(page);
    
    setNextRowsAmount(20);
    
    regCtrl('#bt_post', 1, ['on_click:searchPerson(this)']);
    regCtrl('#last-name', 1, ['set_onkeypress:searchPersonKeybord(event, this);searchPersonSetDefault(this)']);
    regCtrl('#first-name', 1, ['set_onkeypress:searchPersonSetDefault(this)']);
    

    initDocs();
});
