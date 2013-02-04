/*
Javascript classes - JQueryMobile objects, MVC model
*/
var callsStack = [];

function CallStack(aid, ads, afield, atype){
    this._id = aid;
    this._ds = ads;
    this._field = afield;
    this._type = atype;
}

function regCtrl(id, id_ctrl, metadata){
    if(id_ctrl == 1){ TextInputCtrl(id, metadata); } // input
}

function delmtr(){
    return ":";
}

function addToCalls(aid, ads, afield, atype){
    callsStack.push(new CallStack(aid, ads, afield, atype));
}

function getParams(){
    return "";
};

function setValue(id, v, type){
    $('#'+id).val(v);
}

function setAttribute(id, metadata){
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
        addToCalls(id, ds, field, 1);
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
        nAjax('web_redir?aparameters=akod_r:'+acall+'&aparameters=spouzetelo:1'+params, function(data){
            var data_fmt = $.parseJSON(data);
            var v = data_fmt[afield];
            setValue(aid, v, atype);
        });
    }
}

function TextInputCtrl(id, metadata){
    setAttribute(id, metadata);
}

function CollapsibleListCtrl(id, metadata){
    
}

function emailEnter(){
    alert('Event');
}

regCtrl('aemail',1,['onclick:test(this)','onkeypress:emailEnter(this)','ds:web_test_json','field:email']);
initDocs();
