/* Unit for init page 2
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function saveRow(obj, data_type){
    var val = $(obj).val();
    var params = '&aparameters=aid:'+$('.ref_id').get(0).value+
                 '&aparameters=adata_type:'+data_type+
                 '&aparameters=avalue:'+val;
    nAjax('web_mvc_crm_kontakty_ins_json', params, function(){
        
    });
}

// INICIALIZACE CONTROLLERU 

$(document).live('pageinit', function(event){
    page = new Page(2);
    initPage(page);
    
    regCtrl('#cl_kontakty',
            4,
            ['ds:web_adresar_zaz_pda_json',
             'ds_par:&aparameters=code:'+getParam('apartner'),
             'field_ref_val:ident',
             'listview_header:setListviewHeaderDataInsert',
             'nested_fields:pole1;pole2;pole3;pole4;pole5;pole6;pole7;pole8;pole9;pole10']);    
    
    regCtrl('#header', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#anazev_partnera', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:nazev_partnera']);
    regCtrl('#ajmeno', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:osoba']);

    initDocs();
});
