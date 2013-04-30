/* Unit for init page 2
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function deleteNewTask(obj){
    $(obj).closest('li').remove();
    refreshListview($(obj).closest('div[data-role="collapsible"]'));
}

function postNewTask(){
    nAjax('web_redir', 
          '&aparameters=akod_r:'+
          '&aparameters=spouzetelo:1'+
          '&aparameters=subject:'+$('#taskSubject').val()+
          '&aparameters=description:'+$('#taskDescription').val()+
          '&aparameters=date:'+$('#taskDate').val()+
          '&aparameters=person:'+$('#taskPerson').val(), 
          function(data){
        
    });
}

function tasksNewRecord(obj){
    var tmp = '<li class="newTask">'+
                '<a href="javascript:void(0);">'+
                '<table class="table_data">'+
                    '<tr><td><label for="taskSubject">Předmět:<\/label><input type="text" id="taskSubject" \/><\/td><\/tr>'+
                    '<tr><td><label for="taskDescription">Text:<\/label><textarea cols="40" rows="8" id="taskDescription"><\/textarea><\/td><\/tr>'+
                    '<tr><td><label for="taskDate">Termín splnění:<\/label><input type="date" id="taskDate" \/><\/td><\/tr>'+                    
                    '<tr><td><label for="taskPerson">Osoba:<\/label><select id="taskPerson"><option value="" \/><\/select><\/td><\/tr>'+
                '<\/table>'+
                '<\/a>'+
                '<script type="text\/javascript">$(".newTask").parent().find(".bt_save").bind("click", function(){postNewTask();});<\/script>'+
              '<\/li>';
    $(obj).closest('li').before(tmp).trigger('create');
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
    $(obj).parent().parent().parent().find('.row_data_item').each(function(){
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
    $(obj).parent().parent().parent().find('input[type="text"]').each(function(){
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
    
    regCtrl('#cl_kontakty',
            4,
            ['ds:web_adresar_zaz_pda_json',
             'ds_par:&aparameters=code:'+getParam('apartner'),
             'field_ref_val:ident',
             'listview_footer:setListviewFooterDataInsert',
             'nested_fields:pole1;pole2;pole3;pole4;pole5;pole6;pole7;pole8;pole9;pole10']);    
    
    regCtrl('#header', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:ident_nazev', 'field_ref_val:ident']);
    regCtrl('#anazev_partnera', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:nazev_partnera']);
    regCtrl('#ajmeno', 3, ['ds:web_adresar_zaz2_pda_json', 'ds_par:&aparameters=code:'+getParam('apartner'), 'field:osoba']);

    initDocs();
});
