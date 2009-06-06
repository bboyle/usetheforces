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
	var OPTIONAL = '-tf-OPTIONAL';
	var REQUIRED = '-tf-REQUIRED';
	// attr
	var REQUIREDa = '@'+REQUIRED;


// selectors
$.extend($.expr[':'], {
	'-tf-REQUIRED': function(e) {
		return $(e).data(REQUIRED) === true;
	}
});


// (PUBLIC) constants
var REQUIREDs = $F.SELECTOR_REQUIRED = ':-tf-REQUIRED';
$F.EVENT_OPTIONAL = OPTIONAL;
$F.EVENT_REQUIRED = REQUIRED;


// pseudo attr() to support @required
$.fn.forces_attr = function(name, value) {
	switch (typeof(value)) {
		case 'undefined':
			return this.data(REQUIREDa);
		default:
			return this.data(REQUIREDa, value === true || value === 'required').forces_recalculate();
	}
};
$.fn.forces_removeAttr = function(name) {
	return this.removeData(REQUIREDa).forces_recalculate();
};


// recalculate all fields
$.fn.forces_recalculate = function() {
	var e, attr;
	return this.each(function() {
		e = $(this);
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
