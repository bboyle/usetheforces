/**
 * jquery.forces.forms.core.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.extend($.forces || {}, {
		// CONSTANTS (public)
		EVENT_XF_DISABLED: '-xf-disabled',
		EVENT_XF_ENABLED: '-xf-enabled',

		EVENT_XF_FOCUS_IN: '-xf-focus-in',
		EVENT_XF_FOCUS_OUT: '-xf-focus-out',

		EVENT_XF_OPTIONAL: '-xf-optional',
		EVENT_XF_REQUIRED: '-xf-required',

		EVENT_XF_VALID: '-xf-valid',
		EVENT_XF_INVALID: '-xf-invalid',
		
		EVENT_XF_VALUE_CHANGED: '-xf-value-changed',

		EVENT_XF_SUBMIT_DONE: '-xf-submit-done',
		EVENT_XF_SUBMIT_ERROR: '-xf-submit-error',
		EVENT_TF_SUBMIT_SUPPRESSED: '-tf-submit-suppressed',

		EXPR_HTML_CONTROLS: ':text,:password,select,textarea,.xf-select>fieldset,.xf-select1>fieldset',
		
		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
		REXP_EMAIL: /^[A-Za-z0-9!#$%&'*+-\/=?^_`{|}~\.]+@[A-Za-z0-9-]*[A-Za-z0-9]+(?:\.[A-Za-z0-9-]*[A-Za-z0-9]+)+$/,
		
		REXP_NUMBER: /^[0-9]+$/,

		SUBMIT_TOLERANCE: 10000
	});





	// constants (private)
	var SUBMIT_TIMESTAMP = '-tf-submitted';
/*
	// bit flags
	var BIT_IRRELEVANT		= 1;
	var BIT_FLAG_IRRELEVANT	= 2;
	var BIT_REQUIRED		= 4;
	var BIT_FLAG_REQUIRED	= 8;
	var BIT_VALID			= 16;
	var BIT_INVALID			= 32;
*/




	// selectors
	$.extend($.expr[':'], {
		'-tf-html-control': function(e) {
			return $(e).is($F.EXPR_HTML_CONTROLS);
		},
		'-tf-not-validated': function(e) {
			return ($(e).data('-tf-FLAGS') & 48) == 0;
		},
		'-tf-validated': function(e) {
			return ($(e).data('-tf-FLAGS') & 48) != 0;
		},
		'-xf-empty': function(e) {
			return $.trim($(e).forces_val()).length == 0;
		},
		'-xf-non-empty': function(e) {
			return $.trim($(e).forces_val()).length > 0;
		},
		'-xf-invalid': function(e) {
			return ($(e).data('-tf-FLAGS') & 32) == 32;
		},
		'-xf-irrelevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) == 1;
		},
		'-xf-optional': function(e) {
			return ($(e).data('-tf-FLAGS') & 4) == 0;
		},
		'-xf-relevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) == 0;
		},
		'-xf-required': function(e) {
			e = $(e);
			return !!e.attr('required') || (e.data('-tf-FLAGS') & 4) == 4;
		},
		'-xf-valid': function(e) {
			return ($(e).data('-tf-FLAGS') & 16) == 16;
		}
	});
	
	



	// pseudo attr() to support @required, @relevant and @type
	$.fn.forces_attr = function(name, value) {
		// read
		if (typeof(value) == 'undefined') {
			value = this.data('-tf-@' + name);
			if (value) {
				return value;
			}
			
			switch (name) {
				case 'required':
				case 'relevant':
					if (this.is(':-xf-' + name)) {
						return name;
					}
			}
			return null;
		}
		// write
		switch (name) {

			case 'relevant': // irrelevant
				this.forces__flags(2, value !== true && value != 'relevant');
			break;
			
			case 'required':
				this.forces__flags(8, value === true || value == 'required');
			break;
			
			case 'type':
			break;

			default:
				// exit
				return this;
		}
		return this.data('-tf-@' + name, value === true ? name : value).forces_recalculate();
	};

	$.fn.forces_removeAttr = function(name) {
		switch (name) {

			case 'relevant': // irrelevant
				this.forces__flags(2, false);
			break;

			case 'required':
				this.forces__flags(8, false);
			break;

			case 'type':
			break;

			default:
				// exit
				return this;
		}
		return this.removeData('-tf-@' + name).forces_recalculate();
	};





	// get value
	$.fn.forces_val = function(asType) {
		if (this.length < 1) {
			return null;
		}
		switch (this.get(0).tagName.toLowerCase()) {
			case 'fieldset':
				return this.find(':checked').val() || null;
			case 'input':
				switch (this.forces_attr('type')) {
					case 'date':
						return (asType ? $F.dateParse(this.val()) : this.val()) || null;
				}
		}
		
		
		return this.val() || null;
	};





	// setCustomValidity() method
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#dom-cva-setcustomvalidity
	$.fn.forces_setCustomValidity = function(message) {
		return this.data('-tf-customValidityErrorMessage', message);
	},





	// validity property
	// PARTIAL: supports valueMissing, typeMismatch (email, date, number) and customError
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#validitystate
	$.fn.forces_validity = function() {
		
		return this.data('-tf-validity') || this.data('-tf-validity', { 
			valueMissing: false,
			typeMismatch: false,
//			patternMismatch: false,
//			tooLong: false,
//			rangeUnderflow: false,
//			rangeOverflow: false,
//			stepMismatch: false,
//			customError: false,
			valid: true
		}).data('-tf-validity');
	},





	// recalculate all fields
	$.fn.forces_recalculate = function() {
		var e, f;
		
		var _flagEvent = function(e, flag, set, event) {
			e
				.forces__flags(flag, set)
				.trigger(event)
			;
		};
		
		return this.each(function() {
			e = $(this);
			f = e.data('-tf-FLAGS') || 0;
	
			// relevant
			switch (f & 3) {
				case 2: // -> irrelevant
					_flagEvent(e, 1, true, $F.EVENT_XF_DISABLED);
				break;
				case 1: // -> relevant
					_flagEvent(e, 1, false, $F.EVENT_XF_ENABLED);
				break;
			}
			switch (f & 12) {
				case 8: // -> required
					_flagEvent(e, 4, true, $F.EVENT_XF_REQUIRED);
				break;
				case 4: // -> optional
					_flagEvent(e, 4, false, $F.EVENT_XF_OPTIONAL);
				break;
			}
	
		});
	};
	
	



	// validate
	// validityFilter can filter the jquery object: true = valid controls; false = invalid controls; undefined = all controls (no filter)
	$.fn.forces_validate = function(validityFilter) {
		return this.filter(function() {

			var e = $(this);
			var validityState = e.forces_validity();

			// custom error = setCustomValidity(message) called
			validityState.customError = !!e.data('-tf-customValidityErrorMessage');

			// valueMissing = required and empty
			validityState.valueMissing = e.is(':-xf-required:-xf-empty');

			// typeMismatch tests
			var value = $.trim(e.forces_val());
			if (value) {
				switch (e.forces_attr('type')) {

					case 'email':
						// email doesn't match regex
						validityState.typeMismatch = !$F.REXP_EMAIL.exec(value);
					break;
					
					case 'date':
						// unable to parse date
						validityState.typeMismatch = $F.dateParse(value) == null;
					break;

					case 'number':
						// number doesn't match regex
						validityState.typeMismatch = !$F.REXP_NUMBER.exec(value);
					break;
					
					default:
						// unknown type? assume valid
						validityState.typeMismatch = false;
				}
			} else {
				validityState.typeMismatch = false;
			}

			// valid = no states are true
			validityState.valid = !(validityState.valueMissing || validityState.customError || validityState.typeMismatch);

			if (validityState.valid) {
				e
					.forces__flags(32, false)
					.forces__flags(16, true)
					.trigger($F.EVENT_XF_VALID)
				;
			} else {
				e
					.forces__flags(16, false)
					.forces__flags(32, true)
					.trigger($F.EVENT_XF_INVALID)
				;
			}

			return validityFilter === undefined || validityFilter === validityState.valid;
		});
	};





	// toggle flags
	$.fn.forces__flags = function(flag, add) {
		var e;
		add = add ? 
		function() {
			e = $(this);
			e.data('-tf-FLAGS', e.data('-tf-FLAGS') | flag);
		} :
		function() {
			e = $(this);
			e.data('-tf-FLAGS', e.data('-tf-FLAGS') & ~flag);
		};
		return this.each(add);
	};
	
	



	// form submission
	var formSubmitHandler = function(evt) {
		var form = $(this);
	
		// is this form being managed by forces?
		if (true) {
			
			// is this submit event too soon after the last one?
			if (form.data(SUBMIT_TIMESTAMP) && evt.timeStamp - form.data(SUBMIT_TIMESTAMP) < $F.SUBMIT_TOLERANCE) {
				// cancel the submit event
				evt.stopImmediatePropagation();
				form.trigger($F.EVENT_TF_SUBMIT_SUPPRESSED);
				return false;
			}
	
			// prevent repeat submit events (store time of submit)
			form.data(SUBMIT_TIMESTAMP, evt.timeStamp);
			
			// are there invalid fields?
			// ignore fields irrelevant due to nesting
			var nestedIrrelevant = form.find('fieldset:-xf-irrelevant').find($F.EXPR_HTML_CONTROLS);
			if (form.find($F.EXPR_HTML_CONTROLS).filter(':-xf-relevant').not(nestedIrrelevant).forces_validate(false).length) {
				// throw a submit error
				form.trigger($F.EVENT_XF_SUBMIT_ERROR);
				// re-enable submit events (delete the stored submit time)
				form.removeData(SUBMIT_TIMESTAMP);
				// cancel this submit event
				return false;
			}
		}
	
		// submission is ok
		form.trigger($F.EVENT_XF_SUBMIT_DONE);
		return true;
	};





	var inputFocusHandler = function(evt) {
		var control = $(evt.target);

		switch (evt.type) {

			case 'click':
			case 'focus':
				control
					.data('-tf-VALUE', control.val())
					.trigger($F.EVENT_XF_FOCUS_IN)
				;
			break;

			case 'blur':
				var oldValue = control.data('-tf-VALUE');
				control
					.removeData('-tf-VALUE')
					.trigger($F.EVENT_XF_FOCUS_OUT)
				;
				if (control.val() !== oldValue) {
					control
						.trigger($F.EVENT_XF_VALUE_CHANGED)
						.forces_validate()
					;
				}
			break;
		}
	};





	var radioFocusHandler = function(evt) {
		var control = $(evt.target).closest('fieldset');

		switch (evt.type) {
		
			case 'focus':
				control
					.data('-tf-VALUE', control.forces_val())
					.trigger($F.EVENT_XF_FOCUS_IN)
				;
			break;

			case 'click':
				var oldValue = control.data('-tf-VALUE');
				if (control.forces_val() !== oldValue) {
					control
						.data('-tf-VALUE', control.forces_val())
						.trigger($F.EVENT_XF_VALUE_CHANGED)
						.forces_validate()
					;
				}
			break;

			case 'blur':
				var oldValue = control.data('-tf-VALUE');
				control
					.removeData('-tf-VALUE')
					.trigger($F.EVENT_XF_FOCUS_OUT)
				;
				if (control.forces_val() !== oldValue) {
					control
						.trigger($F.EVENT_XF_VALUE_CHANGED)
						.forces_validate()
					;
				}
			break;
		}
	};





	// TODO enable/disable forces (partially implemented)
	$.fn.forces_enable = function(enable) {
		$F.toggleFormHandlers(enable, $(this));
	};
	// TODO use namespaced events
	$F.toggleFormHandlers = function(enable, form) {
		form = form || $('form');
		if (enable || enable === undefined) {
			form.bind('submit', formSubmitHandler);
			$(':text,select,textarea', form).bind('focus blur click', inputFocusHandler);
			$(':radio,:checkbox', form).bind('focus blur click', radioFocusHandler);
		} else {
			form.unbind('submit', formSubmitHandler);
			$(':text,select,textarea', form).unbind('focus blur click', inputFocusHandler);
			$(':radio,:checkbox', form).unbind('focus blur click', radioFocusHandler);
		}
	};
	




})(jQuery);
}
