Form validation
===============

Simple form validation (see forms.js). Live example here: [http://form-validation.meteor.com](http://form-validation.meteor.com)

Usage
-----

For each input field add element with class `error-fieldname`. For `<input name="price">` add `<span class="error-price help-block"></span>`

Example:

  <form id="form1" class="form">
    <div class="form-group">
      <input name="name" placeholder="Name" class="form-control input-sm"/>
      <span class="error-name help-block"></span>
    </div>
  
    <div class="form-group">
      <input name="price" placeholder="Price Per Serving" class="form-control input-sm"/>
      <span class="error-price help-block"></span>
    </div>
  
    <button type="submit" class="btn btn-primary btn-sm">
      <span class="fa fa-check"></span> Save
    </button>
    <button type="button" class="btn btn-link btn-sm form2-category-cancel">Cancel</button>
  </form>

Or, add single element with `class="error-box"` into form.

Example:

  <form id="form2" class="form-inline">
    <div class="error-box alert alert-warning" style="display: none;"></div>
  
    <input name="name" placeholder="Name" class="form-control input-sm"/>
    <input name="price" placeholder="Price Per Serving" class="form-control input-sm"/>
  
    <button type="submit" class="btn btn-primary btn-sm">
      <span class="fa fa-check"></span> Save
    </button>
    <button type="button" class="btn btn-link btn-sm form2-cancel">Cancel</button>
  </form>


Submit code:

  "submit #form1": function(e, t) {
  	var form = e.currentTarget;
  
    // validation rules
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
  		// success! Write values into database
  		console.log(values);
  		alert("Yahooo! Form input is valid!");
  	} else {
  		// errors - but that is already shown to user...
  	}
  
  	return false;
  }

That's it. :)
