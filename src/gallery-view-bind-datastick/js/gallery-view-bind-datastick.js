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

        this.get('container').detach('stick' + (model ? ':' + model.cid : ''))
    },

    bindAttrs: function(optionalModel, optionalBindings) {
        var self = this,
            model = optionalModel || this.model,
            namespace = 'stick:' + model.cid,
            bindings = optionalBindings || this.bindings || {};

        if (!this._modelBindings) {
            this._modelBindings = [];
        }

        this.unbindAttrs(optionalModel);
    }
}

/* Utility functions */

var evaluatePath = function(obj, path) {

}

var applyViewFn = function(view, fn) {

}

var getSelectedOption = function($select) {

}

var evaluateBoolean = function(view, reference) {

}

var setAttr = function(model, attr, val, options, context, config) {

}

var getAttr = function(model, attr, config, context) {

}

var getConfiguration = function($el, binding) {

}

var initializeAttributes = function(view, $el, config, model, modelAttr) {

}

var initializeVisible = function(view, $el, config, model, modelAttr) {

}

var updateViewBindEl = function(view, $el, config, val, model, isInitializing) {

}

DataStick.addHandler([]);

Y.namespace('DataBind').Stick = DataStick;
