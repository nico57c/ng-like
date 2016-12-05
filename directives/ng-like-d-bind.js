function NglDBind(){

};

NglDBind.prototype = {

    priority: 2,
    selectOn: function(applyOn){
        var result = {};
        $('[ngl-bind]', applyOn).each(function(index, element){
            var key = $(element)[0].hasAttribute('ngl-bind-key')?$(element).attr('ngl-bind-key'):$(element).attr('ngl-bind');
            if(result[key]){
                result[key].push(element);
            } else {
                result[key] = [element];
            }
        });
        if($(applyOn)[0].hasAttribute('ngl-bind')){
            var key = $(applyOn)[0].hasAttribute('ngl-bind-key')?$(applyOn).attr('ngl-bind-key'):$(applyOn).attr('ngl-bind');
            if(result[key]){
                result[key].push(applyOn);
            } else {
                result[key] = [applyOn];
            }
        }
        return result;
    },
    run: function(){
        if(this.module.scopes.has( $(this.__elementClone).attr('ngl-bind') )) {
            this.__element.text( this.module.scopes.get( $(this.__elementClone).attr('ngl-bind') ) );
        } else {
            this.__element.text( this.module.scopes.execCmd($(this.__elementClone).attr('ngl-bind')) );
        }
        $(this.__element).removeAttr('ngl-bind');
    }
};
