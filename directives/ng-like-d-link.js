function NglDLink(){

};

NglDLink.prototype = {

    priority: 2,
    selectOn: function(applyOn){
        var result = {};
        var key = this.__controller.name;
        $('[ngl-link]', applyOn).each(function(index, element){
            if(result[key]){
                result[key].push(element);
            } else {
                result[key] = [element];
            }
        });
        if($(applyOn)[0].hasAttribute('ngl-link')){
            if(result[key]){
                result[key].push(applyOn);
            } else {
                result[key] = [applyOn];
            }
        }
        return result;
    },
    run: function(){
        var module = this.module;
        $(this.__element).bind('click', function(){
            var select = cssclass = parent = null;
            if($(this).parents('[ngl-link-toggle-select]').length>0){
                select = $(this).parents('[ngl-link-toggle-select]').attr('ngl-link-toggle-select');
                parent = $(this).parents('[ngl-link-toggle-select]');
            }
            if($(this).parents('[ngl-link-toggle-class]').length>0){
                cssclass = $(this).parents('[ngl-link-toggle-class]').attr('ngl-link-toggle-class')
            }

            if(select != null && cssclass != null){
                $(parent).find(select).removeClass(cssclass);
                $(this).parent(select).addClass(cssclass);
            }
            module.events.trigger('ngl-router-link', $(this).attr('ngl-link'));
        });
    }
};
