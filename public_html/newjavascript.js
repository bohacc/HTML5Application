/*
Javascript classes - JQueryMobile objects, MVC model
*/

function regCtrl(id, id_ctrl, metadata){
    if(id_ctrl == 1){ TextInputCtrl(id, metadata); } // input
}

function delmtr(){
    return ":";
}

function addToArray(id, ds, field, type){
    
}

function regData(id, ds, field, type){
    addToArray(id, ds, field, type);
}

function getParams(){
    return "";
};

function setValue(id, v, type){
    $('#'+id).val(v);
}

function initDocs(){
    var params = getParams();
    var arr = getArray();
    for(var i=0;arr.length;i++){
        var tmp = arr[i];
        // rozsekat array zaznam na attr1 a attr2
        var call = "";
        var field = "";
        var id = "";
        var type = "";
        nAjax('web_redir?aparameters=akod_r:'+call+'&aparameters=spouzetelo:1'+params, function(data){
            var data_fmt = $.parseJSON(data);
            var v = field in data_fmt;
            setValue(id, v, type);
        });
    }
}

function TextInputCtrl(id, metadata){
    var del = delmtr();
    var field = null;
    var p = null;
    var v = null;
    var ds = null;
    var tmp = null;
    for(var i = 0; i < metadata.length; i++){
        tmp = metadata[i];
        p = tmp.substring(0, tmp.indexOf(del));
        v = tmp.substr(tmp.indexOf(del));
        if(p === "ds"){
            ds = v;
        }
        if(p === "field"){
            field = v;
        }
        $('#'+id).setAttribute(p, v);
    }
    if(ds !== null){
        regData(id, ds, field, 1);
    }
}

regCtrl('aemail',1,['onclick:test(this)','onkeypress:emailEnter(this)','ds:web_test_json','field:email']);
initDocs();