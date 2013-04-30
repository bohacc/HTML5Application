/* Unit for init page 3
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS


// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(3);
    initPage(page);
    
    regCtrl('#apartner', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:partner', 'field_ref_val:partner']);
    regCtrl('#atelefon', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:telefon', 'save:hodnota;partneri_spojeni;cislo;cislo_tel']);
    regCtrl('#aulice', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:ulice', 'save:ulice;partneri_adresy;cislo;cislo_adresy']);
    regCtrl('#amesto', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:mesto', 'save:mesto;partneri_adresy;cislo;cislo_adresy']);
    regCtrl('#apsc', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:psc', 'save:psc;partneri_adresy;cislo;cislo_adresy']);
    regCtrl('#astat', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:stat', 'disabled:disabled']);
    regCtrl('#aemail', 1, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('aid'), 'field:email', 'save:hodnota;partneri_spojeni;cislo;cislo_email']);

    initDocs();
});
