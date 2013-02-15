      function nEncodeUri( str ) {
        var tmp_str = str.replace(/&aparameters=/g, '(!)').replace(/&aParameters=/g, '(!)');
        //tmp_str = tmp_str.replace(/\?aparameters=/g, '(*!)').replace(/\?aParameters=/g, '(*!)');
        tmp_str = encodeURIComponent( tmp_str );
        tmp_str = tmp_str.replace(/\(\!\)/g, '&aparameters=');
        //tmp_str = tmp_str.replace(/\(\*\!\)/g, '?aparameters=');
        tmp_str = tmp_str.replace( /\+/g, encodeURIComponent( '+' )); 
        return tmp_str;
      };
     
      function nAjax( call, aparams, afunc, async, decURI, obj, fce ){
        var xasync = true;
        var url_encode = nEncodeUri( aparams ); 
        var acharset = 'utf-8';
        if ( async !== null) { xasync = async; };
        //alert(url_encode + '&aparameters=aajx:1&aparameters=rnd:'+Math.random()*99999);
        try{
          $.ajax( 
            { url: call,
              data: (url_encode + '&aparameters=aajx:1&aparameters=rnd:'+Math.random()*99999).substr(1),  
              type: 'POST', 
              success: 
                  function( data ) { 
                      var data_encode = ""+data; 
                      //if ( decURI === null || decURI === true) { 
                      //    data_encode = decodeURIComponent( data );
                      //}; 
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
    while(tmp.indexOf('&') > 0){
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
    var head = '  <div data-role="header">'+
               '      <h1>'+caption+'</h1><a href="#" id="bt_home">Domů</a>'+
               '  </div>';
    $('div[data-role="content"]').before(head);
    if(page.type === 2){
        $('h1').html(caption + " - záznam");
        $('h1').after('<a href="#" id="header_edit">Upravit</a>');
        $('#header_edit').removeClass('ui-btn-left').addClass('ui-btn-right');
    }    
    if(page.type === 3){
        $('h1').html(caption + " - záznam/editace");
        $('h1').after('<a id="header_edit">Uložit</a>');
        $('#header_post').removeClass('ui-btn-left').addClass('ui-btn-right');
    }
    $('#bt_home').attr("onclick","home()");
};

function setPageFoot(page){
     
};

function initPage(page){
    setPageHead(page);
    setPageFoot(page);
}
    
    
    
// CONTROLLER - MODEL MVC --------------------------------------------------------------

var callsStack = [];

var pictures = ["PDA_EMAIL","PDA_MOBIL","PDA_TELEFON","PDA_OSOBA","PDA_ADRESA","PDA_WWW"];

function clearCallsStack(){
    callsStack = [];
}

function CallStack(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_events, afield_ref_val, anested_fields){
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
}

function Page(atype){
    this.type = atype;
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

function addToCalls(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_events, afield_ref_val, anested_fields){
    callsStack.push(new CallStack(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_events, afield_ref_val, anested_fields));
}

function getParams(){
    return "";
};

function getPictures(data_type){
    return pictures[data_type];
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

function setValue(id, v, type, row_events, ref_val, nested_fields){  
    var aref_val_hidden = "";
    var aref_val_id = "";
    if(ref_val !== null){
        aref_val_hidden = '<input id="ref_id_'+ref_val+'" type="hidden" value="'+decodeURIComponent(ref_val)+'">';
        aref_val_id = decodeURIComponent(ref_val);
    }    
    //-- INPUT TEXT
    if(type === 1){
        $('#'+id).val(decodeURIComponent(v));
    }
    //-- LISTVIEW
    if(type === 2){         
        $('#'+id).append('<li id="'+aref_val_id+'">'+
                         '  <a href="javascript:void(0);">'+
                         '    <h3 class="ui-li-heading">'+v+'</h3>'+
                         '  </a>'+
                         aref_val_hidden+
                         '</li>'); 
        setRowEvents(row_events, aref_val_id);
        refreshListview('#'+id);   
    }
    //-- LABEL
    if(type === 3){
        $('#'+id).html(decodeURIComponent(v));
    }
    //-- COLLAPSIBLE LIST
    if(type === 4){ 
        var str = "";
        var r_rows = v.rows;
        var r_rownum = v.rownum;
        var j = 0;
        var rnd = (""+Math.random()).replace(/\./g,"");
        aref_val_hidden = "";
        aref_val_id = "";
        str = '<ul data-role="listview" id="id_'+rnd+'">';
        for(var i=0;i<r_rows.length;i++){
            var row = r_rows[i];
            var fields = [];
            var content_row = "";
            var adata_type_row = "";
            if(nested_fields !== null){
                fields = nested_fields.split(";");
            }
            if(fields.length > 0 && row !== undefined){
                for(var j=0;j<fields.length;j++){
                    var tmp = decodeURIComponent(row[fields[j]]);
                    var data_type = row[fields[j]+"_data_type"];
                    if(data_type != undefined){
                        adata_type_row = data_type;
                    }
                    if(tmp !== ""){
                        //setRowEvents(row_events, ref_val_id);//!!!!!!
                        content_row += '<div>'+tmp+'</div>';                        
                    }
                }
                if(content_row !== ""){
                    if(adata_type_row != ""){
                        content_row = '<div style="float: left; vertical-align: middle"><img src="web_get_img_data?aparameters=akod_obrazku:'+getPictures(adata_type_row)+'"></div><div style="float: left">'+content_row+'</div><div class="cleaner">&nbsp;</div>';
                    }
                    str += '<li>'+
                           '  <a href="javascript:void(0);">'+
                           content_row+
                           '  </a>'+
                           aref_val_hidden+
                           '</li>';                
                }
            }
        }
        str += '</ul>';
        j = 0;
        $('#'+id+' h3').each(function(){
            j++;
            if(r_rownum == j){
                $(this).next().html(str);
            } 
        });
        refreshListview('#'+id);  
    }
}

function setAttribute(id, metadata, type, multi){
    var del = delmtr();
    var field = null;
    var p = null;
    var v = null;
    var ds = null;
    var tmp = null; 
    var params = null; 
    var acallbackFce = null;
    var arow_events = null;
    var afield_ref_val = null;
    var anested_fields = null;
    for(var i = 0; i < metadata.length; i++){
        tmp = metadata[i];
        p = tmp.substring(0, tmp.indexOf(del));
        v = tmp.substr(tmp.indexOf(del)+1);
        if(p === "ds"){
            ds = v;
        }
        if(p === "field"){
            field = v;
        }
        if(p === "ds_par"){
            params = v;
        }
        if(p === "callbackFce"){
            acallbackFce = v;
        }
        if(p === "row_events"){
            arow_events = v;
        }
        if(p === "field_ref_val"){
            afield_ref_val = v;
        }
        if(p === "nested_fields"){
            anested_fields = v;
        }
        if(p.substr(0,4) === "set_"){
            $('#'+id).attr(p.substr(4), v);
        }
    }
    if(ds !== null){
        addToCalls(id, 
                   ds, 
                   field, 
                   type, 
                   multi, 
                   params, 
                   acallbackFce, 
                   arow_events, 
                   afield_ref_val, 
                   anested_fields);
    }    
}

function initDocs(){
    var arr = callsStack;
    for(var i=0;i<arr.length;i++){
        var tmp = arr[i];
        var acall = tmp._ds; 
        var params = "";
        if(tmp._params !== null){
            params = tmp._params;
        };
        var fce = tmp._callbackFce;
        nAjax('web_redir','&aparameters=akod_r:'+acall+'&aparameters=spouzetelo:1'+params, function(data, tmpc, fce){
            var afield = tmpc._field;
            var aid = tmpc._id;
            var atype = tmpc._type;
            var amulti = tmpc._multi;
            var arow_events = tmpc._row_events;
            var afield_ref_val = tmpc._field_ref_val;
            var anested_fields = tmpc._nested_fields;
            var data_fmt = $.parseJSON(data);
            switch(amulti){
                case 1: 
                    var v = decodeURIComponent(data_fmt[afield]);
                    var v_ref = "";
                    if(afield_ref_val !== null){
                        v_ref = decodeURIComponent(data_fmt[afield_ref_val]);
                    }
                    setValue(aid, v, atype, null, v_ref);
                    break;
                case 2: 
                    for (var i=0;i<data_fmt.length;i++){
                        var tmp = data_fmt[i];
                        var v = decodeURIComponent(tmp[afield]);
                        var v_ref = "";
                        if(afield_ref_val !== null){
                            v_ref = decodeURIComponent(tmp[afield_ref_val]);
                        }
                        setValue(aid, v, atype, arow_events, v_ref);
                    }
                    break;
                case 3:
                    for (var i=0;i<data_fmt.length;i++){
                        var tmp = data_fmt[i];
                        var v_ref = "";
                        if(afield_ref_val !== null){
                            v_ref = decodeURIComponent(tmp[afield_ref_val]);
                        }
                        setValue(aid, tmp, atype, arow_events, v_ref, anested_fields);
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

// --------------------------------------------------------------------------