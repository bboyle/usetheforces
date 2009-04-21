/**
 * jquery.forms.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
	// (global) forces configuration
	var _tf_SUBMIT_TOLERANCE = 2000; // ms
	var _tf_SUBMIT_ERROR = "Unable to submit form";
	var _tf_ALERT_REQUIRED = "must be completed";
	var _tf_DATE_MONTHS = 'January February March April May June July August September October November December'.split(/ /);
	var _tf_DATE_WEEKDAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/ /);


(function($){

	// class names
	var CLASS_ALERT = 'xf-alert';
	var CLASS_INVALID = 'xf-invalid';
	var CLASS_VALID = 'xf-valid';

	// event types
	var EVENT_ENABLED = '-xf-enabled';
	var EVENT_DISABLED = '-xf-disabled';
	var EVENT_VALUE_CHANGED = '-xf-value-changed';

	// internal state data
	var DATA_CALCULATE_RELEVANT = '-tf-relevant';
	var DATA_CONSTRAINTS = '-xf-constraints';
	var DATA_RELEVANT = '-xf-reabled';
	var DATA_VALID = '-xf-valid';
	var DATA_MSG_ALERT = '-tf-submit-alert';


// selectors
$.extend($.expr[':'], {
	// (use)theforces
	'-tf-blank': function(e) {
		var v = $(e).xfValue();
		return v == null || $.trim(v).length == 0;
	},
	'-tf-date': function(e) {
		return $(e).is('.xsd-date');
	},
	// xforms
	'-xf-alert': function(e) { 
		return $(e).hasClass(CLASS_ALERT); 
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
		return $(e).data(DATA_VALID) === false;
	},
	'-xf-label': function(e) { 
		return $(e).hasClass('xf-label'); 
	}, 
	'-xf-relevant': function(e) {
		return $(e).data(DATA_RELEVANT) != false;
	},
	'-xf-required': function(e) {
		e = $(e);
		return e.find('.required').size() > 0 || (e.data('required') != null && e.data('required')(e));
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
	'-xf-textarea': function(e) {
		return $(e).hasClass('xf-textarea');
	},
	'-xf-valid': function(e) {
		return $(e).data(DATA_VALID) === true;
	}

});


// private utility functions
var _private = {
	pad: function(s, l, c) {
		s = String(s);
		while (s.length < l) s = String(c) + s;
		return s;
	},
	// date formats
	DD: function(date) {
		return this.pad(date.getDate(), 2, '0');
	},
	MM: function(date) {
		return this.pad(date.getMonth()+1, 2, '0');
	},
};


// format a date
$.forces_date_format = function(date, format) {
	return format
		.replace(/YYYY/, date.getFullYear())
		.replace(/MM/, _private.MM(date))
		.replace(/DD/, _private.DD(date))
		.replace(/%B/, _tf_DATE_MONTHS[date.getMonth()])
		.replace(/%A/, _tf_DATE_WEEKDAYS[date.getDay()]);
};


// parse a date
$.forces_date_parse = function(s) {
	// TODO - parse date
	return new Date();
};



// makes and returns date fields
$.fn.forces_form_dateField = function(format, output) {
	format = format || 'YYYY-MM-DD';
	
	console.log('dateField', this, format, output);
	return this.forces_xform_control().filter(function() {
		var e = $(this).find(':text');
		if (e.length == 1) {
			e = e.eq(0);
			var date = $.forces_date_parse(e.val());
			e.eq(0)
				.after('<input type="hidden" name="' + e.attr('name') + '" />')
				.removeAttr('name');
			if (output) {
				var output = $('<span class="xf-output"></span>');
				if (e.val()) {
					output.text(e.xfVal(), output);
				}
				e.after(output);
			}
		}		
		return false;
	});
};
	
	
// get form control element
$.fn.forces_xform_control = function() {
	return this.map(function() {
		var e = $(this);
		return (e.is(':-xf-control') ? e : e.parents(':-xf-control')).get(0);
	});
};


// legacy $ extensions
$.fn.extend({
	// set contraints
	constraint: function(selector, alertMessage, test) {
		var e = this.xForm();

		function _constraint(selector, alertMessage, test) {
			if (e.data(DATA_CONSTRAINTS) == null) e.data(DATA_CONSTRAINTS, []);
			e.data(DATA_CONSTRAINTS).push({
				selector: selector,
				alertMessage: alertMessage,
				test: test
			});
		}

		if (test == null) {
			this.each(function() {
				var id = $(this);
				id = id.attr('id') || id.forces_xform_control().find('*[id]').attr('id');
				_constraint('#' + id, selector, alertMessage);
			});
		} else {
			_constraint(selector, alertMessage, test);
		}

		return this;
	},


	// get form
	form: function() {
		return this.is('form') ? this : this.parents('form');
	},


	// recalculate controls within me
	recalculate: function() {
		return this.find(':-xf-control').relevant();
	},


	// get/set relevance
	// returns jQuery (filtered, relevant controls remain)
	relevant: function(expression) {
		function _enable(e, enabled) {
			if (enabled == false) {
				if (e.data(DATA_RELEVANT) != false) {
					e
					.hide()
					.trigger(EVENT_DISABLED)
					.add(e.find(':xf-control'))
					.data(DATA_RELEVANT, false)
					.find('input,select,textarea')
						.attr('disabled', 'disabled');
				}
				return false;
			} else {
				if (e.data(DATA_RELEVANT) != null) {
					e
					.slideDown()
					.trigger(EVENT_ENABLED)
					.add(e.find(':xf-control'))
					.removeData(DATA_RELEVANT)
					.find('input,select,textarea')
						.removeAttr('disabled');
				}
				return true;
			}
		}

		return this.forces_xform_control().filter(function() {
			var e = $(this);
			if (expression) {
				if (expression === true) {
					e.removeData(DATA_CALCULATE_RELEVANT);
				} else {
					e.data(DATA_CALCULATE_RELEVANT, expression);
					return _enable(e, expression(e));
				}
			} else if (e.data(DATA_CALCULATE_RELEVANT)) {
				return _enable(e, e.data(DATA_CALCULATE_RELEVANT)(e));
			}
			return true;
		});
	},


	// set required conditions
	required: function(test) {
		if (test) $(this).forces_xform_control().data('required', test);
		return this;
	},


	// use validation
	useForcesValidation: function(enable) {
		var form = $(this).xForm();
		if (enable) {
			form.data(DATA_MSG_ALERT, enable);
			return true;
		} else if (enable === false) {
			form.removeData(DATA_MSG_ALERT);
			return false;
		}
		return form.data(DATA_MSG_ALERT) != null;
	},


	// is control valid
	// returns jQuery (filtered, invalid controls remain)
	validate: function() {
		if (this.useForcesValidation() === false) return this;
		
		// set valid state
		function _valid(e, isValid, alertMessage) {
			e.data(DATA_VALID, isValid);
			if (isValid) {
				e.find(':-xf-alert').remove();
				e.removeClass(CLASS_INVALID).addClass(CLASS_VALID);
			} else {
				e.removeClass(CLASS_VALID).addClass(CLASS_INVALID).find(':-xf-label')
					.parent()
						.find(':-xf-alert')
							.remove()
						.end()
					.append('<em class="' + CLASS_ALERT + '">' + alertMessage + '</em>');
			}
			return isValid;
		}

		return this.forces_xform_control().filter(function() {
			var e = $(this);

			if (e.is(':-tf-blank')) {
				if (e.is(':-xf-required')) {
					// blank + required = invalid
					return !_valid(e, false, _tf_ALERT_REQUIRED);
				} else {
					// blank + not required = valid
					return !_valid(e, true);
				}
			} else {
				var constraints = e.data(DATA_CONSTRAINTS) || [];
				for (var i = 0; i < constraints.length; i++) {
					if (constraints[i].test(e) == false) {
						return !_valid(e, false, constraints[i].alertMessage)
					}
				}
				constraints = e.xForm().data(DATA_CONSTRAINTS) || [];
				for (var i = 0; i < constraints.length; i++) {
					if (e.is(constraints[i].selector) && constraints[i].test(e) == false) {
						return !_valid(e, false, constraints[i].alertMessage)
					}
				}
			}
			return !_valid(e, true);
		});
	},
	

	// get alert message text
	xfAlert: function() {
		return this.forces_xform_control().find(':-xf-alert').text();
	},


	// get xform
	xForm: function() { 
		return this.hasClass('xform') ? this : this.parents('.xform');
	},


	// get/set label
	xfLabel: function(label, labelSeparator) {
		var xfLabel = this.forces_xform_control().find(':-xf-label').eq(0);

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
		var v = this._xfValue();
		if (!v) return null;
		
		// switch (dataType)
		if (this.is(':-tf-date')) {
			v = new Date(v);
		}
		return v;
	},


	// returns raw value
	_xfValue: function() {
		if (this.find(':text').length) {
			return this.find(':text').val();
		} else if (this.find('select').length) {
			return this.find('select').val();
		} else if (this.find(':radio').length) {
			var checked = this.find(':radio:checked');
			return checked.length > 0 ? checked.val() : null;
		} else if (this.find(':checkbox').length) {
			var checked = this.find(':checkbox:checked');
			return checked.length > 0 ? checked.val() : null;
		}
		// TODO support textarea, password, and more datatypes
		return null;
	}

});


// aliases

// xfVal('#id') or xfVal('name') or xfVal(jQuery)
// shortcut for $(jquery).xfValue()
$.xfVal = function(e) {
	if (typeof(e) == 'string') {
		e = e.charAt(0) == '#' ? $(e) : $('*[name="' + e + '"]');
	}
	return e.forces_xform_control().xfValue();
};





// events
$('form')
	// form control changed
	.bind('change ' + EVENT_VALUE_CHANGED, function(eventObject, target) {
		var target = $(target || eventObject.target).forces_xform_control();
		target.xForm().recalculate();
		//target.validate().xForm().recalculate();
		// evaluate relevance of all controls
		//$(':-xf-control:-xf-relevant', target.xForm());
	})

	// focus
	.bind('focus', function(eventObject) {
		// TODO focus not captured at form level?
		console.log('focus', $(eventObject.target));
	})

	// form was submitted
	.bind('submit', function(eventObject) {

		var now = new Date().getTime();
		var xform = $(eventObject.target).xForm();

		function _cancel(xform) {
			// TODO shake button (or form?) to indicate negative feedback
			xform.addClass('xf-submit-error');
			return false;
		}

		// suppress, if repeated submit within timeframe (milliseconds)
		if (xform.data('submitted') && now - xform.data('submitted') < _tf_SUBMIT_TOLERANCE) {
			return _cancel(xform);
		}
		xform.data('submitted', now);

		// get all relevant controls		
		var controls = $(':-xf-control', xform);
		controls = $(':-xf-control:-xf-relevant', xform);

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
				status = $('<div class="status alert"><h1>' + (xform.data(DATA_MSG_ALERT) || _tf_SUBMIT_ERROR) + '</h1><ol></ol></div>');
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
		var control = formInput.forces_xform_control();
		var val = control.xfValue();
		if (control.data('previousValue') != val) {
			control.data('previousValue', val);
			control.form().trigger(EVENT_VALUE_CHANGED, [formInput]);
		}
	});


// IE
if ($.browser.msie) {
	// trigger change on radio buttons and checkboxes
	$(':radio,:checkbox').click(function(eventObject) {
		var formInput = $(eventObject.target);
		var control = formInput.forces_xform_control();
		var val = control.xfValue();
		if (control.data('previousValue') != val) {
			control.data('previousValue', val);
			control.form().trigger(EVENT_VALUE_CHANGED,[formInput]);
		}
	});
}


})(jQuery);





// datatype constraints
// TODO will this work when multiple forms are in the page?
$('form').constraint(':-tf-date', "unrecognised date format", function(e) {
	var d = e.xfValue().split(/\D/);
	if (d.length == 3 && d.join('').match(/^\d{4,8}$/)) {
		var date = new Date(d[2], d[1]-1, d[0]);
		return date.getMonth()+1 == d[1] && date.getDate() == d[0] && (date.getFullYear() == d[2] || date.getYear() == d[2]);
	}
	return false;
});


// turn on validation
// TODO selector becomes the forcesContainer element?
$('form').each(function() {
	$(this).useForcesValidation(_tf_ALERT_REQUIRED);
});

}