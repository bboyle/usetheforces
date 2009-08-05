/**
 * jquery.forces.forms.ui.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {

(function($){

	var $F = $.forces = $.forces || {};

$(document).bind($.forces.EVENT_REQUIRED, function(evt) {
	$(evt.target).before('<abbr class="required" title="required">*</abbr>');
});
$(document).bind($.forces.EVENT_OPTIONAL, function(evt) {
	$(evt.target).prev('abbr.required').remove();
});


})(jQuery);
}
