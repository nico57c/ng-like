function NglDRepeat(){

};

NglDRepeat.prototype = {

    priority: 0,
    selectOn: function(applyOn){
        var result = {};
        $('[ngl-repeat]', applyOn).each(function(index, element){
            var key = $(element).attr('ngl-repeat');
            if(result[key]){
                result[$(element).attr('ngl-repeat')].push(element);
            } else {
                result[$(element).attr('ngl-repeat')] = [element];
            }
        });
        return result;
    },
    run: function(){
        this.__parent.empty();
        var loopOn = this.module.scopes.get(this.__key);
        for (var index in loopOn) {
            //this.module.scopes.setControllerContext(this.__controller.name);
            var ngl__tmp = {__key: this.__key, __index: index };
            ngl__tmp[this.__options['ngl-key'] ? this.__options['ngl-key'] : 'key'] = index;
            ngl__tmp[this.__options['ngl-value'] ? this.__options['ngl-value'] : 'value'] = this.module.scopes.get(this.__key)[index];
            var item = this.__elementClone.clone();
            item.removeAttr('ngl-repeat');//.removeAttr('ngl-key').removeAttr('ngl-value');
            var tmpScope = this.module.scopes.setTmpContext(ngl__tmp);
            this.directives.ngl_directive(item, true);
            tmpScope.$apply();
            //this.module.scopes.$apply([this.__key]); // TmpScope only applied
            this.__parent.append(item);
        }
    }
};
