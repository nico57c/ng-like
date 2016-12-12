function NglDirectives(nglModuleProto, moduleInstance){

    nglModuleProto['directives'] = {
        // PROTOTYPE PART :
        instances: {},
        ngl_directives_instances: {},
        ngl_directives_declaration: [],
        ngl_controller_object: null,
        module: moduleInstance,
        name: null,
        ngl_directive: function(applyOn, once=false){
            var that = this;

            // DIRECTIVE BINDING
            that.ngl_directives_declaration.sort(function(a,b){
                return that.ngl_directives_instances[a].priority - that.ngl_directives_instances[b].priority;
            });

            var rootOptions = {};
            $(applyOn[0].attributes).each(function() { if(this.nodeName.indexOf('ngl-')>=0) rootOptions[this.nodeName] = this.nodeValue; });

            $.each(that.ngl_directives_declaration, function(index0, directiveName){
                var directive = that.ngl_directives_instances[directiveName];
                $.each(directive.selectOn.apply({
                        __controller: that.ngl_controller_object,
                        module: that.module,
                        directives: that,
                        currentDirective: directive
                    }, applyOn), function(key, elements) {
                        $(elements).each(function(index1, element){

                            var options = $.extend(true, {}, rootOptions);
                            $($(element)[0].attributes).each(function() { if(this.nodeName.indexOf('ngl-')>=0) options[this.nodeName] = this.nodeValue; });

                            that.module.scopes.contextEvents(once).register(key, Object.create({
                                __controller: $.extend(true, {}, that.ngl_controller_object),
                                __parent: $(element).parent(),
                                __element: $(element),
                                __elementClone: $(element).clone(),
                                __template: $(element).html(),
                                __key: ''+key,
                                __options: options,
                                module: that.module,
                                directives: that,
                                run: function(){
                                    this.module.scopes.setControllerContext(this.__controller.name);
                                    directive.run.apply(this);
                                }
                            }), null);
                        });
                });
            });
        },
        // FACTORY PART :
        factory: function(name, directives, nglControllerObject){
            // CREATE INSTANCE FOR ROOT COMPONENT :
            if(this.instances[name]){
                return this.instances[name];
            }
            this.instances[name] = Object.create(this);
            this.instances[name].name = name;
            this.instances[name].ngl_controller_object = nglControllerObject;

            var that = this;
            if(directives){
                // UPDATE master directives :
                $.each(directives, function(key, className){
                    if(!$.inArray(that.ngl_directives_declaration, className)){
                        that.ngl_directives_declaration.push(className);
                    }
                });
                that.instances[name].ngl_directives_declaration = directives;
            } else {
                directives = that.ngl_directives_declaration;
            }

            // INIT DIRECTIVES on ROOT COMPONENT and new instance :
            $.each(directives, function(key, className){
                if(!that.ngl_directives_instances[className]){
                    that.ngl_directives_instances[className] = eval('new NglD' + className + '();');
                }
                that.instances[name].ngl_directives_instances[className] = that.ngl_directives_instances[className];
            });

            return this.instances[name];
        },
        prepareDirectives: function(options){
            var that = this.factory(options.controller.name,
                options.directives.length>0?options.directives:['Filter', 'Repeat', 'If', 'Bind', 'Class', 'Checked', 'Attr', 'Pattern'],
                options.controller);
            that.ngl_directive(options.controller.element);
        },
        init: function(nglModule, name){
            this.module = nglModule;
            this.name = name;
            this.module.events.register('controller.prepare', this.prepareDirectives, this);
        }
    };

    return 'directives';

}
