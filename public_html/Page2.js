/* Unit for init page 2
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function setDateEvents(){
    nAjax('web_redir', '&aparameters=akod_r:web_mvc_date_udal_json&aparameters=spouzetelo:1', function(data){
        var data_fmt = $.parseJSON(data);
        var state = decodeURIComponent(data_fmt.state);
        var message = decodeURIComponent(data_fmt.message);
        if (state === '1'){
            var date = decodeURIComponent( data_fmt.date );
            var datefrom = decodeURIComponent( data_fmt.datefrom );
            var dateto = decodeURIComponent( data_fmt.dateto );
            $('#eventDate').val(date);
            $('#eventFrom').val(datefrom);
            $('#eventTo').val(dateto);
        }else{
            alert('Při nastavení datumu došlo k chybě.\n\n'+message);
        }
    });    
}

function initComboPerson(){
    nAjax('web_redir', '&aparameters=akod_r:web_mvc_udaje_os_ukol_json&aparameters=spouzetelo:1', function(data){
        var data_fmt = $.parseJSON(data);
        var state = decodeURIComponent(data_fmt.state);
        var message = decodeURIComponent(data_fmt.message);
        if (state === '1'){
            var records = data_fmt.records;
            var str = '<option value="">&nbsp;</option>';
            for (var i = 0; i < records.length; i++){
                var code = decodeURIComponent(records[i].code);
                var name = decodeURIComponent(records[i].name);
                str += '<option value="'+code+'">'+name+'</option>';
            }
            $('#taskPerson').html(str).trigger('create').trigger('refresh');
        }else{
            alert('Při plnění nabídky pověřená osoba došlo k chybě.\n\n'+message);
        }
    });
}

function initComboEventPerson(){
    nAjax('web_redir', '&aparameters=akod_r:web_mvc_udaje_os_ukol_json&aparameters=spouzetelo:1', function(data){
        var data_fmt = $.parseJSON(data);
        var state = decodeURIComponent(data_fmt.state);
        var message = decodeURIComponent(data_fmt.message);
        if (state === '1'){
            var records = data_fmt.records;
            var str = '<option>Účastníci<\/option>';
            for (var i = 0; i < records.length; i++){
                var code = decodeURIComponent(records[i].code);
                var name = decodeURIComponent(records[i].name);
                str += '<option value="'+code+'">'+name+'</option>';
            }
            $('#eventPerson').html(str);
            $('#eventPerson').selectmenu('refresh', 'true');
        }else{
            alert('Při plnění nabídky pověřená osoba došlo k chybě.\n\n'+message);
        }
    });
}

function deleteNewTask(obj){
    $(obj).closest('li').remove();
    refreshListview($(obj).closest('div[data-role="collapsible"]'));
}

function verifyTask(){
    var err = 0;
    if ($('#taskSubject').val().length === 0 && err === 0){ err = 1; alert('Zadejte předmět'); $('#taskSubject').focus(); };
    if ($('#taskDescription').val().length === 0 && err === 0){ err = 1; alert('Zadejte text'); $('#taskDescription').focus(); };
    if ($('#taskDate').val().length === 0 && err === 0){ err = 1; alert('Zadejte datum'); $('#taskDate').focus(); };
    if ($('#taskPerson').val().length === 0 && err === 0){ err = 1; alert('Zadejte osobu'); $('#taskPerson').focus(); };
    return err = err === 1 ? 0 : 1;
}

function verifyEvent(){
    var err = 0;
    if ($('#eventDate').val().length === 0 && err === 0){ err = 1; alert('Zadejte datum'); $('#eventDate').focus(); };
    if ($('#eventFrom').val().length === 0 && err === 0){ err = 1; alert('Zadejte čas od'); $('#eventFrom').focus(); };
    if ($('#eventTo').val().length === 0 && err === 0){ err = 1; alert('Zadejte čas do'); $('#eventTo').focus(); };
    if ($('#eventSubject').val().length === 0 && err === 0){ err = 1; alert('Zadejte předmět'); $('#eventSubject').focus(); };
    if ($('#eventDescription').val().length === 0 && err === 0){ err = 1; alert('Zadejte poznámku'); $('#eventDescription').focus(); };
    if ($('#eventPerson').val().length === 0 && err === 0){ err = 1; alert('Zadejte osobu'); $('#eventPerson').focus(); };
    return err = err === 1 ? 0 : 1;
}

function postNewTask(obj){
    if (verifyTask() === 1){
        nAjax('web_redir', 
              '&aparameters=akod_r:web_mvc_crm_k_ukol_ins_json'+
              '&aparameters=spouzetelo:1'+
              '&aparameters=subject:'+$('#taskSubject').val()+
              '&aparameters=description:'+$('#taskDescription').val()+
              '&aparameters=date:'+$('#taskDate').val()+
              '&aparameters=person:'+$('#taskPerson').val()+
              '&aparameters=ident:'+$('.ref_id').val(), 
              function(data){
                  var data_fmt = $.parseJSON(data);
                  var state = decodeURIComponent(data_fmt.state);
                  var message = decodeURIComponent(data_fmt.message);
                  if (state === '1'){
                      changeButtonsCLToolbar2(obj);
                      initDocs();
                  }else{
                      alert('Při ukládání úkolu došlo k chybě.\n\n'+message);
                  }
        });
    };
}

function postNewEvent(obj){
    if (verifyEvent() === 1){
        nAjax('web_redir', 
              '&aparameters=akod_r:web_mvc_crm_k_udal_ins_json'+
              '&aparameters=spouzetelo:1'+
              '&aparameters=subject:'+$('#eventSubject').val()+
              '&aparameters=description:'+$('#eventDescription').val()+
              '&aparameters=date:'+$('#eventDate').val()+
              '&aparameters=datefrom:'+$('#eventFrom').val()+
              '&aparameters=dateto:'+$('#eventTo').val()+
              '&aparameters=person:'+$('#eventPerson').val()+
              '&aparameters=ident:'+$('.ref_id').val(), 
              function(data){
                  var data_fmt = $.parseJSON(data);
                  var state = decodeURIComponent(data_fmt.state);
                  var message = decodeURIComponent(data_fmt.message);
                  if (state === '1'){
                      changeButtonsCLToolbar2(obj);
                      initDocs();
                  }else{
                      alert('Při ukládání události došlo k chybě.\n\n'+message);
                  }
        });
    };
}

function tasksNewRecord(obj){
    var tmp = '<li class="newForm newTask">'+
                //'<a href="javascript:void(0);">'+
                '<table class="table_data">'+
                    '<tr><td><label for="taskSubject">Předmět:<\/label><input type="text" id="taskSubject" \/><\/td><\/tr>'+
                    '<tr><td><label for="taskDescription">Text:<\/label><textarea cols="40" rows="8" id="taskDescription"><\/textarea><\/td><\/tr>'+
                    '<tr><td><label for="taskDate">Termín splnění:<\/label><input type="date" id="taskDate" \/><\/td><\/tr>'+                    
                    '<tr><td><label for="taskPerson">Osoba:<\/label><select id="taskPerson"><option value="" \/><\/select><\/td><\/tr>'+
                '<\/table>'+
                //'<\/a>'+
                '<script type="text\/javascript">'+
                    '$(".newTask").parent().find(".bt_save").bind("click", function(){postNewTask(this);});'+
                    'initComboPerson();'+
                '<\/script>'+
              '<\/li>';
    $(obj).closest('li').before(tmp).trigger('create');
    refreshListview($(obj).closest('div[data-role="collapsible"]'));
}

function eventsNewRecord(obj){
    var tmp = '<li class="newForm newEvent">'+
                //'<a href="javascript:void(0);">'+
                '<table class="table_data">'+
                    '<tr><td><label for="eventDate">Datum:<\/label><input type="date" id="eventDate" \/><\/td><\/tr>'+                        
                    '<tr><td><label for="eventFrom">Od:<\/label><input type="date" id="eventFrom" \/><\/td><\/tr>'+
                    '<tr><td><label for="eventTo">Do:<\/label><input type="date" id="eventTo" \/><\/td><\/tr>'+                    
                    '<tr><td><label for="eventSubject">Předmět:<\/label><input type="text" id="eventSubject" \/><\/td><\/tr>'+
                    '<tr><td><label for="eventDescription">Poznámka:<\/label><textarea cols="40" rows="8" id="eventDescription"><\/textarea><\/td><\/tr>'+
                    '<tr><td>'+
                                '<label for="eventPerson" class="select">Účastníci:</label>'+
                                '<select name="eventPerson" id="eventPerson" multiple="multiple" data-native-menu="false">'+
                                    '<option>Účastníci&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/option>'+
                                '<\/select>'+
                             '<\/td><\/tr>'+
                '<\/table>'+
                //'<\/a>'+
                '<script type="text\/javascript">'+
                    '$(".newEvent").parent().find(".bt_save").bind("click", function(){postNewEvent(this);});'+
                    'initComboEventPerson();'+
                '<\/script>'+
              '<\/li>';
    $(obj).closest('li').before(tmp).trigger('create');
    refreshListview($(obj).closest('div[data-role="collapsible"]'));
    setDateEvents();
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
