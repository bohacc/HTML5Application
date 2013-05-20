/* Unit for init page 4 - List events
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function initEventRecord(obj){
    var id_val = $(obj).parent().find('.ident').val();
    nAjax('web_redir', '&aparameters=akod_r:web_udalosti_zaznam_json&aparameters=spouzetelo:1&aparameters=aid:'+id_val, function(data){
        var data_fmt = $.parseJSON(data);
        var datum_od = decodeURIComponent(data_fmt.data[0].datum_od);
        var datum_do = decodeURIComponent(data_fmt.data[0].datum_do);
        var predmet = decodeURIComponent(data_fmt.data[0].predmet);
        var poznamka = decodeURIComponent(data_fmt.data[0].poznamka);
        var sab = $(obj).parent().find('.eventDetail');
        sab.find('.eventDate').html();
        sab.find('.eventFrom').html(datum_od);
        sab.find('.eventTo').html(datum_do);
        sab.find('.eventSubject').html(predmet);
        sab.find('.eventDescription').html(poznamka);
        sab.find('.eventUsers').html();
    });
}

function showDetailEvent(obj){ 
    if ($(obj).parent().find('.eventDetail').is(':visible')) {
        $(obj).parent()
                  .find('.eventDetail')
                  .slideUp(500, function() { $(this).remove(); });
        $(obj).attr('data-icon', 'arrow-d')
                  .find('.ui-icon')
                  .addClass('ui-icon-' + 'arrow-d')
                  .removeClass('ui-icon-' + 'arrow-u');
    }else{
        $(obj).after('<div class="eventDetail nodelete" style="display:none"></div>');
        $('ul').find('.eventDetail').slideUp(500, function() { 
            if( !$(this).hasClass('nodelete') ) { 
                $(this).remove(); 
            } 
        });
        
        var tmp = $(obj).parent().find('.eventDetail');
        
        tmp.append($('#newEvent').html())
        
        initEventRecord(obj);
   
        tmp.slideDown(600) // musi byt vetsi cas nez slideUp
           .removeClass('nodelete');
   
        $(obj).attr('data-icon', 'arrow-u')
                  .find('.ui-icon')
                  .addClass('ui-icon-' + 'arrow-u')
                  .removeClass('ui-icon-' + 'arrow-d');
    }
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(4);
    initPage(page);
    
    var row_markup = '<a href="javascript:void(0);" data-icon="arrow-d" onclick="showDetailEvent(this)">'+
                     '@@CONTENT@@'+
                     '</a>';
    
    regCtrl('#header', 3, ['ds:web_udalosti_seznam_json', 'ds_par:&aparameters=apartner:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#cl_udalosti',
            4,
            ['ds:web_udalosti_seznam2_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner'),
             'field_ref_val:ident',
             'row_markup:'+row_markup,
             'nested_fields:pole1;pole2;pole3;pole4;ident']);

    initDocs();
});
