// INICIALIZACE CONTROLLERU 

$(document).live('pageinit', function(event){
  regCtrl('apartner', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:partner']);
  regCtrl('anazev', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:nazev']);
  regCtrl('ajmeno', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:osoba']);
  regCtrl('aadresa1', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:adresa1']);
  regCtrl('aadresa2', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:adresa2']);
  regCtrl('atelefon1', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:telefon1']);
  regCtrl('atelefon2', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:telefon2']);
  regCtrl('amobil', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:mobil']);
  regCtrl('aemail', 3, ['ds:web_adresar_zaz_pda_json', 'ds_par:&aparameters=code:'+getParQS('apartner'), 'field:email']);
  initDocs();aa
});
