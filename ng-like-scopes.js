function NglScopes(nglModuleProto, moduleInstance){

    nglModuleProto['scopes'] = {
        module: moduleInstance,
        name: null,
        ngl_context: {
            current: 'default'
        },
        ngl_scopes: {},
        ngl_scope_init: function(){
            var res = [];
            for(var index in this.contextScopesList()){
                if(undefined===this.ngl_scopes[this.contextScopesList()[index]]){
                    this.ngl_scopes[this.contextScopesList()[index]] = {
                        __ngl_name:this.contextScopesList()[index], // == name of scope in scopes applies to controller
                        __ngl_context_name:this.contextName(),  // == controller name
                        __ngl_index: index,
                        __ngl_applyTo: [],
                        __ngl_events: this.contextEvents(),
                        $apply: function(notKeys){
                            this.__ngl_events.trigger(this.__ngl_name);
                            this.__ngl_events.trigger(this.__ngl_context_name);
                            notKeys = notKeys!==undefined?notKeys:[];
                            notKeys.push('$apply');
                            notKeys.push('__ngl_');
                            for(var varName in this){
                                var test = true;
                                for(var notIndex in notKeys){
                                    if(varName.indexOf(notKeys[notIndex])>=0){
                                        test = false;
                                        break;
                                    }
                                }
                                if(test) this.__ngl_events.trigger(varName);
                            }
                        }
                    };
                }
                res.push(this.ngl_scopes[this.contextScopesList()[index]]);
            }
            return res;
        },
        setVariablesTo: function(object){
            for(var indexName in this.contextScopesList()){
                var scopeName = this.contextScopesList()[indexName];
                for(var varName in this.ngl_scopes[scopeName]){
                    if(varName.indexOf('__ngl_')<0 && varName.indexOf('$apply')<0){
                        object[varName] = this.ngl_scopes[scopeName][varName];
                    }
                }
            }
        },
        execCmd: function(command, applyTo){
            var scope = this;
            var fct = function(){
                scope.setVariablesTo(this);
                var result = eval(command);
                if(typeof result == 'function'){
                    return result.apply(this);
                } else {
                    return result;
                }
            }
            var res =  fct.apply(applyTo?applyTo:{});
            delete fct;
            return res;
        },
        contextEvents: function(once=false) {
            if(!once){
                return this.ngl_context[this.ngl_context.current].events;
            } else {
                return this.ngl_context[this.ngl_context.current].events_once;
            }
        },
        contextScopesList: function(add){
            if(!add){
                return this.ngl_context[this.ngl_context.current].scopesList;
            } else {
                this.ngl_context[this.ngl_context.current].scopesList.push(add);
                $.unique(this.ngl_context[this.ngl_context.current].scopesList);
                return this.ngl_context[this.ngl_context.current].scopesList;
            }
        },
        contextName: function(){
            return this.ngl_context.current;
        },
        setControllerContext: function(controllerName, scopesList){
            if(controllerName==null){
                this.ngl_context.current = 'default';
            } else if(this.ngl_context[controllerName] != null) {
                this.ngl_context.current = controllerName;
                if(scopesList){
                    this.ngl_context[controllerName].scopesList = scopesList;
                }
            } else {
                this.ngl_context[controllerName] = {
                    events: this.module.createComponentInstance('events'),
                    events_once: this.module.createComponentInstance('events'),
                    scopesList: scopesList,
                }
                this.ngl_context.current = controllerName;
            }
            return this;
        },
        setTmpContext: function(ngl__tmp){
            this.contextScopesList('__tmp');

            // Set new events_once :
            this.ngl_context[this.contextName()].events_once = this.module.createComponentInstance('events');

            this.ngl_scopes['__tmp'] = {
                __ngl_name: '__tmp',
                __ngl_context_name: this.contextName(),
                __ngl_index: this.ngl_scopes.length-1,
                __ngl_applyTo: [],
                __ngl_events: this.contextEvents(true),
                $apply: function(notKeys){
                    this.__ngl_events.trigger(this.__ngl_context_name);
                    notKeys = notKeys!==undefined?notKeys:[];
                    notKeys.push('$apply');
                    notKeys.push('__ngl_');
                    for(var varName in this){
                        var test = true;
                        for(var notIndex in notKeys){
                            if(varName.indexOf(notKeys[notIndex])>=0){
                                test = false;
                                break;
                            }
                        }
                        if(test){
                            this.__ngl_events.trigger(varName);
                        }
                    }
                }
            };

            for(var key in ngl__tmp){
                this.ngl_scopes['__tmp'][key] = ngl__tmp[key];
            }

            return this.ngl_scopes['__tmp'];
        },
        $apply: function(notKeys){
            var scopesList = this.contextScopesList();
            for(var index in scopesList){
                if(undefined!==this.ngl_scopes[scopesList[index]]){
                    this.ngl_scopes[scopesList[index]].$apply(notKeys);
                }
            }
        },
        has: function(varNameGet){
            var scopesList = this.contextScopesList();
            for(var indexName in scopesList){
                var scopeName = scopesList[indexName];
                for(var varName in this.ngl_scopes[scopeName]){
                    if(varName.indexOf('__ngl_')<0 && varNameGet == varName){
                        return true;
                    }
                }
            }
            return false;
        },
        get: function(varNameGet){
            var scopesList = this.contextScopesList();
            for(var indexName in scopesList){
                var scopeName = scopesList[indexName];
                for(var varName in this.ngl_scopes[scopeName]){
                    if(varName.indexOf('__ngl_')<0 && varNameGet == varName){
                        return this.ngl_scopes[scopeName][varName];
                    }
                }
            }
            return undefined;
        },
        set: function(varNameSet, value){
            var scopesList = this.contextScopesList();
            for(var indexName in scopesList){
                var scopeName = scopesList[indexName];
                for(var varName in this.ngl_scopes[scopeName]){
                    if(varName.indexOf('__ngl_')<0 && varNameSet == varName){
                        this.ngl_scopes[scopeName][varName] = value;
                    }
                }
            }
        },
        init: function(nglModule, name){
            this.module = nglModule;
            this.name = name;
            this.setControllerContext('default');
        }
    };

    return 'scopes';

};
