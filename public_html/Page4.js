/* Unit for init page 4 - List events
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS


// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(4, 'CRM | Události', 0);
    initPage(page);
    setNextRowsAmount(5);
    
    var row_markup = '<a href="javascript:void(0);" data-icon="arrow-d" onclick="showDetailEvent(this)">'+
                     '@@CONTENT@@'+
                     '</a>';
    
    regCtrl('#header', 3, ['ds:web_udalosti_seznam_json', 'ds_par:&aparameters=apartner:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#cl_udalosti',
            4,
            ['ds:web_udalosti_seznam2_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner')+'&aparameters=aamount:'+getNextRowsAmount(),
             'field_ref_val:ident',
             'row_markup:'+row_markup,
             'row_data_icon:arrow-d',
             'call_for_next_rows:1',
             'nested_fields:pole1;pole2;pole3;pole4;ident;rows_count']);

    initDocs();
});
