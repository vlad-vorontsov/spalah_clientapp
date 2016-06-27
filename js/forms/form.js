/**
 * Created by vlad on 6/20/16.
 */

var extend = function(child, parent) {
    for (var key in parent) {
        if (parent.hasOwnProperty(key)) {
            child[key] = parent[key];
        }
    }

    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};


var Form = (function() {
    function Form() {
        this.errors = {};
        this.schema = {};
        this.values = {};
        this.validCallback = defaultValidCallBack.bind(this);
        this.invalidCallback = defaultInValidCallBack.bind(this);
    }

    Form.prototype.validate = function() {
        this.errors = {};

        for (var key in this.schema) {
            if (this.schema[key].required)
                validateRequired(key, this.values[key], this.errors);

            if (this.schema[key].pattern)
                validatePattern(key, this.values[key], this.schema[key].pattern, this.errors);

            if (this.schema[key].func)
                validateByFunc(key, this.schema[key].func, this.errors, this);

        }
    };

    Form.prototype.isValid = function() {
        this.validate();
        var result = Object.keys(this.errors).length == 0;
        this.validCallback();
        if (!result)
            this.invalidCallback();

        return result;
    };

    Form.prototype.setValues = function(obj) {
        this.values = obj;
    };

    var validateRequired = function(key, value, errors) {
        if (value == '' || value == null || value == undefined) {
            errors[key] = key + " is required.";
        }
    };

    var validatePattern = function(key, value, pattern, errors) {
        if (!pattern.test(value)) {
            if (!errors[key])
                errors[key] = key + " has invalid format.";
        }
    };

    var validateByFunc = function(key, func, errors, scope) {
        var result = func.call(scope);
        if (!result)
            errors[key] = key + " is invalid";
    };

    var defaultValidCallBack = function() {
        for (var key in this.values) {
            var element = document.getElementById(key);
            element.classList.remove('has-error');
            element.getElementsByClassName('help-text')[0].innerText = '';
        }
    }

    var defaultInValidCallBack = function() {
        for (var key in this.errors) {
            var element = document.getElementById(key);
            element.classList.add('has-error');
            element.getElementsByClassName('help-text')[0].innerText = this.errors[key];
        }
    }

    return Form;
})();

var SignUpForm = (function(superClass) {
    extend(SignUpForm, superClass);

    function SignUpForm() {
        SignUpForm.__super__.constructor.apply(this);

        this.schema = {
            email: {
                required: true,
                pattern: /^[\w\.]+@[a-z]+\.[a-z]+(\.[a-z]+)?$/
            },
            password: {
                required: true,
                pattern: /^[\w]{8,}$/
            },
            password_confirmation: {
                required: true,
                func: function() {
                    return this.values.password == this.values.password_confirmation;
                }
            }
        };
    }

    return SignUpForm;
})(Form);
