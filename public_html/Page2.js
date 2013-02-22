/* Unit for init page 2
 * Author: Martin Boháč
 * Company: Notia
 */

// FUNCTION FOR CONTROLLERS
function getButton(data_type){
    var content = '<a href="#" data-inline="true" data-role="button">'+
                  '    <img src="web_get_img_data?aparameters=akod_obrazku:'+getPicture(data_type)+'" alt="'+getTitle(data_type)+'">'+
                  getTitle(data_type)+
                  '</a>';
    return content;
}

function setListviewFooterDataInsert(id, data, cs){
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
                    if(afield !== ""){
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
                content += getButton(d1);
            }
            if((v2 < 2) && (i === 1)){
                content += getButton(d2);
            }
            if((v3 < 2) && (i === 2)){
                content += getButton(d3);
            }
            if(content !== ""){
                alert('x');
                content = "<p>"+content+"</p>";
                $(current_obj).find('ul').append('<li data-icon="false">'+content+'</li>').trigger('create').listview("refresh");
                content = "";
            }
            
        }
    }
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
