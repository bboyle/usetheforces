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
	// CONSTANTS
	var EVENT_REQUIRED = $F.EVENT_REQUIRED = '-xf-required';
	var EVENT_OPTIONAL = $F.EVENT_OPTIONAL = '-xf-optional';
	var EVENT_RELEVANT = $F.EVENT_RELEVANT = '-xf-relevant';
	var EVENT_IRRELEVANT = $F.EVENT_IRRELEVANT = '-xf-irrelevant';
	$F.SUBMIT_TOLERANCE = 10000;


// selectors
$.extend($.expr[':'], {
	'-tf-irrelevant': function(e) {
		return ($(e).data('-tf-FLAGS') & 1) != 0;
	},
	'-tf-relevant': function(e) {
		return ($(e).data('-tf-FLAGS') & 1) == 0;
	},
	'-tf-required': function(e) {
		return ($(e).data('-tf-FLAGS') & 4) != 0;
	}
});


// pseudo attr() to support @required and @relevant
$.fn.forces_attr = function(name, value) {
	// read
	if (typeof(value) == 'undefined') {
		value = this.data('-tf-@'+name);
		return  value ? value : (this.is(':-tf-'+name) ? name : null);
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
	var e, f = 0, d = $(document);
	
	var _flagEvent = function(e, flag, set, event) {
		e.forces__flags(flag, set);
		d.trigger(event, [e]);
	};
	
	
	return this.each(function() {
		e = $(this);
		f = e.data('-tf-FLAGS');

		// relevant
		switch (f & 3) {
			case 2: // -> irrelevant
				_flagEvent(e, 1, true, EVENT_IRRELEVANT);
			break;
			case 1: // -> relevant
				_flagEvent(e, 1, false, EVENT_RELEVANT);
			break;
		}

		switch (f & 12) {
			case 8: // -> required
				_flagEvent(e, 4, true, EVENT_REQUIRED);
			break;
			case 4: // -> optional
				_flagEvent(e, 4, false, EVENT_OPTIONAL);
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
$(document).bind('submit', function(evt) {
	var form = $(evt.target);

	// is this form being managed by forces?
		
		// is this submit event too soon after the last one?
		if (form.data('-tf-submit') && evt.timeStamp - form.data('-tf-submit') < $F.SUBMIT_TOLERANCE) {
			// cancel the submit event
			evt.stopImmediatePropagation();
			return false;
		}

		// prevent repeat submit events (store time of submit)
		form.data('-tf-submit', evt.timeStamp);
		
		// validate all fields of unknown validity
		// are there invalid fields?
			// throw a submit error
			// re-enable submit events (delete the stored submit time)
			// cancel this submit event

	// submission is ok
	return true;
});



})(jQuery);
}
