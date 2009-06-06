/**
 * jquery.forces.forms.core.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){

	var $F = $.forces = $.forces || {};

// selectors
$.extend($.expr[':'], {
	// (use)theforces
	'-tf-required': function(e) {
		return $(e).data('-tf-@required') === true;
	}
});


// pseudo attr() to support @required
$.fn.forces_attr = function(name, value) {
	switch (typeof(value)) {
		case 'undefined':
			return this.data('-tf-@'+name);
		default:
			return this.data('-tf-@required', value === true || value === 'required');
	}
};
$.fn.forces_removeAttr = function(name) {
	return this.removeData('-tf-@'+name);
};


})(jQuery);
}
