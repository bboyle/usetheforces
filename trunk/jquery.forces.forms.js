/**
 * jquery.forces.forms.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

(function($){

	var _tf_SUBMIT_TOLERANCE = 2000; // ms
	var _tf_SUBMIT_ERROR = "Unable to submit form";

// selectors
$.extend($.expr[':'], {
	// (use)theforces
	'-tf-blank': function(e) {
		var v = $(e).xfValue();
		return v == null || $.trim($(e).xfValue()).length == 0;
	},
	// xforms
	'-xf-alert': function(e) { 
		return $(e).hasClass('xf-alert'); 
	}, 
	'-xf-control': function(e) {
		return $(e).is('.xf-input,.xf-select1,.xf-select,.xf-secret,.xf-group');
	},
	'-xf-group': function(e) {
		return $(e).hasClass('xf-group');
	},
	'-xf-hint': function(e) {
		return $(e).hasClass('xf-hint');
	},
	'-xf-input': function(e) { 
		return $(e).hasClass('xf-input'); 
	},
	'-xf-invalid' : function(e) {
		return $(e)._valid() === false;
	},
	'-xf-label': function(e) { 
		return $(e).hasClass('xf-label'); 
	}, 
	'-xf-relevant': function(e) {
		return $(e).relevant();
	},
	'-xf-required': function(e) {
		return $(e).find('.required').size() > 0;
	},
	'-xf-secret': function(e) {
		return $(e).hasClass('xf-secret');
	},
	'-xf-select': function(e) {
		return $(e).hasClass('xf-select');
	},
	'-xf-select1': function(e) {
		return $(e).hasClass('xf-select1');
	},
	'-xf-valid': function(e) {
		return $(e)._valid() === true;
	}
	
});


// functions
$.fn.extend({


	// get/set valid
	_valid: function(isValid, alertMessage) {
		if (isValid == null) {
			return this.data('-tf-valid');
		}
		this.data('-tf-valid', isValid);
		if (isValid) {
			this.find(':-xf-alert').remove();
			this.removeClass('xf-invalid');
			this.addClass('xf-valid');
		} else {
			this.removeClass('xf-valid');
			this.addClass('xf-invalid');
			this.find(':-xf-label')
				.parent()
					.find(':-xf-alert')
						.remove()
					.end()
				.append('<em class="xf-alert">' + alertMessage + '</em>');
		}
		return isValid;
	},
	

	// get/set relevance
	relevant: function(expression) {
		// TODO do not recalculate if form has not changed (timestamp form changes?)
		var formControl = this.xFormControl();
		if (expression) {
			formControl.data('relevant', expression);
		} else {
			expression = formControl.data('relevant', expression) || true;
		}
		var relevant = true;
		if (typeof(expression) == "function") {
			relevant = expression(this);
		} else if (expression) {
			relevant = expression;
		}
		if (relevant != true) {
			formControl.hide();
			return false;
		}
		formControl.slideDown();
		return true;
	},
	
	
	// use validation
	useForcesValidation: function(enable) {
		var form = $(this).xForm();
		if (enable) {
			form.data('-tf-submit-error', enable);
		} else {
			form.removeData('-tf-submit-error');
		}
		return Boolean(enable);
	},
	
	
	// is control valid
	validate: function() {
		var control = this.xFormControl();
		if (control.is(':-tf-blank')) {
			if (control.is(':-xf-required')) {
				// blank + required = invalid
				// TODO required to a core constraint, so message can be easily customised
				return control._valid(false, 'must be completed');
			} else {
				// blank + not required = valid
				return control._valid(true);
			}
		// } else { TODO constraint validation			
		}
		return control._valid(true);
	},
	

	// get alert message text
	xfAlert: function() {
		return this.xFormControl().find(':-xf-alert').text();
	},


	// get form
    xForm: function() { 
        return this.hasClass('xform') ? this : this.parents('.xform'); 
    },


    // get form control
	xFormControl: function() {
		return this.is(':-xf-control') ? this : this.parents(':-xf-control').eq(0);
	},
	
	
	// get label text
	xfLabel: function() {
		return this.xFormControl().find(':-xf-label').text().replace(/[:?]$/, '');
	},


	// get value
	xfValue: function() {
		if (this.find(':text').length) {
			return this.find('input:text').val();
		} else if (this.find('select').length) {
			return this.find('select').val();
		} else if (this.find(':radio').length) {
			var checked = this.find(':radio:checked');
			return checked.length > 0 ? checked.val() : null;
		} else if (this.find(':checkbox').length) {
			var checked = this.find(':checkbox:checked');
			return checked.length > 0 ? checked.val() : null;
		}
		// TODO support textarea, password
		return null;
	}


});


// events
$('.xform form')


	// form control changed
	.bind('change -tf-change',function(eventObject, /* optional */ target) {
		console.log('change');
		var target = $(target||eventObject.target);
		target.validate();
		// evaluate relevance of all controls
		$(':-xf-control:-xf-relevant', target.xForm());
	})


	// keyup (early change detection)
	.keyup(function(eventObject){
		var formInput = $(eventObject.target);
		if (formInput.data('previousValue') != formInput.val()) {
			formInput.xForm().trigger('-tf-change',[formInput]).data('previousValue', formInput.val());
		}
	})


	// form was submitted
	.submit(function(eventObject) {
		console.log('submit');

		var now = new Date().getTime();
		var xform = $(eventObject.target).xForm();

		function cancel(xform) {
			// TODO shake button (negative feedback)
			xform.addClass('xf-submit-error');
			return false;
		}
		
		// suppress, if repeated submit within timeframe (milliseconds)
		if (xform.data('submitted') && now - xform.data('submitted') < _tf_SUBMIT_TOLERANCE) {
			console.log("multiple form submission detected: < ", _tf_SUBMIT_TOLERANCE, " ms since last submit");
			return cancel(xform);
		}
		xform.data('submitted', now);
	
		// get all relevant controls		
		var controls = $(':-xf-control:-xf-relevant', xform);
		// validate controls that have not been validated (i.e. never changed)
		controls.filter(':not(:-xf-valid):not(:-xf-invalid)').filter(function() {
			$(this).validate();
		});
		var invalid = controls.filter(':-xf-invalid');
		if (invalid.length > 0) {
			var status = xform.prev('.status');
			if (status.length == 1) {
				status.find('li').remove();
			} else {
				status = $('<div class="status alert"><h1>' + (xform.data('-tf-submit-error') || _tf_SUBMIT_ERROR) + '</h1><ol></ol></div>');
			}
			invalid.each(function() {
				var control = $(this);
				status.find('ol').append($('<li>' + control.xfLabel() + ': ' + control.xfAlert() + '</li>'));
			});
			xform.before(status);
			// TODO scrollTo/focus status
			return cancel(xform);
		}
		
		return true;
	});


// IE fixes
if ($.browser.msie) {
	// trigger change on radio buttons and checkboxes
	$(':radio,:checkbox').bind('click change', function(eventObject) {
		var formInput = $(eventObject.target);
		if (formInput.data('previousValue') != formInput.val()) {
			formInput.xForm().trigger('-tf-change',[formInput]).data('previousValue', formInput.val());
		}
	});
}


// TODO setup constraints
/*
$('form').constraint(':-xf-required', "must be completed", function(e) { return !$(e).is(':-tf-blank'); });
$('form').constraint('.xsd-date', "unrecognised date format", function(e) {
	try {
		new Date(e.xfValue());
	} catch (x) {
		return false;
	}
	return true;
});
*/
// turn on validation
// true (uses "Unable to submit form"), String (true, custom message), false = disable
$('form').useForcesValidation("Validation tests prevent submit");

})(jQuery);