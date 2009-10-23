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
	$F.CSS_ACTIVE = 'tf-active';
	$F.MS_ENABLE = 300;
	$F.MS_DISABLE = 0;

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
	
	



	// controls UI
	$(':-xf-control')
		.live($F.EVENT_XF_REQUIRED, function() {
			$(this)
				.find('.xf-required')
					.remove()
				.end()
				.find(':-xf-label')
					.after($F.HTML_REQUIRED)
			;
		})
		.live($F.EVENT_XF_OPTIONAL, function() {
			$(this)
				.find('.xf-required')
					.remove()
			;
		})
		.live($F.EVENT_XF_ENABLED, function() {
			$(this)
				.find(':text')
					.each(function() {
						// DOM more robust than jquery here
						this.removeAttribute('disabled');
					})
				.end()
				.stop(true, true)
				.slideDown($F.MS_ENABLE)
			;
		})
		.live($F.EVENT_XF_DISABLED, function() {
			$(this)
				.find(':text')
					.each(function() {
						// DOM more robust than jquery here
						this.setAttribute('disabled', 'disabled');
					})
				.end()
				.stop(true, true)
				.hide($F.MS_DISABLE)
			;
		})
		.live($F.EVENT_XF_FOCUS_IN, function() {
			$(this).addClass($F.CSS_ACTIVE);
		})
		.live($F.EVENT_XF_FOCUS_OUT, function() {
			$(this).removeClass($F.CSS_ACTIVE);
		})
	;
	
	



	// submission UI
	$(':-tf-form').live($F.EVENT_XF_SUBMIT_ERROR, function() {
		var form = $(this);
		var status = form.data(DOM_STATUS) || form.data(DOM_STATUS, $($F.HTML_STATUS)).data(DOM_STATUS);
		var errorList = '';
	
		form
			.addClass($F.CSS_SUBMIT_ERROR)
			.find(':text')
				.filter(':-xf-required:-xf-empty')
					.each(function() {
						errorList += '<li>' + $(this).closest(':-xf-control').find(':-xf-label').text() + '</li>';
					})
				.end()
			.end()
			.before(
				status
					.find('ol')
						.html(errorList)
					.end()
					.fadeIn(300)
					.shake()
					.focus()
			)
		;
		location.hash = status.attr('id') || status.attr('id', $F.generateId()).attr('id');
	});
	
	



	// auto enable
	$('.usetheforces').forces_enable();
	//$('abbr.xf-required').closest(':-xf-control').forces_attr('required', true);





})(jQuery);
}
