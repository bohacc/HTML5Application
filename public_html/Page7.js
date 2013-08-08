/* Unit for init page 7 - Record CRM contacts
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function getPartnerObject(){
    var aident = getParam('apartner');
    var aedit = getParam('aedit');
    var obj = {ident : aident, edit : aedit};
    return obj;
}

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
                 'ds_par:&aparameters=code:'+$('#name').val()+'&aparameters=type:2'+'&aparameters=aamount:'+getNextRowsAmount(),
                 'row_events:["click:selectPartner(this, getPartnerObject())"]',
                 'field:partner_nazev',
                 'field_ref_val:ident2',
                 'call_for_next_rows:1',
                 'nested_fields:ident;rows_count',
                 'callbackFce:searchCompanyCallback()']);            
        initDocs();    
    }else{
        saveNewPartner(getPartnerObject());
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
            saveNewPartner(getPartnerObject());
        }
    }
    search_state.str = $('#name').val();    
}

function searchCompanyKeybord(event, obj){
    if(event.keyCode == '13'){
        searchCompany(obj);
    }
}

function saveNewPartner(obj){
    var tmp = $('#name').val();
    nAjax('web_redir',
          '&aparameters=akod_r:web_eshop_zalozit_uziv_json&aparameters=spouzetelo:1&aparameters=anazev_fak:'+tmp,
          function(data){
              var data_fmt = $.parseJSON(data);
              var partner = decodeURIComponent(data_fmt.partner);
              var state = decodeURIComponent(data_fmt.state);
              var msg = decodeURIComponent(data_fmt.message);
              if(state == "1"){
                  nAjax('web_redir',
                        '&aparameters=akod_r:web_adresar_pda_ident_json&aparameters=spouzetelo:1&aparameters=apartner:'+partner,
                        function(data){
                            var data_fmt = $.parseJSON(data);
                            var ident_new = decodeURIComponent(data_fmt.ident);
                            if(obj.edit.length > 0){
                                modifyPartner(obj, ident_new);
                            }else{
                                goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+ident_new);
                            };
                        });
              }else{
                  alert(msg);
              }
          });    
}

function selectPartner(obj, params){
    //console.log('selectPartner');
    var ident_new = getPartnerFromSearchResult(obj);
    if(params.edit.length > 0){
        modifyPartner(params, ident_new);
    }else{
        openPartner(obj);
    }
}

function modifyPartner(obj, ident_new){
    nAjax('web_redir',
          '&aparameters=akod_r:web_zmenit_partnera_json&aparameters=spouzetelo:1&aparameters=aident:'+obj.ident+'&aparameters=aedit:'+obj.edit+'&aparameters=aident_new:'+ident_new,
          function(data){
              var data_fmt = $.parseJSON(data);
              var state = decodeURIComponent(data_fmt.state);
              var msg = decodeURIComponent(data_fmt.message);
              var ident_after_post = decodeURIComponent(data_fmt.ident);
              if(state == "1"){
                  goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+ident_after_post);
              }else{
                  alert(msg);
              }
          });
}              

function openPartner(obj){
    var tmp = getPartnerFromSearchResult(obj); 
    goToPageWithParams('web_redir_backend', 'ap=akod_r:CRM_KONTAKTY_PDA_PAGE2&ap=apartner:'+tmp);
}

function getPartnerFromSearchResult(obj){
    return $('#ref_id_'+$(obj).attr('id')).val(); 
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(7,'CRM Kontakty | Nová firma',0);
    initPage(page);
    
    setNextRowsAmount(20);
    
    regCtrl('#bt_post', 1, ['on_click:searchCompany()']);
    regCtrl('#name', 1, ['set_onkeypress:searchCompanyKeybord(event, this);searchCompanySetDefault(this)']);

    initDocs();
});
