/* Unit for init page 5 - List tasks
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function initTaskRecord(obj){
    var id_val = $(obj).parent().find('.ident').val();
    nAjax('web_redir', '&aparameters=akod_r:web_ukoly_zaznam_json&aparameters=spouzetelo:1&aparameters=aid:'+id_val, function(data){
        var data_fmt = $.parseJSON(data);
        var termin_splneni = decodeURIComponent(data_fmt.data[0].termin_splneni);
        var osoba = '';
        var predmet = decodeURIComponent(data_fmt.data[0].predmet);
        var poznamka = decodeURIComponent(data_fmt.data[0].text);
        var sab = $(obj).parent().find('.taskDetail');
        sab.find('.taskDate').html(termin_splneni);
        sab.find('.taskSubject').html(predmet);
        sab.find('.taskDescription').html(poznamka);
        sab.find('.taskUsers').html(osoba);
    });
}

function showDetailTask(obj){ 
    if ($(obj).parent().find('.taskDetail').is(':visible')) {
        $(obj).parent()
                  .find('.taskDetail')
                  .slideUp(500, function() { $(this).remove(); });
        $(obj).closest('li').attr('data-icon', 'arrow-d')
                  .find('.ui-icon')
                  .addClass('ui-icon-' + 'arrow-d')
                  .removeClass('ui-icon-' + 'arrow-u');
    }else{
        $(obj).after('<div class="taskDetail nodelete" style="display:none"></div>');
        $('ul').find('.taskDetail').slideUp(500, function() { 
            if( !$(this).hasClass('nodelete') ) { 
                $(this).closest('li').attr('data-icon', 'arrow-d')
                    .find('.ui-icon')
                    .addClass('ui-icon-' + 'arrow-d')
                    .removeClass('ui-icon-' + 'arrow-u');
                $(this).remove(); 
            } 
        });
        
        var tmp = $(obj).parent().find('.taskDetail');
        
        tmp.append($('#newTaskReadOnly').html())
        
        initTaskRecord(obj);
   
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
    page = new Page(5);
    initPage(page);
    
    var row_markup = '<a href="javascript:void(0);" data-icon="arrow-d" onclick="showDetailTask(this)">'+
                     '@@CONTENT@@'+
                     '</a>';    
    
    regCtrl('#header', 3, ['ds:web_ukoly_seznam_json', 'ds_par:&aparameters=apartner:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#cl_ukoly',
            4,
            ['ds:web_ukoly_seznam2_json',
             'ds_par:&aparameters=apartner:'+getParam('apartner'),
             'field_ref_val:ident',
             'row_markup:'+row_markup,
             'row_data_icon:arrow-d',
             'nested_fields:pole1;pole2;ident']);

    initDocs();
});
