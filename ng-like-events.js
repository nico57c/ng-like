function NglEvents(nglModuleProto, moduleInstance){

    nglModuleProto['events'] = {
        module: null,
        name: null,
        _handlers: null,
        trigger: function(eventName, options){
            if(undefined!==this._handlers[eventName]){
                for(var index=0;index<this._handlers[eventName].length;index++){
                    if(this._handlers[eventName] && this._handlers[eventName][index])
                        if(typeof this._handlers[eventName][index][0] == 'object'){
                            if(null!==this._handlers[eventName][index][1]){
                                this._handlers[eventName][index][0].run.apply(this._handlers[eventName][index][1], [options]);
                            } else {
                                this._handlers[eventName][index][0].run(options);
                            }
                        } else {
                            if(null!==this._handlers[eventName][index][1]){
                                this._handlers[eventName][index][0].apply(this._handlers[eventName][index][1], [options]);
                            } else {
                                this._handlers[eventName][index][0](options);
                            }
                        }
                }
            }
        },
        register: function(eventName, event, applyTo){
            if(undefined===this._handlers[eventName]){
                this._handlers[eventName] = [];
            }
            this._handlers[eventName].push([event, applyTo]);
            return this._handlers[eventName].length-1;
        },
        unregister: function(eventName, index){
            if(undefined === index){
                delete this._handlers[eventName][index];
            } else {
                delete this._handlers[eventName];
            }
        },
        init: function(nglModule, name){
            this.module = nglModule;
            this.name = name;
            this._handlers = [];
        }
    };

    return 'events';
};
