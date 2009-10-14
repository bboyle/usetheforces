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
	'-tf-form': function(e) {
		return $(e).is('.tf-form');
	},
	'-xf-control': function(e) {
		return $(e).is('.xf-input,.xf-select,.xf-group');
	},
	'-xf-group': function(e) {
		return $(e).is('.xf-group');
	},
	'-xf-label': function(e) {
		return $(e).is('.xf-label');
	}
});


// event: required/optional toggle
$(document).bind($F.EVENT_REQUIRED, function(evt) {
	// TODO don't duplicate * if already present in UI!
	$(evt.target).closest(':-xf-control').find(':-xf-label').after('<abbr class="xf-required" title="required">*</abbr>');
});
$(document).bind($F.EVENT_OPTIONAL, function(evt) {
	$(evt.target).closest(':-xf-control').find('.xf-required').remove();
});
$(document).bind($F.EVENT_SUBMIT_ERROR, function(evt, invalidFields) {
	$(evt.target).closest(':-tf-form').before('<div class="tf-status"><div class="tf-alert inner"><h1>Unable to submit form</h1></div></div>');
});


})(jQuery);
}
