/* Unit for init page 3
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS


// INICIALIZACE CONTROLLERU 

$(document).live('pageinit', function(event){
    page = new Page(3);
    initPage(page);
    
    regCtrl('apartner', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:partner', 'field_ref_val:partner']);
    regCtrl('atelefon', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:telefon']);
    regCtrl('aulice', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:ulice']);
    regCtrl('amesto', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:mesto']);
    regCtrl('apsc', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:psc']);
    regCtrl('astat', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:stat', 'disabled:disabled']);
    regCtrl('aemail', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:email', 'save:aemail;partneri_spojeni;cislo_email']);

    initDocs();
});
