/**
 * jquery.forces.forms.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {

(function($){

	$.forces = function() {};
	$.forces.triggerChangeOnInput = false;

	// forces
	var _tf_ALERT_REQUIRED = "must be completed";
	var _tf_ALERT_CONSTRAINT_MAX = "violates max constraint";
	var _tf_ALERT_CONSTRAINT_MIN = "violates min constraint";
	var _tf_ALERT_TYPE_DATE = "unrecognised date format";
	var _tf_ALERT_TYPE_NUMBER = "must be a number";
	var _tf_DATE_MONTHS = 'January February March April May June July August September October November December'.split(/ /);
	var _tf_DATE_WEEKDAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/ /);
	var _tf_SUBMIT_ERROR = "Unable to submit form";
	var _tf_SUBMIT_TOLERANCE = 2000; // ms
	var _tf_VALIDATE = true;
	$.forces_DATE_TODAY = new Date();
	$.forces_DATE_TODAY = new Date($.forces_DATE_TODAY.getFullYear(), $.forces_DATE_TODAY.getMonth(), $.forces_DATE_TODAY.getDate());

	// class names
	var CLASS_ALERT = 'xf-alert';
	var CLASS_INVALID = 'xf-invalid';
	var CLASS_VALID = 'xf-valid';
	var CLASS_REQUIRED = 'xf-required';
	var CLASS_SUBMIT_ERROR = 'xf-submit-error';

	// event types
	var EVENT_ENABLED = '-xf-enabled';
	var EVENT_DISABLED = '-xf-disabled';
	var EVENT_REQUIRED = '-xf-required';
	var EVENT_OPTIONAL = '-xf-optional';
	var EVENT_VALUE_CHANGED = '-xf-value-changed';

	// internal state data
	var DATA_PREFIX_ATTR = '-tf-attr-';
	var DATA_PREFIX_CALC = '-tf-calc-';
	var DATA_CONSTRAINTS = '-xf-constraints';
	var DATA_CONSTRAINT_MIN = '-xf-constraints-min';
	var DATA_CONSTRAINT_MAX = '-xf-constraints-max';
	var DATA_DEPENDENCY_CALCULATIONS = '-tf-depend-c';
	var DATA_DEPENDENCY_VALIDATIONS = '-tf-depdend-v'
	var DATA_DISABLED = '-xf-disabled';
	var DATA_VALID = '-xf-valid';
	var DATA_VALUE = '-tf-value';
	var DATA_MESSAGE_ALERT = '-tf-submit-alert';
	var DATA_FORMAT_DATE_OUTPUT = '-tf-format-date-output';
	var DATA_FORMAT_DATE_SUBMIT = '-tf-format-date-submit';
	var DATA_SUBMIT_TIMESTAMP = '-tf-submit-time';


// selectors
$.extend($.expr[':'], {
	// (use)theforces
	'-tf-blank': function(e) {
		var v = $(e).xfValue();
		return v == null || $.trim(v).length == 0;
	},
	'-tf-date': function(e) {
		return $(e).data(DATA_FORMAT_DATE_SUBMIT) != null;
	},
	'-tf-number': function(e) {
		return $(e).hasClass('number');
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
	'-xf-output': function(e) {
		return $(e).hasClass('xf-output');
	},
	'-xf-relevant': function(e) {
		return $(e).find('input:enabled,select:enabled,textarea:enabled').length > 0;
	},
	'-xf-required': function(e) {
		e = $(e);
		return e.find('.required').size() > 0;
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
	xpath2js: function(expression) {
		return expression
			.replace(/ and /g, ' && ')
			.replace(/ or /, ' || ')
			.replace(/ = /g, ' == ');
	},
	regexNamesXpath: /(?:^|\s+|\()([_A-Za-z][_A-Za-z0-9.]*)(?:\)|\s+|$)/g
};


$.forces_frag = function(fragmentIdentifier) {
	window.location.hash = fragmentIdentifier;
};


// forces config
$.forces_validate = function(enabled) {
	 _tf_VALIDATE = (enabled == true);
};


// extension to attr() to support @relevant
$.fn.forces_attr = function(name, value) {
	switch (name) {
		case 'relevant':
		case 'required':
			if (value !== undefined) {
				var controls = this.forces_xform_control();
				// store the attribute value
				controls.data(DATA_PREFIX_ATTR+name, value);
				// convert xpath expression to javascript
				value = _private.xpath2js(value);
				// extract names of dependencies
				var names = {};
				var vars;
				while (vars = _private.regexNamesXpath.exec(value)) {
					if (names[vars[1]] === undefined) {
						var source = $.forces_form_field(vars[1]);
						source.data(DATA_DEPENDENCY_CALCULATIONS, controls.add(source.data(DATA_DEPENDENCY_CALCULATIONS)));
						names[vars[1]] = source;
					}
				}
				// create a function from the expression
				vars = '';
				var i = 1;
				for (var n in names) {
					vars += 'var v' + i + '=$.forces_val("' + n + '");';
					value = value.replace(new RegExp(n, 'g'), 'v'+i);
					i++;
				}
				var f = new Function(vars + 'return ' + value + ';');
				controls.data(DATA_PREFIX_CALC+name, f).forces_recalculate();
				return this;
			} else {
				return this.forces_xform_control().data(DATA_PREFIX_ATTR+name);
			}
		break;

		default:
			// fallback on default .attr() behaviour
			return this.attr(name, value);
	}
};
$.fn.forces_removeAttr = function(name) {
	switch (name) {
		case 'relevant':
		case 'required':
			this.forces_xform_control()
				.removeData(DATA_PREFIX_ATTR+name)
				.removeData(DATA_PREFIX_CALC+name);
			return this;
	}
	return this.removeAttr(name);
};


// set a constraint
$.fn.constraint = function(selector, alertMessage, test) {
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
};



// format a date
$.forces_dateFormat = function(date, format) {
	if (!date) return '';
	if (!format) return date.toString();
	return format
		.replace(/YYYY|yyyy|%Y/, date.getFullYear())
		.replace(/MM|%m/, _private.pad(date.getMonth()+1, 2, '0'))
		.replace(/dd|%d/, _private.pad(date.getDate(), 2, '0'))
		.replace(/%e/, _private.pad(date.getDate(), 2, ' '))
		.replace(/d/, date.getDate())
		.replace(/%B/, _tf_DATE_MONTHS[date.getMonth()])
		.replace(/%A/, _tf_DATE_WEEKDAYS[date.getDay()]);
};


// parse a date
$.forces_dateParse = function(s, min, max) {
	s = s.split(/[^A-Za-z0-9]/);

	var base = min || max || $.forces_DATE_TODAY;

	var date = {};
	function setDate(property, value) {
		date[property] = date[property] || value;
	}

	for (var i = 0; i < s.length; i++) {
		if (s[i].match(/^\d{4}$/)) {
			setDate('year', s[i]);
		} else if (s[i].match(/^\d+$/)) {
			// precedence: date, month, year
			var property = date.date ? (date.month ? 'year' : 'month') : 'date';
			if (property == 'year' && !date.year) {
				s[i] = (base.getFullYear()+"").substring(0,2) + _private.pad(s[i], 2, '0');
				if (min && min.getFullYear() > s[i]) {
					s[i] += 100;
				} else if (max && max.getFullYear() < s[i]) {
					s[i] -= 100;
				} else if (!min && !max && s[i] > base.getFullYear()+20) {
					s[i] -= 100;
				}
			}
			setDate(property, s[i]);
		}
	}

	if (date.date && date.month && date.year) {
		var d = new Date(date.year, date.month-1, date.date);
		if ($.forces_dateEquals(d, date.year, date.month, date.date)) {
			return d;
		}
	}

	return null;
};


// calculate a date
$.forces_dateCalc = function(date, delta) {
	return new Date(date.getFullYear()+(delta.year||0), date.getMonth()+(delta.month||0), date.getDate()+(delta.date||0));
};


// check date equality
$.forces_dateEquals = function(date, y, m, d) {
	return (date.getMonth() == m-1 && date.getDate() == d && date.getFullYear() == y);
};


// get form
$.fn.form = function() {
	return this.is('form') ? this : this.parents('form');
};


// makes and returns date fields
$.fn.forces_form_dateField = function(formatSubmit, formatOutput, min, max) {
	formatSubmit = formatSubmit || 'YYYY-MM-dd';

	return this.forces_xform_control().filter(function() {
		var e = $(this);
		var date = e.xfValueAsDate();
		var i = e.find(':text');
		if (i.length == 1) {
			i = i.eq(0);
			var hidden = $('<input type="hidden" name="' + i.attr('name') + '" />');
			hidden.val($.forces_dateFormat(date, formatSubmit));
			i.eq(0)
				.after(hidden)
				.removeAttr('name');
			e
			.data(DATA_FORMAT_DATE_SUBMIT, formatSubmit)
			.data(DATA_CONSTRAINT_MIN, min || null)
			.data(DATA_CONSTRAINT_MAX, max || null);
			if (formatOutput) {
				var output = $('<span class="xf-output"></span>');
				if (i.val()) {
					// TODO setup output.calculation()
					// support for calculations
					output.text($.forces_dateFormat(date, formatOutput));
				}
				i.after(output);
				e.data(DATA_FORMAT_DATE_OUTPUT, formatOutput);
			} else {
				e.removeData(DATA_FORMAT_DATE_OUTPUT);
			}
			return true;
		}
		return false;
	});
};


// get a forces field
$.forces_form_field = function(e) {
	// xfVal('#id') or xfVal('name') or xfVal(jQuery)
	if (typeof(e) == 'string') {
		e = e.charAt(0) == '#' ? $(e) : $('*[name="' + e + '"]').eq(0);
	}
	return e.forces_xform_control();
};


// extension to val()
$.forces_val = function(e) {
	return $.forces_form_field(e).xfValue();
};


// get/set label
$.fn.forces_label = function(label, labelSeparator) {
	// TODO return :-xf-label elements .find() only returns decendents, not self
	this.each(function() {
		var eLabel = $(this);
		if (label) {
			if (labelSeparator == null) {
				var m = new RegExp('([:?]+)$').exec(eLabel.text());
				labelSeparator = m ? m[1] : '';
			}
			eLabel.html(label + labelSeparator);
		}
	});
	return this;
};


// recalculate controls within me
$.fn.forces_recalculate = function() {
	var e, newStatus;
	return this.each(function() {
		e = $(this);
		// @relevant
		if (newStatus = e.data(DATA_PREFIX_CALC+'relevant')) {
			newStatus = newStatus();
			if (newStatus != e.is(':-xf-relevant')) {
				if (newStatus) {
					e.trigger(EVENT_ENABLED);
				} else {
					e.trigger(EVENT_DISABLED);
				}
			}
		}
		// @required
		if (newStatus = e.data(DATA_PREFIX_CALC+'required')) {
			newStatus = newStatus();
			if (newStatus != e.is(':-xf-required')) {
				if (newStatus) {
					e.trigger(EVENT_REQUIRED);
				} else {
					e.trigger(EVENT_OPTIONAL);
				}
			}
		}
	});
};


// get form control element
$.fn.forces_xform_control = function() {
	return this.map(function() {
		var e = $(this);
		return (e.is(':-xf-control') ? e : e.parents(':-xf-control')).get(0);
	});
};


// use validation
$.fn.useForcesValidation = function(enable) {
	var form = $(this).xForm();
	if (enable) {
		form.data(DATA_MESSAGE_ALERT, enable);
		return true;
	} else if (enable === false) {
		form.removeData(DATA_MESSAGE_ALERT);
		return false;
	}
	return form.data(DATA_MESSAGE_ALERT) != null;
};


// is control valid
// returns jQuery (filtered, valid controls remain)
$.fn.validate = function() {
	// set valid state
	function _valid(e, isValid, alertMessage) {
		e.data(DATA_VALID, isValid);
		if (isValid) {
			e.find(':-xf-alert').remove();
			e.removeClass(CLASS_INVALID).addClass(CLASS_VALID);
		} else {
			e.removeClass(CLASS_VALID).addClass(CLASS_INVALID).find(':-xf-label').eq(0)
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
		if (!e.is(':-xf-group') && e.is(':-tf-blank')) {
			if (e.is(':-xf-required')) {
				// blank + required = invalid
				return _valid(e, false, _tf_ALERT_REQUIRED);
			} else {
				// blank + not required = valid
				return _valid(e, true);
			}
		} else {
			var min = e.data(DATA_CONSTRAINT_MIN) || null;
			var max = e.data(DATA_CONSTRAINT_MAX) || null;
			if (e.is(':-tf-number')) {
				var number = e.xfValue();
				// TODO only allow , as thousands separator (not randomly placed in string)
				if (number.match(/[^0-9,.$]/)) {
					return _valid(e, false, _tf_ALERT_TYPE_NUMBER);
				}
			} else if (e.is(':-tf-date')) {
				var date = e.xfValueAsDate();
				if (!date) {
					return _valid(e, false, _tf_ALERT_TYPE_DATE);
				}
				if (min && date < min) {
					return _valid(e, false, _tf_ALERT_CONSTRAINT_MIN);
				}
				if (max && date > max) {
					return _valid(e, false, _tf_ALERT_CONSTRAINT_MAX);
				}
			}

			var constraints = e.data(DATA_CONSTRAINTS) || [];
			for (var i = 0; i < constraints.length; i++) {
				if (!constraints[i].test(e)) {
					return _valid(e, false, constraints[i].alertMessage);
				}
			}
			constraints = e.xForm().data(DATA_CONSTRAINTS) || [];
			for (i = 0; i < constraints.length; i++) {
				if (e.is(constraints[i].selector) && !constraints[i].test(e)) {
					return _valid(e, false, constraints[i].alertMessage);
				}
			}
		}
		return _valid(e, true);
	});
};


// get alert message text
$.fn.xfAlert = function() {
	return this.forces_xform_control().find(':-xf-alert').eq(0).text();
};


// get xform
$.fn.xForm = function() {
	return this.hasClass('xform') ? this : this.parents('.xform');
};


// get value
$.fn.xfValue = function() {
	if (this.find(':radio').length) {
		var checked = this.find(':radio:checked');
		return checked.length > 0 ? checked.val() : null;
	} else if (this.find(':checkbox').length) {
		var checked = this.find(':checkbox:checked');
		return checked.length > 0 ? checked.val() : null;
	}
	return this.find('input,select,textarea').eq(0).val();
};


// get value as Date
$.fn.xfValueAsDate = function() {
	var d = this.xfValue();
	if (d) return $.forces_dateParse(this.xfValue(), this.data(DATA_CONSTRAINT_MIN), this.data(DATA_CONSTRAINT_MAX));
};


// default enable/disable action
$(document)
.bind(EVENT_DISABLED, function(eventObject) {
	$(eventObject.target)
	.data(DATA_DISABLED, true)
	.stop(true, true)
	.hide()
	.find('input,select,textarea')
		.attr('disabled', 'disabled');
})
.bind(EVENT_ENABLED, function(eventObject) {
	$(eventObject.target)
	.removeData(DATA_DISABLED)
	.find('input,select,textarea')
		.removeAttr('disabled')
		.end()
	.stop(true, true)
	.slideDown(300);
})
.bind(EVENT_REQUIRED, function(eventObject) {
	$(eventObject.target)
	.addClass(CLASS_REQUIRED)
	.find('.xf-label')
	.eq(0)
	.after('<abbr title="required" class="required">*</abbr>');
})
.bind(EVENT_OPTIONAL, function(eventObject) {
	// TODO remove "required" alerts?
	$(eventObject.target)
	.removeClass(CLASS_REQUIRED)
	.find('abbr.required')
		.remove();
});


// form events
$('form')
// form control changed (may be input/change event)
.bind(EVENT_VALUE_CHANGED, function(eventObject, target) {
	// TODO switch (this.data('DATA_TYPE')) ??
	if (target.is(':-tf-date')) {
		var date = target.xfValueAsDate();
		target.find('input:hidden').val($.forces_dateFormat(date, target.data(DATA_FORMAT_DATE_SUBMIT)));
		if (target.data(DATA_FORMAT_DATE_OUTPUT)) {
			target.find(':-xf-output').text($.forces_dateFormat(date, target.data(DATA_FORMAT_DATE_OUTPUT)));
		}
	}
	target.add(target.data(DATA_DEPENDENCY_VALIDATIONS)).validate();

	// recalculate this and any dependent elements
	if (target.data(DATA_DEPENDENCY_CALCULATIONS)) target.data(DATA_DEPENDENCY_CALCULATIONS).forces_recalculate();
})


// form was submitted
.bind('submit', function(eventObject) {

	var now = new Date().getTime();
	var xform = $(eventObject.target).xForm();

	function _cancel(xform) {
		// TODO shake button (or form?) to indicate negative feedback
		xform.addClass(CLASS_SUBMIT_ERROR);
		return false;
	}

	// suppress, if repeated submit within timeframe (milliseconds)
	if (xform.data(DATA_SUBMIT_TIMESTAMP) && now - xform.data(DATA_SUBMIT_TIMESTAMP) < _tf_SUBMIT_TOLERANCE) {
		return false;
	}
	xform.data(DATA_SUBMIT_TIMESTAMP, now);

	// get all relevant controls
	var controls = $(':-xf-control:-xf-relevant', xform);
	// TODO validate controls that have not been validated (i.e. never changed)
	// TODO cater for recalculate() changes in relevance and required states
	// controls.filter(':not(:-xf-valid):not(:-xf-invalid)').validate();
	controls.validate();

	var invalid = controls.filter(':-xf-invalid');
	if (_tf_VALIDATE && invalid.length > 0) {

		var status = xform.prev('.status');
		if (status.length == 1) {
			status.find('li').remove();
		} else {
			// TODO generate-id
			status = $('<div id="status" class="status alert"><h1>' + (xform.data(DATA_MESSAGE_ALERT) || _tf_SUBMIT_ERROR) + '</h1><ol></ol></div>');
		}
		invalid.each(function() {
			var control = $(this);
			status.find('ol').append($('<li><a href="#' + control.find('*[id]').attr('id') + '">' + control.find(':-xf-label').eq(0).text().replace(/([:?]*)$/, ': ') + control.xfAlert() + '</a></li>'));
		});
		xform.before(status);
		// TODO generate-id (robust, no conflicts in document)
		$.forces_frag(status.attr('id'));
		return _cancel(xform);
	}
	return true;
});


// control events
$('input,select,textarea')
.change(function(eventObject) {
	var control = $(eventObject.target).forces_xform_control();
	control.form().trigger(EVENT_VALUE_CHANGED,[control]);
})
// keyup (early change detection)
$(':text,:password,textarea')
.keyup(function(eventObject){
	if (!$.forces.triggerChangeOnInput) return;

	var control = $(eventObject.target);
	var val = control.val();
	control = control.forces_xform_control();
	if (control.data(DATA_VALUE) != val) {
		control.data(DATA_VALUE, val);
		control.form().trigger(EVENT_VALUE_CHANGED, [control]);
	}
});


// IE
if ($.browser.msie || $.browser.opera) {
	// trigger change on radio buttons and checkboxes
	$(':radio,:checkbox').click(function(eventObject) {
		var control = $(eventObject.target).forces_xform_control();
		var val = control.xfValue();
		if (control.data(DATA_VALUE) != val) {
			control.data(DATA_VALUE, val);
			control.form().trigger(EVENT_VALUE_CHANGED,[control]);
		}
	});
}

})(jQuery);


}