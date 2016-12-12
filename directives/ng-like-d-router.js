function NglDRouter(){

};
// This directive is an 'autorun'...
NglDRouter.prototype = {

    priority: -1,
    selectOn: function(applyOn){
        var res = $('[ngl-router]', applyOn).length>0?$('[ngl-router]', applyOn)[0]:false;
        if(res!==false && $(applyOn)[0].hasAttribute('ngl-router')){
            res = applyOn;
        }
        if(res){
            this.__element = res;
            this.currentDirective.run.apply(this);
        }
        return [];
    },
    run: function(){
        this.module.events.trigger('ngl-router-init', this.__element);
        var module = this.module;
        this.module.events.register('ngl-router-link', function(url){
            module.router.naviguate(url);
        });
        //$(this.__element).removeAttr('ngl-router');
    }
};
