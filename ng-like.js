(function($) {
    $.fn.outerHTML = function() {
        return $('<div />').append(this.eq(0).clone()).html();
    };

    window.debugMode = false;

    Ngl = {
        // PROTOTYPE PART :
        ngl_module: {
            ngl_components: {},
            ngl_controller: function(controllerName, scopesList, controllerFct){
                var controllerImpls = $(this.module.element).find('[ngl-controller="' + controllerName + '"]');
                for(var index=0; index<controllerImpls.length; index++){

                    var ngl_controller_object = $.extend(true, {}, this.ngl_controller_object);
                    ngl_controller_object.controller.element = $(controllerImpls[index]);
                    ngl_controller_object.controller.name = controllerName;
                    ngl_controller_object.controller.scopesList = scopesList;

                    this.scopes.setControllerContext(controllerName, scopesList);
                    this.events.trigger('controller.prepare', ngl_controller_object );
                    this.events.trigger('controller.run', ngl_controller_object );
                    controllerFct.apply(ngl_controller_object, this.scopes.ngl_scope_init());
                    this.scopes.setControllerContext('default');
                }
                return this;
            },
            // ngl controller definition :
            ngl_controller_object: {
                $: $,
                module: {
                    element: null,
                    name: null
                },
                directives: [],
                controller: {
                    scopesList: null,
                    element: null,
                    name: null
                }
            },
            getControllerElement: function(controllerName){
                return $(this.module.element).find('[ngl-controller="' + controllerName + '"]');
            },
            getComponentInstance: function(componentName){
                if(undefined===this.ngl_components[componentName]){
                    Ngl.addComponents([componentName], this.prototype, this);
                }
                var componentInstance = Object.create(this.ngl_components[componentName]);
                componentInstance.init(this);
                return componentInstance;
            },
            createComponentInstance: function(componentName, name){
                var componentInstance = Object.create(this.ngl_components[componentName]);
                componentInstance.init(this, name);
                return componentInstance;
            }
        },
        // FACTORY PART :
        addDirectives: function(directivesNames, nglModulePrototype){
            nglModulePrototype.ngl_controller_object.directives = directivesNames;
        },
        // AddComponentsPrototype to module
        addComponents: function(componentsNames, nglModulePrototype, nglModuleInstance){
            var res = [];
            for(var index=0;index<componentsNames.length;index++){
                var component = eval(componentsNames[index]);
                res.push(component(nglModulePrototype.ngl_components, nglModuleInstance));
                if(undefined !== nglModulePrototype.ngl_controller_object &&
                   undefined === nglModulePrototype.ngl_controller_object[res[res.length-1]])
                    nglModulePrototype.ngl_controller_object[res[res.length-1]] = nglModulePrototype[res[res.length-1]];
            }
            return res;
        },
        // GetModuleInstance
        module: function(name){
            var name = name;
            var element = $('[ngl-module=' + name + ']');
            var nglModulePrototype = $.extend(true, {}, Ngl.ngl_module); // ngl_module is a prototype.
            nglModulePrototype.module = {
                element: element[0],
                name: name
            };

            // Add directives :
            Ngl.addDirectives(eval(element.attr('ngl-directives')), nglModulePrototype);

            // Add components to module :
            Ngl.addComponents(['NglEvents', 'NglScopes'], nglModulePrototype, undefined);
            var componentsClassNames = eval(element.attr('ngl-components'));
            var componentsNames = Ngl.addComponents(componentsClassNames, nglModulePrototype, undefined);

            var NglModule = Object.create(nglModulePrototype);
            NglModule['events'] = Object.create(NglModule.ngl_components['events']);
            NglModule['events'].init(NglModule);
            NglModule['scopes'] = Object.create(NglModule.ngl_components['scopes']);
            NglModule['scopes'].init(NglModule);
            for(var index=0;index<componentsNames.length;index++){
                NglModule[componentsNames[index]] = Object.create(NglModule.ngl_components[componentsNames[index]]);
                NglModule[componentsNames[index]].init(NglModule);
            }
            return NglModule;
        }
    };

})(jQuery);
