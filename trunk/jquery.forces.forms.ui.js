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
	console.log('REQUIRED', evt.target);
	$(evt.target).before('<abbr style="color: red">*</abbr>');
});
$(document).bind($.forces.EVENT_OPTIONAL, function(evt) {
	console.log('OPTIONAL', evt.target);
	$(evt.target).prev('abbr').remove();
});


})(jQuery);
}
