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
	$F.CSS_SUBMIT_DONE = 'xf-submit-done';
	$F.CSS_ACTIVE = 'tf-active';
	$F.CSS_VALID = 'xf-valid';
	$F.CSS_INVALID = 'xf-invalid';
	$F.CSS_MISSING = 'tf-missing';
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
			return $(e).is('.xf-input, .xf-select, .xf-textarea');
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
				.find($F.EXPR_HTML_CONTROLS)
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
				.find($F.EXPR_HTML_CONTROLS)
					.each(function() {
						// DOM more robust than jquery here
						this.setAttribute('disabled', 'disabled');
					})
				.end()
				.stop(true, true)
				.hide($F.MS_DISABLE)
			;
		})

		.live($F.EVENT_XF_VALID, function() {
			$(this)
				.removeClass($F.CSS_INVALID)
				.addClass($F.CSS_VALID)
			;
		})

		.live($F.EVENT_XF_INVALID, function() {
			$(this)
				.removeClass($F.CSS_VALID)
				.addClass($F.CSS_INVALID)
			;
		})

		.live($F.EVENT_XF_FOCUS_IN, function() {
			$(this)
				.addClass($F.CSS_ACTIVE)
			;
		})

		.live($F.EVENT_XF_FOCUS_OUT, function() {
			$(this)
				.removeClass($F.CSS_ACTIVE)
			;
		})
	;
	
	



	// submission UI
	$(':-tf-form')

		.live($F.EVENT_XF_SUBMIT_ERROR, function() {
			var form = $(this);
			var status = form.data(DOM_STATUS) || form.data(DOM_STATUS, $($F.HTML_STATUS)).data(DOM_STATUS);
			var errorList = $('<ol></ol>');
			var alert;

			form
				.addClass($F.CSS_SUBMIT_ERROR)
				.find(':text')
					.filter(':-xf-required:-xf-empty, :-xf-invalid')
						.each(function() {
							var widget = $(this);
							if (widget.is(':-xf-empty')) {
								alert = 'must be completed';
							} else {
								switch (widget.forces_attr('type')) {
									case 'date':
										alert = 'unrecognised date format';
									break;
									case 'email':
										alert = 'must contain an email address';
									break;
								}
							}
							var link = $('<a href="#' + widget.forces_id() + '">' + widget.closest(':-xf-control').find(':-xf-label').text() + ': ' + alert + '</a>').click(function() { widget.scrollTo({ ancestor: ':-xf-control', hash: true, focus: true }); return false });
							errorList.append($('<li></li>').append(link));
						})
					.end()
				.end()
				.before(
					status
						.find('ol')
							.replaceWith(errorList)
						.end()
						.fadeIn(300)
				)
			;
			status.forces_id('status-alert');
			status
				.scrollTo({ hash: true, focus: true })
				.shake({ interval: 250, distance: 8, shakes: 1 })
			;
		})

		.live($F.EVENT_TF_SUBMIT_SUPPRESSED, function() {
			$(this).find(':submit').shake({ interval: 75, distance: 4, shakes: 2 });
		})

		.live($F.EVENT_XF_SUBMIT_DONE, function() {
			var form = $(this);
			if (form.data(DOM_STATUS)) form.data(DOM_STATUS).remove();
			form
				.removeClass($F.CSS_SUBMIT_ERROR)
				.addClass($F.CSS_SUBMIT_DONE)
			;
		})
	;



	

	// auto enable
	$('.usetheforces').forces_enable();
	$('.xf-required').closest(':-xf-control').find(':text').forces_attr('required', true);





})(jQuery);
}
