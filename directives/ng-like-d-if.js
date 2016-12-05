function NglDIf(){

};

NglDIf.prototype = {

    priority: 1,
    selectOn: function(applyOn){
        var that = this;
        var result = {};
        result[''+that.__controller.name] = [];
        $('[ngl-if]', applyOn).each(function(index, element){
            result[''+that.__controller.name].push(element);
        });
        if($(applyOn)[0].hasAttribute('ngl-if')) result[''+that.__controller.name].push(applyOn);
        return result;
    },
    run: function(){
        $(this.__element).removeAttr('ngl-if');
        if(this.module.scopes.execCmd(this.__elementClone.attr('ngl-if'))) {
            this.__element.show();
        } else {
            this.__element.hide();
        }
    }
};
