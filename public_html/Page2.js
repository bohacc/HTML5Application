/* Unit for init page 2
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
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
        $(this).find('div').hide();
        
        // pro jistotu, kdyby tam neco zustalo
        $(this).find('input[type="text"]').remove();
        
        var input_text = '<input type="text" name="ap" value="' + $(this).find('div').html()+'" onkeypress="onInputChange(this)" />'+
                         '<a href="#" class="inputDelete" onclick="$(this).parent().find(\'input[type=text]\').val(\'\')"><img src="web_get_img_data?aparameters=akod_obrazku:'+getImg(1)+'" alt="smazat" /></a>';
        $(this).append(input_text).trigger('create');
        //$(this).find('input[type="text"]').trigger('create');
        //refreshListview($(obj).closest('ul').attr('id'));
        //$(obj).closest('ul').listview('refresh');
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
                $(obj).parent().parent().parent().find('.row_data_item').find('div').show();
                $(obj).parent().parent().parent().find('.row_data_item').find('input[type="text"]').remove();
            }
            
        }catch(e){
            alert('Při ukládání došlo k chybě');
            $(obj).parent().parent().parent().find('.row_data_item').find('div').show();
            $(obj).parent().parent().parent().find('.row_data_item').find('input[type="text"]').remove();            
        }
    });
}

// INICIALIZACE CONTROLLERU 

$(document).live('pageinit', function(event){
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
