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
        var url_encode = aparams; //nEncodeUri( aparams ); 
        var acharset = 'utf-8';
        if ( async != null) { xasync = async; };
        //alert(url_encode + '&aparameters=aajx:1&aparameters=rnd:'+Math.random()*99999);
        try{
          $.ajax( 
            { url: call,
              data: (url_encode + '&aparameters=aajx:1&aparameters=rnd:'+Math.random()*99999).substr(1),  
              type: 'POST', 
              success: 
                  function( data ) { 
                      var data_encode = ""+data; 
                      if ( decURI == null || decURI == true) { 
                          data_encode = decodeURIComponent( data );
                      }; 
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
    
    
    
    
// CONTROLLER - MODEL MVC --------------------------------------------------------------

var callsStack = [];

function clearCallsStack(){
    callsStack = [];
}

function CallStack(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_onclick){
    this._id = aid;
    this._ds = ads;
    this._field = afield;
    this._type = atype; // 1 row, 2 list
    this._multi = amulti;
    this._params = aparams;
    this._callbackFce = acallbackFce;
    this._row_onclick = arow_onclick;
}

function regCtrl(id, id_ctrl, metadata){
    if(id_ctrl == 1){ TextInputCtrl(id, metadata); } // input
    if(id_ctrl == 2){ CollapsibleListCtrl(id, metadata); } // input
}

function delmtr(){
    return ":";
}

function addToCalls(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_onclick){
    callsStack.push(new CallStack(aid, ads, afield, atype, amulti, aparams, acallbackFce, arow_onclick));
}

function getParams(){
    return "";
};

function setValue(id, v, type, row_onclick){
    if(type == 1){
        $('#'+id).val(v);
    }
    if(type == 2){
        var arow_onclick = "";
        if(row_onclick != null){
            arow_onclick = row_onclick;
        }
        $('#'+id).append('<li><a href="javascript:void(0);" onclick="'+arow_onclick+'"><h3 class="ui-li-heading">'+v+'</h3></a><input type="hidden" value="'+v+'"></li>'); 
        $('#'+id).listview('refresh');
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
        $('#'+id).attr(p, v);
    }
    if(ds !== null){
        addToCalls(id, ds, field, type, multi, params, acallbackFce, arow_onclick);
    }    
}

function initDocs(){
    var arr = callsStack;
    for(var i=0;i<arr.length;i++){
        var tmp = arr[i];
        var acall = tmp._ds; 
        var params = "";
        if(tmp._params != null){
            params = tmp._params;
        };
        var fce = tmp._callbackFce;
        nAjax('web_redir','&aparameters=akod_r:'+acall+'&aparameters=spouzetelo:1'+params, function(data, tmpc, fce){
            var afield = tmpc._field;
            var aid = tmpc._id;
            var atype = tmpc._type;
            var amulti = tmpc._multi;
            var arow_onclick = tmpc._row_onclick;
            var data_fmt = $.parseJSON(data);
            switch(amulti){
                case 1: 
                    var v = data_fmt[afield];
                    setValue(aid, v, atype, arow_onclick);
                    if(fce != null){
                        eval(fce);
                    };
                    break;
                case 2: 
                    for (var i=0;i<data_fmt.length;i++){
                        var tmp = data_fmt[i];
                        var v = tmp[afield];
                        setValue(aid, v, atype, arow_onclick);
                        if(fce != null){
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

// --------------------------------------------------------------------------



// FUNKCE PRO FORMULAR -------

function setPageAfterSearch(){
    $('#acollapsiblelist').hide();
    $('#acollapsiblelist').empty();
};

function setPageAfterSearchCallback(){
    $('#acollapsiblelist').show();
}

function printResult(obj){
    // INICIALIZACE CONTROLLERU
    
    regCtrl('acollapsiblelist',
            2,
            ['ds:web_search_adresar_pda_json',
             'ds_par:&aparameters=code:'+$(obj).val(),
             'row_onclick:saveSearchText(this);',
             'field:partner',
             'callbackFce:setPageAfterSearchCallback()']);
    initDocs();
};

function saveSearchText(obj){
    var tmp = $(obj).next().val(); 
    nAjax('web_redir','&aparameters=akod_r:web_search_text_save_json&aparameters=spouzetelo:1&aparameters=code:'+tmp,function(data){});
}

function emailEnter(event, obj){
    if(event.keyCode == '13'){
      clearCallsStack();
      setPageAfterSearch();
      printResult(obj);
    }
}



// INICIALIZACE CONTROLLERU

$(document).live('pageinit', function(event){
  regCtrl('aemail',1,['onkeypress:emailEnter(event, this)']);
  regCtrl('acollapsiblelist',2,['ds:web_last_search_json','ds_par:&aparameters=code:PDA_SEARCH','field:str']);
  initDocs();
});