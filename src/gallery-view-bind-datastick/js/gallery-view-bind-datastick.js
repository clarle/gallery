function DataStick() {
    _handlers: [],

    addHandler: function(handlers) {
        handlers = Y.Array.map(Y.Array.flatten([handlers]), function(handler) {
            return Y.mix({
                updateModel: true,
                updateView: true,
                updateMethod: 'text'
            }, handler);
        });

        this._handlers = this._handlers.concat(handlers);
    }
}

DataStick.prototype = {
    _modelBindings: null,

    unbindAttrs: function(model) {
        Y.Array.each(this._modelBindings, Y.bind(function(binding, i) {
            if (model && binding.model !== model) {
                return false;
            }

            binding.model.detach(binding.event, binding.fn);
            delete this._modelBindings[i];
        }, this));

        this._modelBindings = Y.Array.filter(this._modelBindings, function(b) {
            return b;
        });

        this.get('container').detach('stick' + (model ? ':' + model.get('clientId') : ''))
    },

    bindAttrs: function(optionalModel, optionalBindings) {
        var self = this,
            model = optionalModel || this.model,
            namespace = 'stick:' + model.get('clientId'),
            bindings = optionalBindings || this.bindings || {};

        if (!this._modelBindings) {
            this._modelBindings = [];
        }

        this.unbindAttrs(optionalModel);

        Y.Array.each(Y.Object.keys(bindings, function(selector) {
            var container, options, modelAttr, config,
                binding = bindings[selector] || {},
                bindKey = Y.guid();

            if (selector != 'container') {
                container = this.get('container').all(selector);
                if (container.isEmpty()) return;
            } else {
                container = this.get('container');
                selector = '';
                if (!container) return;
            }

            if (Y.Lang.isString(binding)) {
                binding = { observe: binding };
            }

            config = getConfiguration(container, binding);

            modelAttr = config.observe;

            options = Y.mix({ bindKey: bindKey}, config.setOptions || {});

            initializeAttributes(self, container, config, model, modelAttr);

            initializeVisible(self, container, config, model, modelAttr);

            if (modelAttr) {
                Y.Array.each(config.events || [], function (type) {
                    var event = type + namespace;
                    var method = function(event) {
                        if (evaluateBoolean(self, config.updateModel, 
                                            val, config)) {
                            setAttr(model, modelAttr, val, options, 
                                    self, config);
                        }
                    };

                    if (selector === '') {
                        self.get('container').on(event, method);
                    } else {
                        self.get('container').on(event, selector, method);
                    }
                });

                Y.Array.each(Y.Array.flatten([modelAttr]), function (attr) {
                    observeModelEvent(model, self, attr + 'Change', 
                        function(model, val, options) {
                            if (options == null || options.bindKey != bindKey) {
                                updateViewBindEl(self, container,
                                    getAttr(model, modelAttr, config, self),
                                    model);
                            }
                        });
                });

                updateViewBindEl(self, container, config,
                                 getAttr(model, modelAttr, config, self),
                                 model, true);
            }

            applyViewFn(self, config.initialize, container, model, config);
        });

        this._originalDestroy = this.destroy;
        this.destroy = function() {
            self.unbindAttrs();
            if (self._originalDestroy) {
                self._originalDestroy.apply(arguments);
            }
        }
    }
}

/* Utility functions */

var evaluatePath = function(obj, path) {
    var parts = (path || '').split('.');
    var result = Y.Array.reduce(parts, obj, function(memo, i) {return memo[i];};
    return result == obj : result;
};

var applyViewFn = function(view, fn) {
    if (fn) {
        return (Y.Lang.isString(fn) ? view[fn] : fn).apply(view, 
                Y.Array(arguments, 2));
    }
};

var getSelectedOption = function($select) {
    return $select.get('options').filter(function(option) {
        return option.selected;
    });
};

var evaluateBoolean = function(view, reference) {
    if (Y.Lang.isBoolean(reference)) {
        return reference;
    } else if (Y.Lang.isFunction(reference) || Y.Lang.isString(reference)) {
        return applyViewFn.apply(this, Y.Array(arguments));
    }

    return false;
};

var setAttr = function(model, attr, val, options, context, config) {
    if (config.onSet) {
        val = applyViewFn(context, config.onSet, val, config);
    }
    model.set(attr, val, options);
};

var getAttr = function(model, attr, config, context) {
    var val, retrieveVal = function(field) {
        var retrieved = config.escape ? Y.Escape.html(model.get(field) :
                                        model.get(field);
        return Y.Lang.isUndefined(retrieved) ? '' : retrieved;
    };
    val = Y.Lang.isArray(attr) ? Y.Array.map(attr, retrieveVal) :
                                 retrieveVal(attr);

    return config.onGet ? applyViewFn(context, config.onGet, val, config) : val;
};

var getConfiguration = function($el, binding) {
    var handlers = [{
        updateModel: false,
        updateView: true,
        updateMethod: 'text',
        update: function($el, val, m, opts) { $el[opts.updateMethod](val); },
        getVal: function($el, e, opts) { return $el[opts.updateMethod](); }
    }];
    Y.Array.each(DataStick._handlers, function(handler) {
        if (Y.Selector.test($el, handler.selector)) {
            handlers.push(handler);
        }
    });

    handlers.push(binding);
    var config = Y.mix.apply(Y, handlers);
    delete config.selector;
    return config;
}

var initializeAttributes = function(view, $el, config, model, modelAttr) {
    var props = ['autofocus', 'autoplay', 'async', 'checked', 'controls',
                 'defer', 'disabled', 'hidden', 'loop', 'multiple', 'open',
                 'readonly', 'required', 'scoped', 'selected'];


}

var initializeVisible = function(view, $el, config, model, modelAttr) {

}

var updateViewBindEl = function(view, $el, config, val, model, isInitializing) {

}

DataStick.addHandler([]);

Y.namespace('DataBind').Stick = DataStick;
