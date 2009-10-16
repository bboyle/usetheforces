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
	// CONSTANTS (public)
	$F.HTML_REQUIRED = '<abbr class="xf-required" title="required">*</abbr>';
	$F.HTML_STATUS = '<div class="tf-status"><div class="tf-alert inner"><h1>Unable to submit form</h1><ol></ol></div></div>';
	$F.CSS_SUBMIT_ERROR = 'xf-submit-error';
	// constants (private)
	var DOM_STATUS = '-tfui-status';


// selectors
$.extend($.expr[':'], {
	'-tf-form': function(e) {
		return $(e).is('.tf-form');
	},
	'-xf-control': function(e) {
		return $(e).is('.xf-input,.xf-select');
	},
	'-xf-group': function(e) {
		return $(e).is('.xf-group');
	},
	'-xf-label': function(e) {
		return $(e).is('.xf-label');
	}
});


$(':-xf-control')
.live($F.EVENT_REQUIRED, function() {
	$(this)
		.find('.xf-required').remove().end()
		.find(':-xf-label').after($F.HTML_REQUIRED);
})
.live($F.EVENT_OPTIONAL, function() {
	$(this).find('.xf-required').remove();
});

$(':-tf-form').live($F.EVENT_SUBMIT_ERROR, function() {
	//  focus/scrollTo (location.hash) ?
	var form = $(this);
	var status = form.data(DOM_STATUS) || form.data(DOM_STATUS, $($F.HTML_STATUS)).data(DOM_STATUS);
	var errorList = '';

	form
	.addClass($F.CSS_SUBMIT_ERROR)
	.find(':text')
		.filter(':-xf-required:-xf-empty').each(function() {
			errorList += '<li>' + $(this).closest(':-xf-control').find(':-xf-label').text() + '</li>';
		})
		.end()
	.end()
	.before(status.find('ol').html(errorList).end().fadeIn(300).focus());
	location.hash = status.attr('id') || status.attr('id', $F.generateId()).attr('id');
});


// setup
//$('abbr.xf-required').closest(':-xf-control').forces_attr('required', true);


})(jQuery);
}
