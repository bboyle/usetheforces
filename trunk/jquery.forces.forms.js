/**
 * jquery.forces.forms.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

(function($){

	var _tf_SUBMIT_TOLERANCE = 2000; // ms
	var _tf_SUBMIT_ERROR = "Unable to submit form";
	var _tf_ALERT_REQUIRED = "must be completed";

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
		return $(e).is('.xf-input,.xf-select1,.xf-select,.xf-secret,.xf-textarea,.xf-group');
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
		return $(e).data('-tf-valid') === false;
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
	'-xf-select1': function(e) {
		return $(e).hasClass('xf-textarea');
	},
	'-xf-valid': function(e) {
		return $(e).data('-tf-valid') === true;
	}
	
});


// functions
$.fn.extend({


	// set contraints
	constraint: function(selector, alertMessage, test) {
		var form = $(this).xForm();

		if (form.data('constraints') == null) form.data('constraints', []);
		
		form.data('constraints').push({
			selector: selector,
			alertMessage: alertMessage,
			test: test
		});

		return this;
	},
	

    // get form
    form: function() {
    	return this.is('form') ? this : this.parents('form');
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
		// set valid state
		function _valid(isValid, alertMessage) {
			control.data('-tf-valid', isValid);
			if (isValid) {
				control.find(':-xf-alert').remove();
				control.removeClass('xf-invalid');
				control.addClass('xf-valid');
			} else {
				control.removeClass('xf-valid');
				control.addClass('xf-invalid');
				control.find(':-xf-label')
					.parent()
						.find(':-xf-alert')
							.remove()
						.end()
					.append('<em class="xf-alert">' + alertMessage + '</em>');
			}
			return isValid;
		}
	
		if (control.is(':-tf-blank')) {
			if (control.is(':-xf-required')) {
				// blank + required = invalid
				// TODO required to a core constraint, so message can be easily customised
				return _valid(false, _tf_ALERT_REQUIRED);
			} else {
				// blank + not required = valid
				return _valid(true);
			}
		} else {
			var constraints = control.xForm().data('constraints') || [];
			for (var i = 0; i < constraints.length; i++) {
				if (control.is(constraints[i].selector) && constraints[i].test(control) == false) {
					return _valid(false, constraints[i].alertMessage)
				}
			}
		}
		return _valid(true);
	},
	

	// get alert message text
	xfAlert: function() {
		return this.xFormControl().find(':-xf-alert').text();
	},


	// get xform
	// TODO define "xform" as an "article" container for the form
	// is "xform" the best terminology?
    xForm: function() { 
        return this.hasClass('xform') ? this : this.parents('.xform'); 
    },
    

    // get form control
	xFormControl: function() {
		return this.is(':-xf-control') ? this : this.parents(':-xf-control').eq(0);
	},
	
	
	// get/set label
	xfLabel: function(label, labelSeparator) {
		var xfLabel = this.xFormControl().find(':-xf-label');

		if (label) {
			if (labelSeparator == null) {
				var m = new RegExp('([:?]+)$').exec(xfLabel.text());
				labelSeparator = m ? m[1] : '';
			}
			xfLabel.html(label + labelSeparator);
		}

 		return xfLabel;
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
$('form')
	.change(function() {
		console.log('form.change');
	})

	// form control changed
	.bind('change -tf-change',function(eventObject, /* optional */ target) {
		console.log('change');
		var target = $(target||eventObject.target);
		target.validate();
		// evaluate relevance of all controls
		$(':-xf-control:-xf-relevant', target.xForm());
	})


	// form was submitted
	.submit(function(eventObject) {
		console.log('submit');

		var now = new Date().getTime();
		var xform = $(eventObject.target).xForm();

		function _cancel(xform) {
			// TODO shake button (negative feedback)
			xform.addClass('xf-submit-error');
			return false;
		}
		
		// suppress, if repeated submit within timeframe (milliseconds)
		if (xform.data('submitted') && now - xform.data('submitted') < _tf_SUBMIT_TOLERANCE) {
			console.log("multiple form submission detected: < ", _tf_SUBMIT_TOLERANCE, " ms since last submit");
			return _cancel(xform);
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
				status.find('ol').append($('<li><a href="#' + control.find('*[id]').attr('id') + '">' + control.xfLabel().text().replace(/([:?]*)$/, ': ') + control.xfAlert() + '</a></li>'));
			});
			xform.before(status);
			// TODO scrollTo/focus status
			return _cancel(xform);
		}
		return true;
	});


// keyup early change trigger
$(':text,:password,textarea')
	// keyup (early change detection)
	.keyup(function(eventObject){
		var formInput = $(eventObject.target);
		var control = formInput.xFormControl();
		var val = control.xfValue();
		if (control.data('previousValue') != val) {
			control.data('previousValue', val);
			control.form().trigger('-tf-change',[formInput]);
		}
	});


// IE
if ($.browser.msie) {
	// trigger change on radio buttons and checkboxes
	$(':radio,:checkbox').click(function(eventObject) {
		var formInput = $(eventObject.target);
		var control = formInput.xFormControl();
		var val = control.xfValue();
		if (control.data('previousValue') != val) {
			control.data('previousValue', val);
			control.form().trigger('-tf-change',[formInput]);
		}
	});
}

})(jQuery);





// default constraints
// TODO will this work when multiple forms are in the page?
$('form').constraint('.xsd-date', "unrecognised date format", function(e) {
	var d = e.xfValue().split(/\D/);
	if (d.length == 3 && d.join('').match(/^\d{4,8}$/)) {
		var date = new Date(d[2], d[1]-1, d[0]);
		return date.getMonth()+1 == d[1] && date.getDate() == d[0] && (date.getFullYear() == d[2] || date.getYear() == d[2]);
	}
	return false;
});


// turn on validation
// TODO selector becomes the forcesContainer element?
$('form').useForcesValidation("Validation tests prevent submit");
