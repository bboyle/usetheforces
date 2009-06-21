/**
 * jquery.forces.forms.core.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){

	var $F = $.forces = $.forces || {};

	// constants
	var IRRELEVANT = '-tf-irrelevant';
	var OPTIONAL = '-tf-optional';
	var RELEVANT = '-tf-FOO';
	var REQUIRED = '-tf-required';
	// attr
	var RELEVANTa = '@'+RELEVANT;
	var REQUIREDa = '@'+REQUIRED;


// selectors
$.extend($.expr[':'], {
	'-tf-irrelevant': function(e) {
		return $(e).data(RELEVANT) === false;
	},
	'-tf-relevant': function(e) {
		var relevance = $(e).data(RELEVANT);
		return relevance === undefined || relevance === true;
	},
	'-tf-required': function(e) {
		return $(e).data(REQUIRED) === true;
	}
});


// (PUBLIC) constants
var IRRELEVANTs = $F.SELECTOR_IRRELEVANT = ':-tf-irrelevant';
var RELEVANTs = $F.SELECTOR_RELEVANT = ':-tf-relevant';
var REQUIREDs = $F.SELECTOR_REQUIRED = ':-tf-required';
$F.EVENT_IRRELEVANT = IRRELEVANT;
$F.EVENT_OPTIONAL = OPTIONAL;
$F.EVENT_RELEVANT = RELEVANT;
$F.EVENT_REQUIRED = REQUIRED;


// pseudo attr() to support @required
$.fn.forces_attr = function(name, value) {
	switch (name) {
		case 'relevant':
			return typeof(value) == 'undefined' ? this.data(RELEVANTa) :
				this.data(RELEVANTa, value === true || value === 'relevant').forces_recalculate();
		case 'required':
			return typeof(value) == 'undefined' ? this.data(REQUIREDa) :
				this.data(REQUIREDa, value === true || value === 'required').forces_recalculate();
		default:
			return this;
	}
};
$.fn.forces_removeAttr = function(name) {
	switch (name) {
		case 'relevant':
			name = RELEVANTa;
			break;
		case 'required':
			name = REQUIREDa;
			break;
		default:
			name = null;
	}
	return name ? this.removeData(name).forces_recalculate() : this;
};


// recalculate all fields
$.fn.forces_recalculate = function() {
	var e, attr;
	return this.each(function() {
		e = $(this);
		// @relevant
		attr = e.forces_attr('relevant');
		if (attr == null) attr = true;
		if (e.is(RELEVANTs) != attr) {
			if (attr) {
				console.log('trigger', e, RELEVANT);
				e.data(RELEVANT, true).trigger(RELEVANT);
			} else {
				e.data(RELEVANT, false).trigger(IRRELEVANT);
			}
		}
		// @required
		attr = e.forces_attr('required');
		if (e.is(REQUIREDs) != attr) {
			if (attr) {
				e.data(REQUIRED, true).trigger(REQUIRED);
			} else {
				e.data(REQUIRED, false).trigger(OPTIONAL);
			}
		}
	});
};


})(jQuery);
}
