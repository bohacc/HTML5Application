/*
Javascript classes - JQueryMobile objects, MVC model
*/
var callsStack = [];

function CallStack(aid, ads, afield, atype, amulti){
    this._id = aid;
    this._ds = ads;
    this._field = afield;
    this._type = atype; // 1 row, 2 list
    this._multi = amulti;
}

function regCtrl(id, id_ctrl, metadata){
    if(id_ctrl == 1){ TextInputCtrl(id, metadata); } // input
    if(id_ctrl == 2){ CollapsibleListCtrl(id, metadata); } // input
}

function delmtr(){
    return ":";
}

function addToCalls(aid, ads, afield, atype, amulti){
    callsStack.push(new CallStack(aid, ads, afield, atype, amulti));
}

function getParams(){
    return "";
};

function setValue(id, v, type){
    if(type == 1){
        $('#'+id).val(v);
    }
    if(type == 2){
        $('#'+id).append('<p>'+v+'</p>');
    }
}

function setAttribute(id, metadata, type, multi){
    var del = delmtr();
    var field = null;
    var p = null;
    var v = null;
    var ds = null;
    var tmp = null;    
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
        $('#'+id).attr(p, v);
    }
    if(ds !== null){
        addToCalls(id, ds, field, type, multi);
    }    
}

function initDocs(){
    var params = getParams();
    var arr = callsStack;
    for(var i=0;i<arr.length;i++){
        var tmp = arr[i];
        // rozsekat array zaznam na attr1 a attr2
        var acall = tmp._ds;
        var afield = tmp._field;
        var aid = tmp._id;
        var atype = tmp._type;
        var amulti = tmp._multi;
        nAjax('web_redir?aparameters=akod_r:'+acall+'&aparameters=spouzetelo:1'+params, function(data){
            var data_fmt = $.parseJSON(data);
            switch(amulti){
                case 1: 
                    var v = data_fmt[afield];
                    setValue(aid, v, atype);
                    break;
                case 2:
                    for (var i=0;i<data_fmt.length;i++){
                        var tmp = data_fmt[i];
                        var v = tmp[afield];
                        setValue(aid, v, atype);
                    }
                    break;
            }
        });
    }
}

function TextInputCtrl(id, metadata){
    setAttribute(id, metadata, 1, 1);
}

function CollapsibleListCtrl(id, metadata){
    setAttribute(id, metadata, 2, 2);
}

function emailEnter(){
    alert('Event');
}

regCtrl('aemail',1,['onclick:test(this)','onkeypress:emailEnter(this)','ds:web_test_json','field:email']);
regCtrl('acollapsiblelist',2,['ds:web_test_json','field:popis']);
initDocs();
