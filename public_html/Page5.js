/* Unit for init page 5 - List tasks
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS


// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(5);
    initPage(page);
    
    regCtrl('#header', 3, ['ds:web_ukoly_seznam_json', 'ds_par:&aparameters=apartner:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#cl_ukoly',
            4,
            ['ds:web_ukoly_seznam_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner'),
             'field_ref_val:ident',
             'nested_fields:pole1;pole2']);

    initDocs();
});
