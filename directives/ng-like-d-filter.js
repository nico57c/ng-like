function NglDFilter(){

};

NglDFilter.prototype = {

    priority: -1,
    selectOn: function(applyOn){
        var result = {};
        $('[ngl-filter][ngl-filter-key]', applyOn).each(function(index, element){
            var key = $(element).attr('ngl-filter-key');
            if(result[key]){
                result[key].push(element);
            } else {
                result[key] = [element];
            }
        });
        if($(applyOn)[0].hasAttribute('ngl-filter') &&
           $(applyOn)[0].hasAttribute('ngl-filter-key')) {
            if(result[$(applyOn).attr('ngl-filter-key')]){
               result[$(applyOn).attr('ngl-filter-key')].push(applyOn);
            } else {
               result[$(applyOn).attr('ngl-filter-key')]= [applyOn];
            }
       }
       return result;
    },
    run: function(){
        $(this.__element).removeAttr('ngl-filter');
        $(this.__element).removeAttr('ngl-filter-key');
        if(this.module.scopes.has( this.__key )) {
            var array = this.module.scopes.get(this.__key);
            var testAttr = $(this.__elementClone).attr('ngl-filter');
            var res = [];
            for(var index in array){
                if(testAttr){
                    var test = this.module.scopes.execCmd(testAttr, array[index]);
                    var strict = $(this.__elementClone).attr('ngl-filter-strict');
                    if(typeof(test) === "boolean"){
                        if(test){
                            res[index] = array[index];
                        }
                    } else if(typeof(test) === "object") {
                        for(var i in array[index]){
                            if(test!==null){
                                if(test[i]!==undefined) {
                                    if(strict){
                                        if(test[i] == array[index][i]) res[index] = array[index];
                                    } else if((''+array[index][i]).toLowerCase().indexOf((''+test[i]).toLowerCase()) >= 0) {
                                        res[index] = array[index];
                                    } else {
                                        break;
                                    }
                                }
                            } else {
                                res[index] = array[index];
                            }
                        }
                    }
                } else {
                    res[index] = array[index];
                }
            }
            this.module.scopes.set($(this.__elementClone).attr('ngl-filter-key'), res);
        }
    }
};
