function NglDPattern(){

};

NglDPattern.prototype = {

    priority: 2,
    selectOn: function(applyOn){
        var result = {};
        var that = this;
        $('[ngl-pattern]', applyOn).each(function(index, element){
            if(result[that.__controller.name]){
                result[that.__controller.name].push(element);
            } else {
                result[that.__controller.name] = [element];
            }
        });
        if($(applyOn)[0].hasAttribute('ngl-pattern')){
            if(result[that.__controller.name]){
                result[that.__controller.name].push(applyOn);
            } else {
                result[that.__controller.name] = [applyOn];
            }
        }
        return result;
    },
    run: function(){
        $(this.__element).removeAttr('ngl-pattern');
        $(this.__element).removeAttr('ngl-pattern-key');
        var tobevalidated = $(this.__element).val();
        var regexp = new RegExp(this.module.scopes.execCmd($(this.__elementClone).attr('ngl-pattern')), 'gi');

        if($(this.__elementClone)[0].hasAttribute('ngl-pattern-key')){
            if(tobevalidated.match(regexp)) {
                return this.module.scopes.set($(this.__elementClone).attr('ngl-pattern-key'), true);
            } else {
                return this.module.scopes.set($(this.__elementClone).attr('ngl-pattern-key'), false);
            }
        } else {
            if(tobevalidated.match(regexp)) {
                return this.module.scopes.set($(this.__element).attr('name')+'_valid', true);
            } else{
                return this.module.scopes.set($(this.__element).attr('name')+'_valid', false);
            }
        }
    }
};
