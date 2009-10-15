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
	$F.EVENT_REQUIRED = '-xf-required';
	$F.EVENT_OPTIONAL = '-xf-optional';
	$F.EVENT_RELEVANT = '-xf-relevant';
	$F.EVENT_IRRELEVANT = '-xf-irrelevant';
	$F.EVENT_SUBMIT_ERROR = '-xf-submit-error';
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
				_flagEvent(e, 1, true, $F.EVENT_IRRELEVANT);
			break;
			case 1: // -> relevant
				_flagEvent(e, 1, false, $F.EVENT_RELEVANT);
			break;
		}
		switch (f & 12) {
			case 8: // -> required
				_flagEvent(e, 4, true, $F.EVENT_REQUIRED);
			break;
			case 4: // -> optional
				_flagEvent(e, 4, false, $F.EVENT_OPTIONAL);
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
$F.submitHandler = function(evt) {
	var form = $(this);

	// is this form being managed by forces?
	if (true) {
		
		// is this submit event too soon after the last one?
		if (form.data(SUBMIT_TIMESTAMP) && evt.timeStamp - form.data(SUBMIT_TIMESTAMP) < $F.SUBMIT_TOLERANCE) {
			// cancel the submit event
			evt.stopImmediatePropagation();
			return false;
		}

		// prevent repeat submit events (store time of submit)
		form.data(SUBMIT_TIMESTAMP, evt.timeStamp);
		
		// validate all fields of unknown validity

		// are there invalid fields?
		var invalid = form.find(':text').filter(':-xf-required:-xf-empty');
		if (invalid.length) {
			// throw a submit error
			form.trigger($F.EVENT_SUBMIT_ERROR);
			// re-enable submit events (delete the stored submit time)
			form.removeData(SUBMIT_TIMESTAMP);
			// cancel this submit event
			return false;
		}
	}

	// submission is ok
	return true;
};
$('form').live('submit', $F.submitHandler);


/* TODO disable forces
$.fn.forces_disable( = function) {
	$('form').die('submit', $F.SubmitHandler);
}*/



})(jQuery);
}
