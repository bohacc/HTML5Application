/* Unit for init page 5 - List tasks
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS


// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(5, 'CRM | Úkoly', 0);
    initPage(page);
    setNextRowsAmount(5);
    
    var row_markup = '<a href="javascript:void(0);" data-icon="arrow-d" onclick="showDetailTask(this)">'+
                     '@@CONTENT@@'+
                     '</a>';    
    
    regCtrl('#header', 3, ['ds:web_ukoly_seznam_json', 'ds_par:&aparameters=apartner:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#cl_ukoly',
            4,
            ['ds:web_ukoly_seznam2_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner')+'&aparameters=aamount:'+getNextRowsAmount(),
             'field_ref_val:ident',
             'row_markup:'+row_markup,
             'row_data_icon:arrow-d',
             'call_for_next_rows:1',
             'nested_fields:pole1;pole2;ident']);

    initDocs();
});
