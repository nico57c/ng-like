function NglDChecked(){

};

NglDChecked.prototype = {

    priority: 2,
    selectOn: function(applyOn){
        var that = this;
        var result = {};
        result[''+that.__controller.name] = [];
        $('[ngl-checked]', applyOn).each(function(index, element){
            result[''+that.__controller.name].push(element);
        });
        if($(applyOn)[0].hasAttribute('ngl-checked')) result[''+that.__controller.name].push(applyOn);
        return result;
    },
    run: function(){
        $(this.__element).removeAttr('ngl-checked');
        if(this.module.scopes.execCmd(this.__elementClone.attr('ngl-checked'))) {
            this.__element.prop('checked', true);
        } else {
            this.__element.prop('checked', false);
        }
    }
};
