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
    
function getParQS(arg){
    var tmp = window.location.href;
    var tmp_val = tmp.substr(tmp.indexOf(arg)+arg.length+1);
    if(tmp_val.indexOf("&") > 0){
        tmp_val = tmp_val.substr(0, tmp_val.indexOf("&")-1);
    }
    return tmp_val;
}    
    
    
// CONTROLLER - MODEL MVC --------------------------------------------------------------

var callsStack = [];

function clearCallsStack(){
    callsStack = [];
}

function CallStack(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_onclick, afield_ref_val){
    this._id = aid;
    this._ds = ads;
    this._field = afield;
    this._type = atype; // 1 row, 2 list
    this._multi = amulti;
    this._params = aparams;
    this._callbackFce = acallbackFce;
    this._row_onclick = arow_onclick;
    this._field_ref_val = afield_ref_val;
}

function regCtrl(id, id_ctrl, metadata){
    if(id_ctrl === 1){ TextInputCtrl(id, metadata); } // input
    if(id_ctrl === 2){ CollapsibleListCtrl(id, metadata); } // listview
    if(id_ctrl === 3){ LabelCtrl(id, metadata); } // label
}

function delmtr(){
    return ":";
}

function addToCalls(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_onclick, afield_ref_val){
    callsStack.push(new CallStack(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_onclick, afield_ref_val));
}

function getParams(){
    return "";
};

function setValue(id, v, type, row_onclick, ref_val){
    if(type === 1){
        $('#'+id).val(v);
    }
    if(type === 2){
        var arow_onclick = "";
        var aref_val_hidden = "";
        if(row_onclick !== null){
            arow_onclick = row_onclick;
        }
        if(ref_val !== null){
            aref_val_hidden = '<input type="hidden" value="'+ref_val+'">';
        }
        $('#'+id).append('<li><a href="javascript:void(0);" onclick="'+arow_onclick+'"><h3 class="ui-li-heading">'+v+'</h3></a>'+aref_val_hidden+'</li>'); 
        $('#'+id).listview('refresh');
    }
    if(type === 3){
        $('#'+id).html(v);
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
    var arow_onclick = null;
    var afield_ref_val = null;
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
        if(p === "row_onclick"){
            arow_onclick = v;
        }
        if(p === "field_ref_val"){
            afield_ref_val = v;
        }
        $('#'+id).attr(p, v);
    }
    if(ds !== null){
        addToCalls(id, ds, field, type, multi, params, acallbackFce, arow_onclick, afield_ref_val);
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
            var arow_onclick = tmpc._row_onclick;
            var afield_ref_val = tmpc._field_ref_val;
            var data_fmt = $.parseJSON(data);
            switch(amulti){
                case 1: 
                    var v = decodeURIComponent(data_fmt[afield]);
                    var v_ref = "";
                    if(afield_ref_val !== null){
                        v_ref = decodeURIComponent(data_fmt[afield_ref_val]);
                    }
                    setValue(aid, v, atype, arow_onclick, v_ref);
                    if(fce !== null){
                        eval(fce);
                    };
                    break;
                case 2: 
                    for (var i=0;i<data_fmt.length;i++){
                        var tmp = data_fmt[i];
                        var v = decodeURIComponent(tmp[afield]);
                        var v_ref = "";
                        if(afield_ref_val !== null){
                            v_ref = decodeURIComponent(tmp[afield_ref_val]);
                        }
                        setValue(aid, v, atype, arow_onclick, v_ref);
                        if(fce !== null){
                            eval(fce);
                        };
                    }
                    break;
            }
        }, true, true, tmp, fce);
    }
}

function TextInputCtrl(id, metadata){
    setAttribute(id, metadata, 1, 1);
}

function CollapsibleListCtrl(id, metadata){
    setAttribute(id, metadata, 2, 2);
}

function LabelCtrl(id, metadata){
    setAttribute(id, metadata, 3, 1);
}

// --------------------------------------------------------------------------
