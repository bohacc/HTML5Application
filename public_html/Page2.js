/* Unit for init page 2 - Sumary CRM contacts
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function initTaskRecord(obj){
    var id_val = $(obj).parent().find('.ident').val();
    nAjax('web_redir', '&aparameters=akod_r:web_ukoly_zaznam_json&aparameters=spouzetelo:1&aparameters=aid:'+id_val, function(data){
        var data_fmt = $.parseJSON(data);
        var termin_splneni = decodeURIComponent(data_fmt.data[0].termin_splneni);
        var osoba = decodeURIComponent(data_fmt.data[0].osoba_resitel);
        var predmet = decodeURIComponent(data_fmt.data[0].predmet);
        var poznamka = decodeURIComponent(data_fmt.data[0].text);
        var sab = $(obj).parent().find('.taskDetail');
        sab.find('.taskDate').html(termin_splneni);
        sab.find('.taskSubject').html(predmet);
        sab.find('.taskDescription').html(poznamka);
        sab.find('.taskPerson').html(osoba);
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
        $(obj).closest('li').attr('data-icon', 'arrow-d')
                  .find('.ui-icon')
                  .addClass('ui-icon-' + 'arrow-d')
                  .removeClass('ui-icon-' + 'arrow-u');
    }else{
        $(obj).after('<div class="eventDetail nodelete" style="display:none"></div>');
        $('ul').find('.eventDetail').slideUp(500, function() { 
            if( !$(this).hasClass('nodelete') ) { 
                $(this).closest('li').attr('data-icon', 'arrow-d')
                    .find('.ui-icon')
                    .addClass('ui-icon-' + 'arrow-d')
                    .removeClass('ui-icon-' + 'arrow-u');                
                $(this).remove(); 
            } 
        });
        
        var tmp = $(obj).parent().find('.eventDetail');
        
        tmp.append($('#newEventReadOnly').html())
        
        initEventRecord(obj);
   
        tmp.slideDown(600) // musi byt vetsi cas nez slideUp
           .removeClass('nodelete');
   
        $(obj).closest('li').attr('data-icon', 'arrow-u')
                  .find('.ui-icon')
                  .addClass('ui-icon-' + 'arrow-u')
                  .removeClass('ui-icon-' + 'arrow-d');
    }
}

function deleteNewTask(obj){
    $(obj).closest('li').remove();
    refreshListview($(obj).closest('div[data-role="collapsible"]'));
}

function saveRow(obj, data_type){
    var val = $(obj).val();
    var params = '&aparameters=aid:'+$('.ref_id').get(0).value+
                 '&aparameters=adata_type:'+data_type+
                 '&aparameters=avalue:'+val;
    nAjax('web_mvc_crm_kontakty_ins_json', params, function(){
        
    });
}

function editItemRows(obj){
    $(obj).closest('table').parent().parent().parent().find('.row_data_item').each(function(){
        $(this).find('.data_value').hide();
        
        // pro jistotu, kdyby tam neco zustalo
        $(this).find('input[type="text"]').remove();
        
        var input_text = '<input type="text" name="ap" value="' + $(this).find('.data_value').text()+'" onkeypress="onInputChange(this)" />';
        var delete_icon = '<a href="#" class="inputDelete" onclick="$(this).parent().find(\'input[type=text]\').val(\'\')"><img src="web_get_img_data?aparameters=akod_obrazku:'+getImg(2)+'" alt="smazat" /></a>';
        $(this).append(input_text).trigger('create');
        $(this).parent().parent().find('.td_delete').html(delete_icon).trigger('create');
    });
}

function getParamsItemRows(obj){
    var str = "";
    var field = "";
    $(obj).closest('table').parent().parent().parent().find('input[type="text"]').each(function(){
        field = $(this).parent().find('input[type="hidden"]').val();
        if(field.length > 0){
            str += "&aparameters=" + field + ":" + $(this).val();
        }
    });
    str += '&aparameters=aid:'+$('.ref_id').val();
    return str;
}

function saveItemRows(obj){
    var fix_params = "&aparameters=akod_r:web_adresar_pda_ins_json&aparameters=spouzetelo:1";
    nAjax('web_redir', fix_params+getParamsItemRows(obj), function(data){
        try{            
            var data_fmt = $.parseJSON(data);
            var errors = parseInt(decodeURIComponent(data_fmt.errors));
            if(errors === 0){

            }else{
                alert('Při ukládání došlo k chybě');
            }
        }catch(e){
                alert('Při ukládání došlo k chybě');            
        }            
    });    
}

// INICIALIZACE CONTROLLERU 

$(document).bind('pageinit', function(event){
    page = new Page(2);
    initPage(page);
    
    var row_markup = '<a href="javascript:void(0);" onclick="@@CALL@@(this)">'+
                     '@@CONTENT@@'+
                     '</a>';    
    
    regCtrl('#cl_kontakty',
            4,
            ['ds:web_adresar_zaz_pda_json',
             'ds_par:&aparameters=code:'+getParam('apartner'),
             'field_ref_val:ident',
             'listview_footer:setListviewFooterDataInsert',
             'row_markup:'+row_markup,
             'row_markup_for_item:5,6',
             'row_markup_for_item_call:showDetailEvent,showDetailTask',
             'row_data_icon:arrow-d',
             'nested_fields:pole1;pole2;pole3;pole4;pole5;pole6;pole7;pole8;pole9;pole10;ident']);    
    
    regCtrl('#header', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#anazev_partnera', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:nazev_partnera']);
    regCtrl('#ajmeno', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:osoba']);

    initDocs();
});
