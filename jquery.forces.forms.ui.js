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
	}
});


// find "control" element
$.fn.forces_control = function() {
	return this.map(function() {
		var e = $(this);
		return (e.is(':-xf-control') ? e : e.parents(':-xf-control')).get(0);
	});
};


/*
$(document).bind($.forces.EVENT_REQUIRED, function(evt) {
	$(evt.target).before('<abbr class="required" title="required">*</abbr>');
});
$(document).bind($.forces.EVENT_OPTIONAL, function(evt) {
	$(evt.target).prev('abbr.required').remove();
});
*/


})(jQuery);
}
