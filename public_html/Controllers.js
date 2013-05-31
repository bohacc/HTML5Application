/*  Unit with controllers and global functions
 *  Author: Martin Boháč
 *  Company: Notia
 */

      function nEncodeUri( str ) {
        var tmp_str = str.replace(/&aparameters=/g, '(!)').replace(/&aParameters=/g, '(!)');
        tmp_str = encodeURIComponent( tmp_str );
        tmp_str = tmp_str.replace(/\(\!\)/g, '&aparameters=');
        tmp_str = tmp_str.replace( /\+/g, encodeURIComponent( '+' )); 
        return tmp_str;
      };
     
      function nAjax( call, aparams, afunc, async, decURI, obj, fce ){
        var xasync = true;
        var url_encode = nEncodeUri( aparams ); 
        var acharset = 'utf-8';
        if ( async !== null) { xasync = async; };
        try{
          $.ajax( 
            { url: call,
              data: (url_encode + '&aparameters=aajx:1&aparameters=rnd:'+Math.random()*99999).substr(1),  
              type: 'POST', 
              success: 
                  function( data ) { 
                      var data_encode = ""+data; 
                      afunc( data_encode, obj, fce ); 
              },
              contentType: "application/x-www-form-urlencoded; charset="+acharset,
              async: xasync,
              headers: { Accept : "application/x-www-form-urlencoded; charset="+acharset,
                                               "Content-Type": "application/x-www-form-urlencoded; charset="+acharset,
                                               "Accept-Charset": ""+acharset,
                                               "Accept-Encoding": "gzip, deflate",
                                               "Accept-Language": "cs,en-us;q=0.7,en;q=0.3",
                                               "Accept": "application/x-www-form-urlencoded; charset="+acharset,
                                               "Connection": "keep-alive"
              },
              beforeSend: function(xhr) {
                      xhr.setRequestHeader("Accept-Charset",""+acharset);
                      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset="+acharset);
             }
            } 
          );
        } catch(err) { 
     
        };
      };    
    
$(document).delegate('div[data-role=page]', 'pageshow', function() {
    var theme = $.mobile.loadingMessageTheme;
    var msgText = "načítám...";    
    $.mobile.showPageLoadingMsg(theme, msgText, false);
});


$(document).bind('pageinit', function(){    
    try {  
      $(document).ajaxStart( function() { 
          var theme = $.mobile.loadingMessageTheme;
          var msgText = "načítám...";
          $.mobile.showPageLoadingMsg(theme, msgText, false);
      });
      $(document).ajaxStop( function() { 
          $.mobile.hidePageLoadingMsg();
      });
      $(document).ajaxError( function() { 
          $.mobile.hidePageLoadingMsg();
      });
    } catch(err) { 

    }; 
});

function getNextRowsAmount(){
  return 2; 
}
    
function getParam(name) {
  var searchString = window.location.search.substring(1);
  var i;
  var val = "";
  var params = searchString.split("&");
  for (i=0;i<params.length;i++) {
    val = params[i].split("=");
    var tmp = decodeURIComponent(val[1]).split(":"); 
    if (tmp[0] == name) {
      return unescape(tmp[1]);
    }
  }
  return null;
}

function goToPageWithParams(call, params){
    var str = "";
    var tmp = params.replace(/ap=/g,'');
    while(tmp.indexOf('&') > -1){
        var val = tmp.substr(0, tmp.indexOf('&'));
        str += '  <input type="hidden" name="ap" value="'+val+'">';
        tmp = tmp.substr(tmp.indexOf('&') + 1);
    }
    if(params !== null){
        str += '  <input type="hidden" name="ap" value="'+tmp+'">';
    }
    $('body').append('<form name="form_page" action="'+call+'" data-ajax="false" method="get">'+
                     str+
                     '</form>');
    $('form').submit();
}

function goToPage(page){
    $('body').append('<form name="form_page" action="web_redir_backend" data-ajax="false" method="post">'+
                     '  <input type="hidden" name="ap" value="akod_r:'+page+'">'+
                     '</form>');
    $('form').submit();
}

function home(){
    goToPage("CRM_KONTAKTY_PDA_PAGE1");
}
    
function setPageHead(page){
    // page.type 1 - seznam, 2 - zaznam, 3 - zaznam pro editaci
    var caption = "CRM Kontakty";
    var head = '    <div data-role="header">'+
               '        <h1 class="ui-title" id="header">'+caption+'</h1>'+
               '        <a id="header_toolbar" class="ui-btn-right" onclick="showNavbar();">...</a>'+
               '    </div>'+
               '    <div data-role="navbar" class="hide">'+
               '        <ul>'+
               '            <li><a href="#" data-icon="home" id="bt_home">Domů</a></li>'+
               '        </ul>'+
               '    </div>';
    $('div[data-role="content"]').before(head);
    
    // button HOME
    $('#bt_home').attr("onclick","home()");
    
    // header content by page type
    if(page._type === 2){
        $('h1').html(caption + " - záznam").trigger('create');
        $('div[data-role="navbar"] ul').append('<li><a href="#" id="header_edit" data-icon="gear" onclick="editRecord();">Upravit</a></li>').trigger('create');
    }    
    if(page._type === 3){
        $('h1').html(caption + " - záznam / editace");
        
        $('div[data-role="navbar"] ul').append('<li><a id="header_edit" data-icon="delete" onclick="javascript:self.history.back();">Zpět</a></li>').trigger('create');
        $('div[data-role="navbar"] ul').append('<li><a id="header_edit" data-icon="check" onclick="initSave();">Uložit</a></li>').trigger('create');
    }
};

function setPageFoot(page){
    var foot = '<div data-role="footer">Powered by Notia Business Server</div>';
    $('div[data-role="content"]').after(foot);
};

function setPageContent(){
    
    
}

function initPage(p){
    page = p;
    setPageHead(p);
    setPageFoot(p);    
    setPageContent(p);
    // recreate page with new content
    $('div[data-role="page"]').trigger('pagecreate');
}

function editRecord(){
    var id = $('.ref_id').val();
    var params = "akod_r:CRM_KONTAKTY_PDA_PAGE3&aid:"+id;
    goToPageWithParams("web_redir_backend", params);
}

function showNavbar(){
    $('div[data-role="navbar"]').show("slow",function(){$('#header_toolbar').hide();}).delay(10000).fadeOut("slow",function(){$('#header_toolbar').show();});
}
    
function onInputChange(obj){
    if(!$(obj).hasClass('onEdit')){
        $(obj).addClass('onEdit');
    }
}
    
    
    
// CONTROLLER - MODEL MVC -----------------------------------------------------
// ----------------------------------------------------------------------------

var callsStack = [];
var callsStackPaging = [];
var callsStackSave = [];
var page = null;

var pictures = ["PDA_EMAIL","PDA_MOBIL","PDA_TELEFON","PDA_OSOBA","PDA_ADRESA","PDA_WWW","PDA_SKYPE","PDA_TWITTER"]; // poradi dle typu
var titles = ["email","mobil","telefon","osoba","adresa","www","skype","twitter"]; // poradi dle typu
var images = ["ODEBRAT","PDA_EMAIL","PDA_SMAZAT"];

function getModuleId(){
    return '@@MODULE_ID@@'.replace(/@@/g,'').replace(/MODULE_ID/g,'0');
}

function cancelSaveRow(id, data_type){
    $(id).parent().prev().show();
    $(id).parent().remove();
}

function setCallsStackPagingPage(stack){
    stack[0]._page += 1;
}

function getEditRowCL(data_type){
    var str = "";
    var dt = parseInt(data_type);
    //alert(data_type);
    switch(dt)
    {
        case 0:
            str = '<div>'+
                  '    <input type=\\\'text\\\' data-inline=\\\'true\\\' \\\/>'+
                  '&nbsp;'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'check\\\' onclick=\\\'saveRow(this,'+data_type+');\\\'>Uložit<\\\/a>'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'delete\\\' onclick=\\\'cancelSaveRow(this,'+data_type+');\\\'>Zrušit<\\\/a>'+
                  '</div>';
            break;
        case 1:
            str = '<div>'+
                  '    <input type=\\\'text\\\' data-inline=\\\'true\\\' \\\/>'+
                  '&nbsp;'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'check\\\' onclick=\\\'saveRow(this,'+data_type+');\\\'>Uložit<\\\/a>'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'delete\\\' onclick=\\\'cancelSaveRow(this,'+data_type+');\\\'>Zrušit<\\\/a>'+
                  '</div>';
            break;
        case 2:
            str = '<div>'+
                  '    <input type=\\\'text\\\' data-inline=\\\'true\\\' \\\/>'+
                  '&nbsp;'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'check\\\' onclick=\\\'saveRow(this,'+data_type+');\\\'>Uložit<\\\/a>'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'delete\\\' onclick=\\\'cancelSaveRow(this,'+data_type+');\\\'>Zrušit<\\\/a>'+
                  '</div>';
            break;
        case 4:
            str = '<div>'+
                  '    <input type=\\\'text\\\' data-inline=\\\'true\\\' \\\/>'+
                  '&nbsp;'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'check\\\' onclick=\\\'saveRow(this,'+data_type+');\\\'>Uložit<\\\/a>'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'delete\\\' onclick=\\\'cancelSaveRow(this,'+data_type+');\\\'>Zrušit<\\\/a>'+
                  '</div>';
            break;        
        case 5:
            str = '<div>'+
                  '    <input type=\\\'text\\\' data-inline=\\\'true\\\' \\\/>'+
                  '&nbsp;'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'check\\\' onclick=\\\'saveRow(this,'+data_type+');\\\'>Uložit<\\\/a>'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'delete\\\' onclick=\\\'cancelSaveRow(this,'+data_type+');\\\'>Zrušit<\\\/a>'+
                  '</div>';
            break;
        case 6:
            str = '<div>'+
                  '    <input type=\\\'text\\\' data-inline=\\\'true\\\' \\\/>'+
                  '&nbsp;'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'check\\\' onclick=\\\'saveRow(this,'+data_type+');\\\'>Uložit<\\\/a>'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'delete\\\' onclick=\\\'cancelSaveRow(this,'+data_type+');\\\'>Zrušit<\\\/a>'+
                  '</div>';
            break;
        case 7:
            str = '<div>'+
                  '    <input type=\\\'text\\\' data-inline=\\\'true\\\' \\\/>'+
                  '&nbsp;'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'check\\\' onclick=\\\'saveRow(this,'+data_type+');\\\'>Uložit<\\\/a>'+
                  '    <a href=\\\'#\\\' data-inline=\\\'true\\\' data-role=\\\'button\\\' data-icon=\\\'delete\\\' onclick=\\\'cancelSaveRow(this,'+data_type+');\\\'>Zrušit<\\\/a>'+
                  '</div>';
            break;
    }
    return str;
}

function getObjectCL(data_type){
    this.picture = pictures[data_type];
    this.title = titles[data_type];
    this.editRow = getEditRowCL(data_type);
}

function clearCallsStack(){
    callsStack = [];
}

function CallStack(aid, ads, afield, atype, amulti, aparams, acallbackFce, 
                   arow_events, afield_ref_val, anested_fields, asave,
                   alistview_footer, alistview_header, arow_markup, arow_data_icon,
                   arow_markup_for_item, arow_markup_for_item_call,
                   acall_for_next_rows){
    this._id = aid;
    this._ds = ads;
    this._field = afield;
    this._type = atype; // 1 row, 2 list
    this._multi = amulti;
    this._params = aparams;
    this._callbackFce = acallbackFce;
    this._row_events = arow_events;
    this._field_ref_val = afield_ref_val;
    this._nested_fields = anested_fields;
    this._save = asave;
    this._data = null;
    this._page_ref_val = null;
    this._listview_footer = alistview_footer;
    this._listview_header = alistview_header;
    this._row_markup = arow_markup === undefined ? "" : arow_markup;
    this._row_data_icon = arow_data_icon === undefined ? "" : arow_data_icon;
    this._row_markup_for_item = arow_markup_for_item === undefined ? "" : arow_markup_for_item;
    this._row_markup_for_item_call = arow_markup_for_item_call === undefined ? "" : arow_markup_for_item_call;
    this._call_for_next_rows = acall_for_next_rows === undefined ? "" : acall_for_next_rows;
    this._page = 1;
    this._row_item = 1;
}

function CallStackSave(aid, afield, atable, afield_ref, aref_val){
    this._id = aid;
    this._field = afield;
    this._table = atable;
    this._field_ref = afield_ref;
    this._field_ref_val = aref_val;
}

function Page(atype){
    this._type = atype;
    this._state = 0; // 0 - default,1 - new
}

function regCtrl(id, id_ctrl, metadata){
    if(id_ctrl === 1){ TextInputCtrl(id, metadata); } // input
    if(id_ctrl === 2){ ListviewCtrl(id, metadata); } // listview
    if(id_ctrl === 3){ LabelCtrl(id, metadata); } // label
    if(id_ctrl === 4){ CollapsibleListCtrl(id, metadata); } // collapsible list
}

function delmtr(){
    return ":";
}

function getParams(){
    return "";
};

function getPicture(data_type){
    return pictures[data_type];
}

function getImg(index){
    return images[index];
}

function getTitle(data_type){
    return titles[data_type];
}

function getParamsCall(cs){
    var params = "";
    if(cs._params !== null){
        params = cs._params;
    };
    if (cs._call_for_next_rows.length > 0){
        params += '&aparameters=apage:'+cs._page;
        params += '&aparameters=arow_item:'+cs._row_item;
    }
    return params;
}

function existsCall(cs){
    var r = 0;
    for (var i=0; i < callsStackPaging.length; i++){
        if (callsStackPaging[i]._id === cs._id && callsStackPaging[i]._row_item === cs._row_item){
            r = 1;
        }
    }
    return r;
}

function getCurrentCallsStackPaging(id, row_item){
    var callsStackItem = [];
    for (var i=0; i < callsStackPaging.length; i++){
        if (callsStackPaging[i]._id == id && callsStackPaging[i]._row_item == row_item){
            callsStackItem.push(Object.create(callsStackPaging[i]));
        }
    }
    return callsStackItem;
}

function setRowEvents(row_events, ref_val_id){
    var arow_events = "";
    if(row_events != null){
        var arow_events = eval(row_events);
        for(var i=0;i<arow_events.length;i++){
            var vals = arow_events[i].split(':');
            var _p = vals[0].substr(4);
            var _v = decodeURIComponent(vals[1]);
            $('#'+ref_val_id).attr(_p, _v);
        }
    }
}

function refreshListview(id){
    if ($(id).hasClass('ui-listview')) {
        $(id).listview('refresh');
    }else {
        $(id).trigger('create');
    } 
}

function setListRows(cs, content, obj_ins, rownum){
    if (cs._call_for_next_rows.length > 0 && cs._page > 1){
        if (rownum == cs._row_item) {
            var tmp = $(content).find('li.data');
            obj_ins.find('.button_next_rows').before(tmp.slideDown()).trigger('create');       
        }
    }else{
        obj_ins.html(content);
    }
}

function setValue(v, ref_val, cs){  
    var aref_val_hidden = "";
    var aref_val_id = "";
    if(ref_val !== null && ref_val != undefined && ref_val !== "" && ref_val != 'undefined'){
        aref_val_hidden = '<input class="ref_id" id="ref_id_'+ref_val+'" type="hidden" value="'+decodeURIComponent(ref_val)+'">';
        aref_val_id = decodeURIComponent(ref_val);
    }    
    //-- INPUT TEXT
    if(cs._type === 1){
        $(cs._id).val(decodeURIComponent(v));
        if(aref_val_hidden !== ""){
            $('div[data-role="content"]').append(aref_val_hidden);
        }
    }
    //-- LISTVIEW
    if(cs._type === 2){         
        $(cs._id).append('<li id="'+aref_val_id+'">'+
                         '  <a href="javascript:void(0);">'+
                         '    <h3 class="ui-li-heading">'+v+'</h3>'+
                         '  </a>'+
                         aref_val_hidden+
                         '</li>'); 
        setRowEvents(cs._row_events, aref_val_id);
        refreshListview(cs._id);   
    }
    //-- LABEL
    if(cs._type === 3){
        $(cs._id).html(decodeURIComponent(v));
        if(aref_val_hidden !== ""){
            $('div[data-role="content"]').append(aref_val_hidden);
        }        
    }
    //-- COLLAPSIBLE LIST
    if(cs._type === 4){ 
        var str = "";
        var r_rows = v.rows;
        var cols = v.cols === null ? 1 : parseInt(v.cols);
        var class_col = "";
        var r_rownum = v.rownum;
        var cl_name = v.name;
        var cl_caption = v.caption;
        var cl_hide = v.hide;
        var j = 0;
        var c = 0;
        var cleaner = "";
        var rnd = (""+Math.random()).replace(/\./g,"");
        aref_val_hidden = "";
        aref_val_id = "";
             
        str = '<ul data-role="listview" id="id_'+rnd+'">';
        var row_ident_html = "";
        for(var i=0;i<r_rows.length;i++){
            var row = r_rows[i];
            var fields = [];
            var content_row = "";
            var adata_type_row = "";
            if(cs._nested_fields !== null){
                fields = cs._nested_fields.split(";");
            }
            if(fields.length > 0 && row !== undefined){
                for(var j=0;j<fields.length;j++){
                    var tmp = decodeURIComponent(row[fields[j]]);
                    var data_type = row[fields[j]+"_data_type"];
                    var db_field = row[fields[j]+"_field"];
                    var class_hide = "";
                    if (fields[j] === 'ident'){
                        row_ident_html = '<input class="ident" type="hidden" name="ap" value="'+row[fields[j]]+'" />';
                    }else{
                        if(data_type !== undefined){
                            adata_type_row = data_type;
                        }
                        c++;
                        class_col = cl_name + '_col' + c;
                        if(c >= cols){
                            c = 0;
                            cleaner = '<div class="cleaner">&nbsp;</div>';
                        }else{
                            cleaner = '';
                        }
                        if(tmp !== "" || data_type !== undefined){
                            //setRowEvents(row_events, ref_val_id);//!!!!!!
                            class_hide = tmp === "" ? "hidex" : "";
                            content_row += '<div data-role="fieldcontain" class="row_data_item '+class_hide+' '+class_col+'">'+
                                           '    <div class="data_value">'+tmp+'</div>'+
                                           '    <input type="hidden" name="ap" value="'+db_field+'" />'+
                                           '</div>'+
                                           cleaner;
                        }
                    }
                }
                if(content_row !== ""){
                    if(adata_type_row !== ""){
                        content_row = '<table data-role="table" class="table_data ui-responsive table-stroke"><tr>'+
                                      ' <td class="tab_1">'+
                                      '    <img src="web_get_img_data?aparameters=akod_obrazku:'+getPicture(adata_type_row)+'" />'+ 
                                      ' </td>'+
                                      ' <td class="tab_2">'+content_row+'</td>'+
                                      ' <td class="tab_3 td_delete">&nbsp;</td>'+
                                      '</tr></table>';
                    }
                    if (cs._row_markup.length > 0){
                        var data_icon = cs._row_data_icon.length > 0 ? cs._row_data_icon : 'false';
                        var row_markup_for_items = cs._row_markup_for_item.length > 0 ? cs._row_markup_for_item.split(',') : [];
                        var row_markup_for_item_calls = cs._row_markup_for_item_call.length > 0 ? cs._row_markup_for_item_call.split(',') : [];
                        var markup = cs._row_markup;

                        if(row_markup_for_items.indexOf(r_rownum) > 0){
                            markup = markup.replace(/@@CALL@@/g, row_markup_for_item_calls[row_markup_for_items.indexOf(r_rownum)]);
                        }else{
                            markup = markup.replace(/@@CALL@@/g, '');
                            data_icon = cs._row_markup_for_item.length > 0 ? 'false' : data_icon;
                        }
                                       
                        str += '<li data-icon="'+data_icon+'" data-role="fieldcontain" class="data">'+
                               markup.replace(/@@CONTENT@@/g, content_row)+
                               aref_val_hidden+
                               row_ident_html+
                               '</li>';                                        
                    }else{
                        str += '<li data-icon="false" data-role="fieldcontain" class="data">'+
                               '<a href="javascript:void(0)">'+
                               content_row+
                               aref_val_hidden+
                               row_ident_html+
                               '</a>'+
                               '</li>';                
                    }
                }
            }
        }
        
        // row for next records
        if (cs._call_for_next_rows.length > 0){
            str += '<li data-icon="false" class="button_next_rows"><a href="javascript:void(0);" onclick="initDocs(1,\''+cs._id+'\','+r_rownum+');">další záznamy</a></li>';
        }
        
        str += '</ul>';
        
        // pokud se bude stránkovat a není v zásobníku, tak se přidá
        if (cs._call_for_next_rows.length > 0 && existsCall(cs) === 0){ 
            var cs_new = Object.create(cs);
            cs_new._row_item = r_rownum;            
            callsStackPaging.push(cs_new);
        }        
        
        j = 0;
        $(cs._id+' h3').each(function(){
            j++;
            if(parseInt(r_rownum) === j){
                setListRows(cs, str, $(this).next(), r_rownum);
                //zmena caption
                if(cl_caption !== undefined && cl_caption !== null){
                    $(this).find('.ui-btn-text').text(decodeURIComponent(cl_caption));
                }
                cl_hide === '1' ? $(this).parent().hide() : $(this).parent().show();
                return false;
            } 
        });
        
        //-- schovají se prázdné řádky, ktere tu jsou pouze pro editaci
        $(cs._id).find('.hidex').closest('li').hide();
        //-- recreate lisview
        refreshListview(cs._id);
    }
}

function setAttribute(id, metadata, type, multi){
    var del = delmtr();
    var p = null;
    var v = null;
    var tmp = null;
    var cs = new CallStack(id, null, null, type, multi);
    for(var i = 0; i < metadata.length; i++){
        tmp = metadata[i];
        p = tmp.substring(0, tmp.indexOf(del));
        v = tmp.substr(tmp.indexOf(del)+1);
        switch(p)
        {
            case "ds": 
                cs._ds = v;
                break;
            case "field": 
                cs._field = v;
                break;
            case "ds_par": 
                cs._params = v;
                break;
            case "callbackFce": 
                cs._callbackFce = v;
                break;
            case "row_events": 
                cs._row_events = v;
                break;
            case "field_ref_val": 
                cs._field_ref_val = v;
                break;
            case "nested_fields": 
                cs._nested_fields = v;
                break;
            case "save": 
                cs._save = v;
                break;
            case "listview_footer":
                cs._listview_footer = v;
                break;
            case "listview_header":
                cs._listview_header = v;
                break;            
            case "row_markup":
                cs._row_markup = v;
                break;
            case "row_data_icon":
                cs._row_data_icon = v;
                break;
            case "row_markup_for_item":
                cs._row_markup_for_item = v;
                break;
            case "row_markup_for_item_call":
                cs._row_markup_for_item_call = v;
                break;
            case "call_for_next_rows":
                cs._call_for_next_rows = v;
                break;
        }
        // set javascript actions to object
        if(p.substr(0,4) === "set_"){
            $(id).attr(p.substr(4), v);
        }
    }
    if(cs._ds !== null){
        callsStack.push(cs);
    }    
}

function regSaveEvent(cs){
    if(cs._save !== undefined ){
        var save = cs._save.split(";");
        var afield = save[0];
        var atable = save[1];
        var afield_ref = save[2];
        var afield_ref_for_val = save[3];
        var aref_val = cs._data[afield_ref_for_val];
        var css = new CallStackSave(cs._id, afield, atable, afield_ref, aref_val);
        callsStackSave.push(css);
    }
}

function initSave(){
    var arr = callsStackSave;
    for(var i=0;i<arr.length;i++){
        var tmp = arr[i];
        var val = $(tmp._id).val();
        var proc = page._state === 1 ? 'web_mvc_insert' : 'web_mvc_update';
        var params = '&aparameters=spouzetelo:1'+
                     '&aparameters=afield:'+tmp._field+
                     '&aparameters=afield_val:'+val+
                     '&aparameters=atable:'+tmp._table+
                     '&aparameters=afield_ref:'+tmp._field_ref+
                     '&aparameters=afield_ref_val:'+tmp._field_ref_val;
        nAjax('web_redir','&aparameters=akod_r:'+proc+'&aparameters=spouzetelo:1'+params, function(data){
            
        });
    }
}

function initDocs(callsStackPaging, id, row_item){
    var arr = callsStack;
    // for paging
    if (callsStackPaging !== undefined){
        arr = getCurrentCallsStackPaging(id, row_item);
        setCallsStackPagingPage(arr);
    }
    for(var i=0;i<arr.length;i++){
        var tmp = arr[i];
        var acall = tmp._ds; 
        var params = getParamsCall(tmp);
        var fce = tmp._callbackFce;
        nAjax('web_redir','&aparameters=akod_r:'+acall+'&aparameters=module_id:'+getModuleId()+'&aparameters=spouzetelo:1'+params, function(data, tmpc, fce){
            var afield = tmpc._field;
            var amulti = tmpc._multi;            
            var afield_ref_val = tmpc._field_ref_val;
            var aid = tmpc._id;
            var alistview_footer = tmpc._listview_footer;
            var alistview_header = tmpc._listview_header;
            var data_fmt = $.parseJSON(data);
            switch(amulti){
                case 1: 
                    var v = decodeURIComponent(data_fmt[afield]);
                    var v_ref = "";
                    if(afield_ref_val !== null){
                        v_ref = decodeURIComponent(data_fmt[afield_ref_val]);
                    }
                    tmpc._data = data_fmt;
                    tmpc._page_ref_val = v_ref;
                    regSaveEvent(tmpc);
                    setValue(v, v_ref, tmpc);
                    break;
                case 2: 
                    var data = data_fmt.data;
                    for (var i=0;i<data.length;i++){
                        var tmp = data[i];
                        var v = decodeURIComponent(tmp[afield]);
                        var v_ref = "";
                        if(afield_ref_val !== null){
                            v_ref = decodeURIComponent(tmp[afield_ref_val]);
                        }
                        setValue(v, v_ref, tmpc);
                    }
                    break;
                case 3:
                    var data = data_fmt.data;
                    for (var i=0;i<data.length;i++){
                        var tmp = data[i];
                        var v_ref = "";
                        if(afield_ref_val !== null){
                            v_ref = decodeURIComponent(tmp[afield_ref_val]);
                        }
                        setValue(tmp, v_ref, tmpc);
                    }
                    if(alistview_footer !== undefined){
                        eval(tmpc._listview_footer+'(aid, data, tmpc)');
                    }
                    if(alistview_header !== undefined){
                        eval(tmpc._listview_header+'(aid, data, tmpc)');
                    }                    
                    break;
            }
            if(fce !== null){
                eval(fce);
            };
        }, true, true, tmp, fce);
    }
}

function TextInputCtrl(id, metadata){
    setAttribute(id, metadata, 1, 1);
}

function ListviewCtrl(id, metadata){
    setAttribute(id, metadata, 2, 2);
}

function LabelCtrl(id, metadata){
    setAttribute(id, metadata, 3, 1);
}

function CollapsibleListCtrl(id, metadata){
    setAttribute(id, metadata, 4, 3);
}



function getButtonCLAddRow(data_type, id, data, cs){
    var obj = new getObjectCL(data_type);
    var img = obj.picture;
    var title = obj.title;
    var ins_content = obj.editRow;
    //ins_content = '<input type=\\\'text\\\'>';
    var content = '<a href="#" data-inline="true" data-role="button" onclick="$(this).parent().find(\'a\').hide().after(\''+ins_content+'\').next().trigger(\'create\');">'+
                  '    <img src="web_get_img_data?aparameters=akod_obrazku:'+img+'" alt="'+title+'">'+
                  title+
                  '</a>';
    return content;
}

function setListviewHeaderDataInsert(id, data, cs){
    var content = "";
    if(data !== undefined){
        for(var i=0;i<data.length;i++){
            var arows = data[i].rows;
            var v1 = 0;
            var v2 = 0;
            var v3 = 0;
            var d1 = "";
            var d2 = "";
            var d3 = "";
            var p = 0;
            var current_obj = null;
            $('div[data-role="collapsible"]').each(function(){
                if(i === p){
                    current_obj = this;
                    return false;
                }
                p += 1;
            }); 
            for(var j=0;j<arows.length;j++){
                var row = arows[j];
                var fields = [];
                if(cs._nested_fields !== null){
                    fields = cs._nested_fields.split(";");
                }
                var afield = fields[0];
                var afield_val = row[afield];
                var adata_type = row[afield+"_data_type"];
                if(adata_type === "1" || adata_type === "2"){
                    //alert(afield);
                    if(afield_val !== ""){
                        v1++;
                        d1 = adata_type;
                    };
                }
                if(adata_type === "4"){
                    if(afield_val !== ""){
                        v2++;
                        d2 = adata_type;
                    };
                }
                if(adata_type === "0" || adata_type === "6" || adata_type === "7"){
                    if(afield_val !== ""){
                        v3++;
                        d3 = adata_type;
                    }
                }
            }
           //alert(v1+'*'+v2+'*'+v3+'---'+i);
            if((v1 < 2) && (i === 0)){
                content += getButtonCLAddRow(d1, id, data, cs);
            }
            if((v2 < 2) && (i === 1)){
                content += getButtonCLAddRow(d2, id, data, cs);
            }
            if((v3 < 2) && (i === 2)){
                content += getButtonCLAddRow(d3, id, data, cs);
            }
            //if(content !== ""){
                //alert('x');
                //content = "<p>"+content+"</p>";
                content = '<div><a href="#" data-role="button">Uložit</a><a href="#" data-role="button">Zrušit</a></div>';
                $(current_obj).find('ul').prepend('<li data-icon="false" class="header_bar">'+content+'</li>').trigger('create').listview("refresh");
                $('.header_bar').hide();
                content = "";
            //}
            
        }
    }
}


function setListviewFooterDataInsert(id, data, cs){
    var content = "";
    if(data !== undefined){
        for(var i=0;i<data.length;i++){
            var arows = data[i].rows;
            var type_navigator = parseInt(decodeURIComponent(data[i].type_navigator));
            type_navigator = type_navigator === null ? 0 : type_navigator;
            var p = 0;
            var current_obj = null;
            $('div[data-role="collapsible"]').each(function(){
                if(i === p){
                    current_obj = this;
                    return false;
                }
                p += 1;
            });
            switch(type_navigator)
            {
                case 0:
                    content = '';
                    break;
                case 1:
                    content = '<div>'+
                              '  <table style="width: 100%"><tr>'+
                              '    <td><a href="#" style="width: 100%" data-icon="gear" data-role="button" class="bt_edit" onclick="editItemRows(this);changeButtonsCLToolbar(this);">Upravit</a></td>'+
                              '  </tr></table>'+
                              '</div>';
                    break;
                case 2:
                    var functionNewRecord = decodeURIComponent(data[i].functionNewRecord);
                    var functionNextRecords = decodeURIComponent(data[i].functionNextRecord);
                    content = '<div>'+
                              '  <table style="width: 100%"><tr>'+
                              '    <td style="width: 50%"><a href="#" style="width: 100%" data-icon="plus" data-inline="true" data-role="button" class="bt_new" onclick="changeButtonsCLToolbar2(this);'+functionNewRecord+'(this);" title="Nový záznam">Přidat</a></td>'+
                              '    <td style="width: 50%"><a href="#" style="width: 100%" data-inline="true" data-role="button" class="bt_next" onclick="'+functionNextRecords+'(this)" title="Zobrazit další úkoly">Zobrazit další</a></td>'+
                              '  </tr></table>'+
                              '</div>';
                    break;
            }  
            content.length > 0 ? $(current_obj).find('ul').append('<li data-icon="false">'+content+'</li>').trigger('create').listview("refresh") : null;
            
        }
    }
}

function changeButtonsCLToolbar2(obj){  
    if($(obj).hasClass("bt_new")){
        $(obj).closest('table').hide();
        if(!$(obj).closest('table').parent().find('.bt_save').length){
            var str = '<table style="width: 100%"><tr>'+
                      '    <td style="width: 50%"><a href="#" style="width: 100%" data-icon="check" data-inline="true" data-role="button" class="bt_save" onclick="">Uložit</a></td>'+
                      '    <td style="width: 50%"><a href="#" style="width: 100%" data-icon="delete" data-inline="true" data-role="button" class="bt_cancel" onclick="changeButtonsCLToolbar2(this);">Zrušit</a></td>'
                      '</tr></table>';        
            $(obj).closest('table').after(str).trigger('create');
            $(obj).closest('table').parent().find('a').button();
        }else{
            $(obj).closest('table').parent().find('.bt_save').closest('table').show();
            $(obj).closest('table').parent().find('.bt_cancel').closest('table').show();            
        }
    }else{
        $(obj).closest('table').parent().find('.bt_save').closest('table').hide();
        $(obj).closest('table').parent().find('.bt_cancel').closest('table').hide();
        $(obj).closest('table').parent().find('.bt_new').closest('table').show();
        $(obj).closest('table').parent().find('.bt_next').closest('table').show();
        if($(obj).hasClass("bt_save")){
            $('.newForm').remove();
            refreshListview($(obj).closest('div[data-role="collapsible"]'));
        }
        if($(obj).hasClass("bt_cancel")){
            $('.newForm').remove();
            refreshListview($(obj).closest('div[data-role="collapsible"]'));           
        }
    }
}

function changeButtonsCLToolbar(obj){  
    if($(obj).hasClass("bt_edit")){
        $(obj).closest('table').hide();
        if(!$(obj).closest('table').parent().find('.bt_save').length){
            var str = '<table style="width: 100%"><tr>'+
                      '    <td style="width: 50%"><a href="#" style="width: 100%" data-icon="check" data-inline="true" data-role="button" class="bt_save" onclick="saveItemRows(this);changeButtonsCLToolbar(this);">Uložit</a></td>'+
                      '    <td style="width: 50%"><a href="#" style="width: 100%" data-icon="delete" data-inline="true" data-role="button" class="bt_cancel" onclick="changeButtonsCLToolbar(this);">Zrušit</a></td>'+
                      '</tr></table>';
            $(obj).closest('table').after(str).trigger('create');
            $(obj).closest('table').parent().find('a').button();
        }else{
            $(obj).closest('table').parent().find('.bt_save').closest('table').show();
            $(obj).closest('table').parent().find('.bt_cancel').closest('table').show();            
        }
        $(obj).closest('table').parent().parent().parent().find('.row_data_item').closest('li').show();
    }else{
        $(obj).closest('table').parent().find('.bt_save').closest('table').hide();
        $(obj).closest('table').parent().find('.bt_cancel').closest('table').hide();
        $(obj).closest('table').parent().find('.bt_edit').closest('table').show();
        if($(obj).hasClass("bt_save")){
            $(obj).closest('table').parent().parent().parent().find('.row_data_item').each(function(){
                $(this).find('.data_value').text($(this).find('input[type=text]').val());
                if($(this).find('input[type=text]').val().length === 0) { $(this).closest('li').hide() };
                $(this).find('input[type=text]').remove();
                $(this).find('.data_value').show();
            }); 
        }
        if($(obj).hasClass("bt_cancel")){
            $(obj).closest('table').parent().parent().parent().find('.row_data_item').each(function(){
                if($(this).find('.data_value').text().length === 0) { $(this).closest('li').hide() };
            });
            $(obj).closest('table').parent().parent().parent().find('.row_data_item').find('.data_value').show();            
            $(obj).closest('table').parent().parent().parent().find('.row_data_item').find('input[type="text"]').remove();            
        }
        $(obj).find('.onEdit').removeClass('onEdit');
        $(obj).closest('table').parent().parent().parent().find('.inputDelete').remove();
    }
}

// ---------------------------------------------------------------------------