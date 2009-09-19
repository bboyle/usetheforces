/**
 * jquery.forces.forms.ui.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {

(function($){
	// jquery.forces
	var $F = $.forces = $.forces || {};


// selectors
$.extend($.expr[':'], {
	'-xf-control': function(e) {
		return $(e).is('.xf-input,.xf-select');
	},
	'-xf-label': function(e) {
		return $(e).is('.xf-label');
	}
});


// find "control" element
$.fn.forces_control = function() {
	return this.map(function() {
		var e = $(this);
		return (e.is(':-xf-control') ? e : e.parents(':-xf-control')).get(0);
	});
};


// find "label" element
$.fn.forces_label = function() {
	return this.map(function() {
		var e = $(this);
		if (e.is(':-xf-label')) {
			return e;
		}
		if (!e.is(':-xf-control')) {
			e = e.forces_control();
		}
		return e.find('.xf-label').get(0);
	});
};


// event: required/optional toggle
$(document).bind($F.EVENT_REQUIRED, function(evt, target) {
	target.forces_label().after('<abbr class="xf-required" title="required">*</abbr>');
});
$(document).bind($F.EVENT_OPTIONAL, function(evt, target) {
	target.forces_control().find('.xf-required').remove();
});


})(jQuery);
}
