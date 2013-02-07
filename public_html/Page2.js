// INICIALIZACE CONTROLLERU 

$(document).live('pageinit', function(event){
    initPage();
    
    regCtrl('cl_telefony',
            2,
            ['ds:web_adresar_zaz_pda_json',
             'ds_par:&aparameters=code:'+getParam('apartner'),
             'field_ref_val:ident',
             'field:telefon1',
             'nested_fields:pole1;pole2;pole3']);    
    
    /*regCtrl('apartner', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:partner']);
    regCtrl('anazev', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:nazev']);
    regCtrl('ajmeno', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:osoba']);
    regCtrl('aadresa1', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:adresa1']);
    regCtrl('aadresa2', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:adresa2']);
    regCtrl('atelefon1', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:telefon1']);
    regCtrl('atelefon2', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:telefon2']);
    regCtrl('amobil', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:mobil']);
    regCtrl('aemail', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:email']);*/
    initDocs();
});
