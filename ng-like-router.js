function NglRouter(nglModuleProto, moduleInstance){

    nglModuleProto['router'] = {
        module: null,
        urlsMapping: {},
        execAction: function(url, args){
            if(this.urlsMapping[url]){
                var dispatch = this.urlsMapping[url];
                this.module.scopes.setControllerContext(dispatch.controller.name);
                if(this.module.scopes.has(dispatch.controller.action)){
                    this.module.scopes.execCmd(this.module.scopes.get(dispatch.controller.action),
                        { router: {link: url, args: args, mapping: this.urlsMapping } });
                } else if($.inArray(dispatch.controller.action, ["toggle"]) !== -1){
                    switch(dispatch.controller.action){
                        case "toggle":
                            $(dispatch.controller.toggle_select).hide();
                            $(this.module.getControllerElement(dispatch.controller.name)).show();
                        break;
                    }
                } else {
                    this.error(500, [url, args]);
                    return false;
                }
            } else {
                this.error(404, [url, args]);
                return false;
            }
        },
        mapping: function(mapping){
            this.urlsMapping = mapping;
        },
        naviguate: function(url){
            if(this.urlsMapping[url]) this.execAction(url, this.urlsMapping[url]);
            else this.error(404, url);
        },
        error: function(code, trace){
            if(this.urlsMapping['error' + code]){ // infinite loop no thank's
                this.execAction('error' + code);
            } else {
                console.error('NglRouter ' + code, trace);
            }
        },
        // FACTORY PART :
        init: function(nglModule){
            this.module = nglModule;
            return this;
        }
    };

    return 'router';
};
