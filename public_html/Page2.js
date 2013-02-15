// INICIALIZACE CONTROLLERU 

$(document).live('pageinit', function(event){
    page = new Page(2);
    initPage(page);
    
    regCtrl('cl_kontakty',
            4,
            ['ds:web_adresar_zaz_pda_json',
             'ds_par:&aparameters=code:'+getParam('apartner'),
             'field_ref_val:ident',
             'field:telefon1',
             'nested_fields:pole1;pole2;pole3']);    
    
    regCtrl('apartner', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:partner']);
    regCtrl('anazev_partnera', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:nazev_partnera']);
    regCtrl('ajmeno', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:osoba']);

    initDocs();
});
