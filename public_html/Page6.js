/* Unit for init page 6 - List 
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function initAnniversaryRecord(obj){
    var id_val = $(obj).parent().find('.ident').val();
    nAjax('web_redir', '&aparameters=akod_r:web_vyroci_zaznam_pda_json&aparameters=spouzetelo:1&aparameters=aid:'+id_val, function(data){
        var data_fmt = $.parseJSON(data);
        var datum = decodeURIComponent(data_fmt.data[0].datum);
        var jmeno = decodeURIComponent(data_fmt.data[0].jmeno);
        var udalost = decodeURIComponent(data_fmt.data[0].udalost);
        var sab = $(obj).parent().find('.anniversaryDetail');
        sab.find('.anniversaryDate').html(datum);
        sab.find('.anniversaryName').html(jmeno);
        sab.find('.anniversaryEvents').html(udalost);
    });
}

function showDetailAnniversary(obj){ 
    if ($(obj).parent().find('.anniversaryDetail').is(':visible')) {
        $(obj).parent()
                  .find('.anniversaryDetail')
                  .slideUp(500, function() { $(this).remove(); });
        $(obj).closest('li').attr('data-icon', 'arrow-d')
                  .find('.ui-icon')
                  .addClass('ui-icon-' + 'arrow-d')
                  .removeClass('ui-icon-' + 'arrow-u');
    }else{
        $(obj).after('<div class="anniversaryDetail nodelete" style="display:none"></div>');
        $('ul').find('.anniversaryDetail').slideUp(500, function() { 
            if( !$(this).hasClass('nodelete') ) { 
                $(this).closest('li').attr('data-icon', 'arrow-d')
                    .find('.ui-icon')
                    .addClass('ui-icon-' + 'arrow-d')
                    .removeClass('ui-icon-' + 'arrow-u');
                $(this).remove(); 
            } 
        });
        
        var tmp = $(obj).parent().find('.anniversaryDetail');
        
        tmp.append($('#newAnniversaryReadOnly').html())
        
        initAnniversaryRecord(obj);
   
        tmp.slideDown(600) // musi byt vetsi cas nez slideUp
           .removeClass('nodelete');
   
        $(obj).closest('li').attr('data-icon', 'arrow-u')
                  .find('.ui-icon')
                  .addClass('ui-icon-' + 'arrow-u')
                  .removeClass('ui-icon-' + 'arrow-d');
    }
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(6, 'CRM | Výročí a svátky', 0);
    initPage(page);
    setNextRowsAmount(5);   
    
    regCtrl('#cl_vyroci',
            4,
            ['ds:web_vyroci_seznam_pda_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner')+'&aparameters=aamount:'+getNextRowsAmount(),
             'field_ref_val:ident',
             'call_for_next_rows:1',
             'nested_fields:datum;jmeno;udalost;anchor_event;ident']);          

    initDocs();
});
