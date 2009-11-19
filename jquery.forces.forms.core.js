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

		EXPR_HTML_CONTROLS: ':text,select,textarea,.xf-select1 fieldset',
		
		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
		REXP_EMAIL: /^[A-Za-z!#$%&'*+-\/=?^_`{|}~\.]+@[A-Za-z0-9-]*[A-Za-z0-9]+(?:\.[A-Za-z0-9-]*[A-Za-z0-9]+)+$/,
		
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
		'-tf-not-validated': function(e) {
			return ($(e).data('-tf-FLAGS') & 48) == 0;
		},
		'-xf-empty': function(e) {
			e = $(e);
			if (e.find(':radio,:checkbox').length) {
				return e.find(':checked').length == 0;
			}
			return $.trim(e.val()).length == 0;
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
			return ($(e).data('-tf-FLAGS') & 4) == 4;
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
			return value ? value : (this.is(':-xf-' + name) ? name : null);
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
	$.fn.forces_validate = function() {
		return $(this).each(function() {
			var e = $(this);
			var valid = true;
			var value = $.trim(e.val());

			if (value) {
				switch (e.forces_attr('type')) {

					case 'email':
						valid = $F.REXP_EMAIL.exec(value);
					break;
					
					case 'confirm':
						var previous = e.closest('form');
						if (previous.length) {
							previous = previous.find('input');
							for (var i = 1; i < previous.length; i++) {
								if (previous.eq(i).get(0) == this) {
									valid = value == $.trim(previous.eq(i-1).val());
									break;
								}
							}
						}
					break;

					case 'date':
						valid = $F.dateParse(value);
					break;

					case 'number':
						valid = $F.REXP_NUMBER.exec(value);
					break;
				}

				if (valid) {
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

			} else {
				e
						.forces__flags(16, false)
						.forces__flags(32, false)
				;
			}
		});
	};





	// toggle flags
	$.fn.forces__flags = function(flag, add) {
		var e;
		this.set = function() {
			e = $(this);
			e.data('-tf-FLAGS', e.data('-tf-FLAGS') | flag);
		};
		this.unset = function() {
			e = $(this);
			e.data('-tf-FLAGS', e.data('-tf-FLAGS') & ~flag);
		};
		return add ? this.each(this.set) : this.each(this.unset);
	};
	
	



	// form submission
	$F.formSubmitHandler = function(evt) {
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
			
			var controls = form.find($F.EXPR_HTML_CONTROLS);
			// TODO skip already validated fields?
			controls.forces_validate();
	
			// are there invalid fields?
			var invalid = controls.filter(':-xf-required:-xf-empty, :-xf-invalid');
			if (invalid.length) {
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





	$F.inputFocusHandler = function(evt) {
		var control = $(evt.target);

		switch (evt.type) {
		
			case 'click':
			case 'focus':
			case 'mousedown':
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
						.forces_validate()
						.trigger($F.EVENT_XF_VALUE_CHANGED)
					;
				}
			break;
		}
	};





	// TODO enable/disabled forces (partially implemented)
	$.fn.forces_enable = function(enable) {
		$F.toggleFormHandlers(enable, $(this));
	};
	// TODO use namespaced events
	$F.toggleFormHandlers = function(enable, form) {
		form = form || $('form');
		if (enable || enable === undefined) {
			form.bind('submit', $F.formSubmitHandler);
			$('input,select,textarea', form).bind('focus blur click mousedown', $F.inputFocusHandler);
		} else {
			form.unbind('submit');
			$('input,select,textarea', form).unbind('focus blur');
		}
	};
	



})(jQuery);
}
