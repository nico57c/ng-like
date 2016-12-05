function NglDClass(){

};

NglDClass.prototype = {

    priority: 2,
    selectOn: function(applyOn){
        var that = this;
        var result = {};
        result[''+that.__controller.name] = [];
        $('[ngl-class]', applyOn).each(function(index, element){
            result[''+that.__controller.name].push(element);
        });
        if($(applyOn)[0].hasAttribute('ngl-class')) result[''+that.__controller.name].push(applyOn);
        return result;
    },
    run: function(){
        $(this.__element).removeAttr('ngl-class');
        var classes = this.module.scopes.execCmd('(function(){ return ' + this.__elementClone.attr('ngl-class') + '; })');
        for(var className in classes){
            if(classes[className]===true && classes[className]!=undefined){
                this.__element.addClass(className);
            } else {
                this.__element.removeClass(className);
            }
        }
    }
};
