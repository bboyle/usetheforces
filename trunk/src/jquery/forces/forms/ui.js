/**
 * jquery.forces.forms.ui.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.extend($.forces || {}, {
		// CONSTANTS (public)
		
		// css class names
		CSS_ACTIVE: 'tf-active',
		CSS_ALERT: 'xf-alert',
		CSS_HINT: 'xf-hint',
		CSS_INVALID: 'xf-invalid',
		CSS_MISSING: 'tf-missing',
		CSS_REQUIRED: 'xf-required',
		CSS_SUBMIT_DONE: 'xf-submit-done',
		CSS_SUBMIT_ERROR: 'xf-submit-error',
		CSS_VALID: 'xf-valid',

		// messages
		MSG_INVALID: 'is invalid',
		MSG_TYPE_MISMATCH: {
			'date': 'unrecognised date format',
			'email': 'must contain an email address',
			'number': 'must contain only digits'
		},
		MSG_MISSING: 'must be completed',
		MSG_SUBMIT_ERROR: 'Unable to process this form',

		// HTML markup
		HTML_ALERT_INLINE: function(message) { return $('<em></em>').addClass(this.CSS_ALERT).text(message); },
		HTML_HINT_INLINE: function(message) { return $('<small class="xf-hint"></small>').addClass(this.CSS_HINT).text(message); },
		HTML_REQUIRED: function() { return $(document.createElement('abbr')).addClass(this.CSS_REQUIRED).attr('title', 'required').text('*'); },
		HTML_STATUS: function() { return $('<div class="tf-status"><div class="tf-alert inner"><h1>' + this.MSG_SUBMIT_ERROR + '</h1><ol></ol></div></div>'); },
		HTML_STATUS_ID: 'tf-status-alert',

		// millisecond timers
		MS_ENABLE: 300,
		MS_DISABLE: 0
	});





	// constants (private)
	var DOM_STATUS = '_tfui_status';





	// selectors
	$.extend($.expr[':'], {
		'-tf-form': function(e) {
			return $(e).is('.tf-form');
		},
		'-xf-control': function(e) {
			return $(e).is('.xf-input,.xf-select,.xf-select1,.xf-textarea,.xf-secret');
		},
		'-xf-group': function(e) {
			return $(e).is('.xf-group');
		},
		'-xf-label': function(e) {
			return $(e).is('.xf-label');
		}
	});





	// set an alert for a control
	$.fn.forces_alert = function(message) {

		var controls = this.closest(':-xf-control');
		controls.find('.xf-alert').remove();
		
		controls
			.each(function() {
				var control = $(this).children('fieldset').eq(0);
				if (control.length == 0) {
					control = $(this);
				}
				var alertMessage = message || control.forces_validationMessage();
				if (alertMessage) {
					control.append($F.HTML_ALERT_INLINE(alertMessage));
				}
			})
		;

		return this;
	};





	// set a hint message for a control
	$.fn.forces_hint = function(message) {

		var controls = this.closest(':-xf-control');
		controls.find('.xf-hint').remove();

		if (message) {
			controls
				.find('.xf-label')
					.parent()
						.append(
							$F.HTML_HINT_INLINE(message)
						)
			;
		}

		return this;
	};





	// get a label text for a control
	$.fn.forces_label = function() {
		return this
			.closest(':-xf-control')
				.find(':-xf-label')
					.text()
		;
	};





	// validationMessage property
	// PARTIAL: supports custom validity, value missing and type mismatch states
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#dom-cva-validationmessage
	$.fn.forces_validationMessage = function() {
		var e = this.find($F.EXPR_HTML_CONTROLS).eq(0);
		if (e.length == 0) {
			e = this;
		}

		var validityState = e.forces_validity();
		
		if (validityState.valid) {
			return '';

		} else if (validityState.customError) {
			return e.data($F.CUSTOM_VALIDITY);

		} else if (validityState.valueMissing) {
			return $F.MSG_MISSING;

		} else if (validityState.typeMismatch) {
			return $F.MSG_TYPE_MISMATCH[e.forces_attr('type')];
		}
	},





	// controls UI
	$(':-xf-control')

		.live($F.EVENT_XF_REQUIRED, function() {
			$(this)
				.find('.xf-required')
					.remove()
				.end()
				.find(':-xf-label')
					.after($F.HTML_REQUIRED())
			;
		})

		.live($F.EVENT_XF_OPTIONAL, function() {
			$(this)
				.removeClass($F.CSS_MISSING)
				.find('.xf-required')
					.remove()
			;
		})

		.live($F.EVENT_XF_VALID, function() {
			$(this)
				.forces_alert()
				.removeClass($F.CSS_INVALID)
				.addClass($F.CSS_VALID)
			;
		})

		.live($F.EVENT_XF_INVALID, function() {
			$(this)
				.removeClass($F.CSS_VALID)
				.addClass($F.CSS_INVALID)
				.forces_alert()
			;
		})

		.live($F.EVENT_XF_FOCUS_IN, function() {
			var control = $(this);
			var group = control.closest(':-xf-group');
			control
				.closest('form')
					.find('.' + $F.CSS_ACTIVE)
						.not(control, group)
							.removeClass($F.CSS_ACTIVE)
			;
			control
				.add(group)
					.addClass($F.CSS_ACTIVE)
			;
		})
	;
	

	$(':-xf-control, :-xf-group, .section')	
		.live($F.EVENT_XF_ENABLED, function(evt) {
			$(this)
				.find('input,textarea,select,button')
					.each(function() {
						// DOM more robust than jquery here
						//this.removeAttribute('disabled');
						this.disabled = false
					})
				.end()
				.stop(true, true)
				.slideDown($F.MS_ENABLE)
			;
			evt.stopPropagation();
		})

		.live($F.EVENT_XF_DISABLED, function(evt) {
			$(this)
				.find('input,textarea,select,button')
					.each(function() {
						// DOM more robust than jquery here
						//this.setAttribute('disabled', 'disabled');
						this.disabled = true
					})
				.end()
				.stop(true, true)
				.hide($F.MS_DISABLE)
			;
			evt.stopPropagation();
		})
	;
		
	



	// submission UI
	$(':-tf-form')

		.live($F.EVENT_XF_SUBMIT_ERROR, function() {

			var form = $(this);
			var controls = form.find($F.EXPR_HTML_CONTROLS).not($('fieldset:-xf-irrelevant').find($F.EXPR_HTML_CONTROLS));

			var status = form.data(DOM_STATUS);
			if (!status) {
				status = form.data(DOM_STATUS, $F.HTML_STATUS()).data(DOM_STATUS);
				form.prevAll('.tf-status').children('.tf-alert').parent().remove();
			}
			
			var errorList = $('<ol></ol>');
			
			var alerts = controls.filter(':-xf-invalid');
			if (alerts.length) {
				alerts
					.each(function() {
						var widget = $(this);
						var link = $('<a href="#' + widget.forces_id() + '">' + widget.forces_label().replace(/[?:]*$/, ': ') + widget.forces_validationMessage() + '</a>');
						errorList.append($('<li></li>').append(link));
					})
				;
			}
			
			form
				.addClass($F.CSS_SUBMIT_ERROR)
				.before(
					status
						.find('ol')
							.replaceWith(errorList)
						.end()
						.fadeIn(300)
				)
			;
			status.forces_id(this.HTML_STATUS_ID);
			status
				.scrollTo({ hash: true, focus: true })
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



	

	// click links in status alerts
	$('.tf-alert a').live('click', function() {
		var id = $(this).attr('href');

		if (id.indexOf('#') < 0) {
			return true;
		}
		
		$(id.substring(id.indexOf('#')))
			.scrollTo({ ancestor: ':-xf-control', hash: true, focus: true })
		;

		return false;
	});


	// auto enable
	$('.usetheforces').forces_enable(true);
	$('.xf-required').closest(':-xf-control').find(':-tf-html-control').forces_attr('required', true);





})(jQuery);
}
