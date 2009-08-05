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

<<<<<<< .mine
=======
	// constants
	var IRRELEVANT = '-tf-irrelevant';
	var OPTIONAL = '-tf-optional';
	var RELEVANT = '-tf-relevant';
	var REQUIRED = '-tf-required';
	// attr
	var RELEVANTa = '@'+RELEVANT;
	var REQUIREDa = '@'+REQUIRED;
>>>>>>> .r93

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
<<<<<<< .mine
		f = e.data('-tf-FLAGS');
		// relevant
		switch (f & 3) {
			case 2: // -> irrelevant
				_flagEvent(e, 1, true, '-tf-irrelevant');
			break;
			case 1: // -> relevant
				_flagEvent(e, 1, false, '-tf-relevant');
			break;
=======
		// @relevant
		attr = e.forces_attr('relevant');
		if (attr == null) attr = true;
		
		// bit flags! http://javascript.about.com/library/blbitop.htm
		// forces.toggleState(target, state)
		// where state == bit flags.
		// default bit flags might be 01 == 0(not required)1(relevant)
		
		if (e.is(RELEVANTs) != attr) {
			if (attr) {
				$(document).trigger(RELEVANT, [e.data(RELEVANT, true)]);
			} else {
				$(document).trigger(IRRELEVANT, [e.data(RELEVANT, false)]);
			}
>>>>>>> .r93
		}
<<<<<<< .mine

		switch (f & 12) {
			case 8: // -> required
				_flagEvent(e, 4, true, '-tf-required');
			break;
			case 4: // -> optional
				_flagEvent(e, 4, false, '-tf-optional');
			break;
=======
		// @required
		attr = e.forces_attr('required');
		if (e.is(REQUIREDs) != attr) {
			if (attr) {
				$(document).trigger(REQUIRED, [e.data(REQUIRED, true)]);
			} else {
				$(document).trigger(OPTIONAL, [e.data(REQUIRED, false)]);
			}
>>>>>>> .r93
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



})(jQuery);
}
