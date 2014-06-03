Template.Forms.events({
	"submit #form1": function(e, t) {
		var form = e.currentTarget;

		var rules = {
			name: {
				required: true,
				minLength: 3
			}, 
			price: {
				required: true,
				positiveNumber: true
			}
		};

		var values = Forms.validateForm(form, rules);
		if(values) {
			console.log(values);
			alert("Yahooo! Form input is valid!");
		} else {
			// errors - but that is already shown to user...
		}

		return false;
	},

	"submit #form2": function(e, t) {
		var form = e.currentTarget;

		var rules = {
			name: {
				required: true,
				minLength: 3
			}, 
			price: {
				required: true,
				positiveNumber: true
			}
		};

		var values = Forms.validateForm(form, rules);
		if(values) {
			console.log(values);
			alert("Yahooo! Form input is valid!");
		} else {
			// errors - but that is already shown to user...
		}

		return false;
	}
});


Template.Forms.helpers({
});
