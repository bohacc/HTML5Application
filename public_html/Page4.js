/* Unit for init page 4
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS


// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(4);
    initPage(page);
    
    regCtrl('#header', 3, ['ds:web_udalosti_seznam_json', 'ds_par:&aparameters=apartner:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);

    initDocs();
});