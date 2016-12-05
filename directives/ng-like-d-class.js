function NglDAttr(){

};

NglDAttr.prototype = {

    priority: 2,
    selectOn: function(applyOn){
        var that = this;
        var result = {};
        result[''+that.__controller.name] = [];
        $('[ngl-attr]', applyOn).each(function(index, element){
            result[''+that.__controller.name].push(element);
        });
        if($(applyOn)[0].hasAttribute('ngl-attr')) result[''+that.__controller.name].push(applyOn);
        return result;
    },
    run: function(){
        $(this.__element).removeAttr('ngl-attr');
        var attributes = this.module.scopes.execCmd('(function(){ return ' + this.__elementClone.attr('ngl-attr') + '; })');
        for(var attrName in attributes){
            if(attributes[attrName]!==null){
                this.__element.attr(attrName, attributes[attrName]);
            } else {
                this.__element.removeAttr(attrName);
            }
        }
    }
};
