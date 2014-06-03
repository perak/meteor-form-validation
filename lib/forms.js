Forms = {};

function isBlank(val){
    return val == "" && val !== false;
}

var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    , urlRegex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

var Validations = {
    required: function(val, options, values, fieldName){
        if(val == false){
            this.errors(fieldName + ' is required.')
        }
    }
    , number: function(val, options, values, fieldName){
        if(!_.isFinite(val)){
            this.errors(fieldName + ' must be a number.')
        }
    }
    , minLength: function(val, length, values, fieldName){
        if(!_.isString(val) || val.length < length){
            this.errors(fieldName + ' must be at least ' + length + ' characters.')
        }
    }
    , maxLength: function(val, length, values, fieldName){
        if(!_.isString(val) || val.length > length){
            this.errors(fieldName + ' must be ' + length + ' characters or less.')
        }
    }
    , isOneOf: function(val, options, values, fieldName){
        if(!_.contains(options, val)){
            this.errors(fieldName + ' must be one of ' + options.join(' '));
        }
    }
    , usPhoneNumber: function(val, options, values, fieldName){
        val = val.replace(/[^0-9]/g, '');
        if(val.length !== 10){
            this.errors(fieldName + ' must be a valid phone number.');
        }
    }
    , positiveNumber: function(val, options, values, fieldName){
        val = Number(val);
        if(val <= 0 || !_.isFinite(val)){
            this.errors(fieldName + ' must be a positive number.');
        }
    }
    , negativeNumber: function(val, options, values, fieldName){
        val = Number(val);
        if(val >= 0 || !_.isFinite(val)){
            this.errors(fieldName + ' must be a negative number.');
        }
    }
    , email: function(val, options, values, fieldName){
        if(!emailRegex.test(val) || val.indexOf('@') > val.indexOf('.')){
            this.errors(fieldName + 'must be a valid email address.');
        }
    }
    , url: function(val, options, values, fieldName){
        if(!url.test(value)){
            this.errors(fieldName + 'must be a valid url.');
        }
    }
};

Forms.data = function(form){
    var data = _.reduce($(form).serializeArray(), function(memo, item){
    	if(memo[item.name]){
    		// we previously have a value for this name
    		if(!_.isArray(memo[item.name])){
    			// if it's not already an array, make an array for this set of values
    			// for the same name
    			memo[item.name] = [memo[item.name]];
    		}
    		memo[item.name].push(item.value);
    	}else{
    		// saving a new value
    		memo[item.name] = item.value;
    	}
        return memo;
    }, {});
    return data;
};

Forms.validate = function(values, rules){
	
    var errors = new Meteor.Collection(null);
    _.each(rules, function(fieldRules, fieldName){
        var valueUnderTest = values[fieldName];
        _.each(fieldRules, function(ruleOptions, ruleName){
            if(Validations[ruleName]){
                Validations[ruleName].call({errors: function(msg){
                    errors.insert({ field: fieldName, error: msg });
                }}, valueUnderTest, ruleOptions, values, fieldName);
            }else if(_.isFunction(ruleOptions)){
                ruleOptions.call({errors: function(msg){
                    errors.insert({ field: fieldName, error: msg });
                }}, valueUnderTest, ruleOptions, values, fieldName);
            }else{
                console.error(ruleName + ' is not a known validator or a custom function for field ' + fieldName + ' with value ' + valueUnderTest);
            }
        });
    });
    return errors;
};

Forms.isValid = function(values, rules){
    return Forms.validate(values, rules).find().count() === 0;
};

Forms.clearErrors = function(form) {
	// clear error messages
	var errorBox = $(form).find(".error-box");
	if(errorBox.length) errorBox.html("");

	$(form).find("input,select,textarea").each(function() {
		var inputGroup = $(this).parent(".input-group,.form-group");
		if(inputGroup.length) inputGroup.removeClass("has-error");

		var errorLabel = $(this).parent().find(".error-" + $(this).attr("name"));
		if(errorLabel.length) errorLabel.text("");
	});
}

Forms.validateForm = function(form, rules, successCb, errorCb) {
	var values = Forms.data(form);
	var errors = Forms.validate(values, rules).find().fetch();
	var errorBox = $(form).find(".error-box");
	errorBox = errorBox.length ? errorBox : null;

	Forms.clearErrors(form);

	if(errors.length) {

		var firstErrorFocused = false;

		_.each(errors, function(e) {
			var input = $(form).find("input[name='" + e.field + "'],select[name='" + e.field + "'],textarea[name='" + e.field + "']");
			input = input.length ? input : null;

			if(input) {
				// mark input group
				var inputGroup = input.parent(".input-group,.form-group");
				if(inputGroup.length) inputGroup.addClass("has-error");

				// show error label
				var errorLabel = input.parent().find(".error-" + e.field);
				if(errorLabel.length) errorLabel.text(errorLabel.text() + " " + e.error);

				if(!firstErrorFocused) {
					input.focus();
					firstErrorFocused = true;
				}
			}

			if(errorBox) {
				var ul = errorBox.find("ul");
				if(!ul.length) {
					$("<ul>").appendTo(errorBox);
					ul = errorBox.find("ul");
				}

				$("<li>", { text: e.error }).appendTo(ul);
			}
		});

		if(errorBox) errorBox.show();
		
		if(errorCb) errorCb(errors);

		return null;
	}

	if(errorBox) errorBox.hide();

	if(successCb) successCb(values);

	return values;
}
