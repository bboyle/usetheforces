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

	$F.EVENT_XF_SUBMIT_DONE = '-xf-submit-done';
	$F.EVENT_XF_SUBMIT_ERROR = '-xf-submit-error';
	$F.EVENT_TF_SUBMIT_SUPPRESSED = '-tf-submit-suppressed';

	$F.SUBMIT_TOLERANCE = 10000;

	// constants (private)
	var SUBMIT_TIMESTAMP = '-tf-submitted';





	// selectors
	$.extend($.expr[':'], {
		'-xf-empty': function(e) {
			return $.trim($(e).val()).length == 0;
		},
		'-xf-irrelevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) != 0;
		},
		'-xf-optional': function(e) {
			return ($(e).data('-tf-FLAGS') & 4) == 0;
		},
		'-xf-relevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) == 0;
		},
		'-xf-required': function(e) {
			return ($(e).data('-tf-FLAGS') & 4) != 0;
		}
	});
	
	



	// pseudo attr() to support @required and @relevant
	$.fn.forces_attr = function(name, value) {
		// read
		if (typeof(value) == 'undefined') {
			value = this.data('-tf-@'+name);
			return  value ? value : (this.is(':-xf-'+name) ? name : null);
		}
		// write
		switch (name) {
			case 'relevant': // irrelevant
				this.forces__flags(2, value !== true && value != 'relevant');
				break;
			case 'required':
				this.forces__flags(8, value === true || value == 'required');
				break;
			default:
				// exit
				return this;
		}
		return this.data('-tf-@'+name, value === true ? name : value).forces_recalculate();
	};

	$.fn.forces_removeAttr = function(name) {
		switch (name) {
			case 'relevant': // irrelevant
				this.forces__flags(2, false);
				break;
			case 'required':
				this.forces__flags(8, false);
				break;
			default:
				// exit
				return this;
		}
		return this.removeData('-tf-@'+name).forces_recalculate();
	};
	
	



	// recalculate all fields
	$.fn.forces_recalculate = function() {
		var e, f = 0;
		
		var _flagEvent = function(e, flag, set, event) {
			e.forces__flags(flag, set);
			e.trigger(event);
		};
		
		return this.each(function() {
			e = $(this);
			f = e.data('-tf-FLAGS');
	
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
	
			// are there invalid fields?
			var invalid = form.find(':text').filter(':-xf-required:-xf-empty');
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
		$(':input').bind('focus blur', $F.inputEventHandler);
	};
	
	



})(jQuery);
}
