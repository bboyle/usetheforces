/**
 * jquery.forces.forms.core.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.forces || {};





	// CONSTANTS (public)
	$F.EVENT_XF_DISABLED = '-xf-disabled';
	$F.EVENT_XF_ENABLED = '-xf-enabled';

	$F.EVENT_XF_FOCUS_IN = '-xf-focus-in';
	$F.EVENT_XF_FOCUS_OUT = '-xf-focus-out';

	$F.EVENT_XF_OPTIONAL = '-xf-optional';
	$F.EVENT_XF_REQUIRED = '-xf-required';

	$F.EVENT_XF_VALID = '-xf-valid';
	$F.EVENT_XF_INVALID = '-xf-invalid';

	$F.EVENT_XF_SUBMIT_DONE = '-xf-submit-done';
	$F.EVENT_XF_SUBMIT_ERROR = '-xf-submit-error';
	$F.EVENT_TF_SUBMIT_SUPPRESSED = '-tf-submit-suppressed';

	$F.EXPR_HTML_CONTROLS = ':text, textarea';

	$F.SUBMIT_TOLERANCE = 10000;

	// constants (private)
	var SUBMIT_TIMESTAMP = '-tf-submitted';
	var BIT_IRRELEVANT		= 1;
	var BIT_FLAG_IRRELEVANT	= 2;
	var BIT_REQUIRED		= 4;
	var BIT_FLAG_REQUIRED	= 8;
	var BIT_VALID			= 16;
	var BIT_INVALID			= 32;





	// selectors
	$.extend($.expr[':'], {
		'-xf-empty': function(e) {
			return $.trim($(e).val()).length == 0;
		},
		'-xf-invalid': function(e) {
			return ($(e).data('-tf-FLAGS') & BIT_INVALID) == BIT_INVALID;
		},
		'-xf-irrelevant': function(e) {
			return ($(e).data('-tf-FLAGS') & BIT_IRRELEVANT) == BIT_IRRELEVANT;
		},
		'-xf-optional': function(e) {
			return ($(e).data('-tf-FLAGS') & BIT_REQUIRED) == 0;
		},
		'-xf-relevant': function(e) {
			return ($(e).data('-tf-FLAGS') & BIT_IRRELEVANT) == 0;
		},
		'-xf-required': function(e) {
			return ($(e).data('-tf-FLAGS') & BIT_REQUIRED) == BIT_REQUIRED;
		},
		'-xf-valid': function(e) {
			return ($(e).data('-tf-FLAGS') & BIT_VALID) == BIT_VALID;
		},
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
				this.forces__flags(BIT_FLAG_IRRELEVANT, value !== true && value != 'relevant');
			break;
			
			case 'required':
				this.forces__flags(BIT_FLAG_REQUIRED, value === true || value == 'required');
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
				this.forces__flags(BIT_FLAG_IRRELEVANT, false);
			break;

			case 'required':
				this.forces__flags(BIT_FLAG_REQUIRED, false);
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
			switch (f & (BIT_FLAG_IRRELEVANT + BIT_IRRELEVANT)) {
				case BIT_FLAG_IRRELEVANT: // -> irrelevant
					_flagEvent(e, BIT_IRRELEVANT, true, $F.EVENT_XF_DISABLED);
				break;
				case BIT_IRRELEVANT: // -> relevant
					_flagEvent(e, BIT_IRRELEVANT, false, $F.EVENT_XF_ENABLED);
				break;
			}
			switch (f & (BIT_FLAG_REQUIRED + BIT_REQUIRED)) {
				case BIT_FLAG_REQUIRED: // -> required
					_flagEvent(e, BIT_REQUIRED, true, $F.EVENT_XF_REQUIRED);
				break;
				case BIT_REQUIRED: // -> optional
					_flagEvent(e, BIT_REQUIRED, false, $F.EVENT_XF_OPTIONAL);
				break;
			}
	
		});
	};
	
	



	// validate
	$.fn.forces_validate = function() {
		return $(this).each(function() {
			var e = $(this);
			switch (e.forces_attr('type')) {

				case 'email':
					e
						.forces__flags(BIT_INVALID, true)
						.data('-tf-INVALID', 'must contain an email address')
						.trigger($F.EVENT_XF_INVALID)
					;
				break;

				default:
					// valid
					e
						.forces__flags(BIT_VALID, true)
						.trigger($F.EVENT_XF_VALID)
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
			
			// validate all fields of unknown validity
			var controls = form.find($F.EXPR_HTML_CONTROLS).filter(':not(:-xf-valid, :-xf-invalid)').forces_validate();
	
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





	$F.inputEventHandler = function(evt) {
		$(evt.target).trigger(evt.type == 'focus' ? $F.EVENT_XF_FOCUS_IN : $F.EVENT_XF_FOCUS_OUT);
	};





	// TODO enable/disabled forces (partially implemented)
	$.fn.forces_enable = function() {
		$('form').bind('submit', $F.formSubmitHandler);
		// support for "live" focus/blur events
		$($F.EXPR_HTML_CONTROLS).bind('focus blur', $F.inputEventHandler);
	};
	
	



})(jQuery);
}
