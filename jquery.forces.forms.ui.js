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
		CSS_INVALID: 'xf-invalid',
		CSS_MISSING: 'tf-missing',
		CSS_REQUIRED: 'xf-required',
		CSS_SUBMIT_DONE: 'xf-submit-done',
		CSS_SUBMIT_ERROR: 'xf-submit-error',
		CSS_VALID: 'xf-valid',

		// HTML markup
		HTML_ALERT_INLINE: function(message) { return $('<em></em>').addClass(this.CSS_ALERT).text(message); },
		HTML_REQUIRED: function() { return $(document.createElement('abbr')).addClass(this.CSS_REQUIRED).attr('title', 'required').text('*'); },
		HTML_STATUS: function() { return $('<div class="tf-status"><div class="tf-alert inner"><h1>Unable to submit form</h1><ol></ol></div></div>'); },

		// messages
		MSG_INVALID: 'is invalid',
		MSG_INVALID_DATE: 'unrecognised date format',
		MSG_INVALID_EMAIL: 'must contain an email address',
		MSG_INVALID_CONFIRM: 'doesn\'t match ',
		MSG_INVALID_NUMBER: 'must contain only digits',
		MSG_MISSING: 'must be completed',

		// millisecond timers
		MS_ENABLE: 300,
		MS_DISABLE: 0
	});





	// constants (private)
	var DOM_STATUS = '-tfui-status';





	// selectors
	$.extend($.expr[':'], {
		'-tf-form': function(e) {
			return $(e).is('.tf-form');
		},
		'-xf-control': function(e) {
			return $(e).is('.xf-input,.xf-select,.xf-select1,.xf-textarea');
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
		var src = $(this);
		
		var controls = src.closest(':-xf-control');
		controls.find('.xf-alert').remove();

		if (message) {
			controls.append($F.HTML_ALERT_INLINE(message));
		}

		return src;
	};





	// calendar (date picker)
	$F.HTML_CALENDAR = function(config) {
		config = $.extend({ date: $F.DATE_TODAY() }, config);

		var calendar = $('<table class="tf-calendar"><caption>' + $F.dateFormat(config.date, '%B %Y') + '</caption><thead><tr></tr></thead><tbody></tbody></table>')
			.data('-tf-date-seed', new Date(config.date.getTime()))
		;
		
		var first = new Date(config.date.getTime());
		first.setDate(1);
		first = first.getDay();
		var days = '<tr>' + (first > 0 ? '<td colspan="' + first + '"></td>' : '') + '<td>1</td>';
		var last = $F.dateEndOfMonth(config.date);
		for (var i = 2; i < last.getDate(); i++) {
			if ((first + i) % 7 == 1) {
				days += '</tr><tr>';
			}
			days += '<td>' + i + '</td>';
		}
		switch (last.getDay()) {
			case 6:
				days += '<td>' + last.getDate() + '</td>';
			break;
			case 5:
				days += '<td>' + last.getDate() + '</td><td></td>';
			break;
			case 0:
				days += '</tr><tr>';
			default:
				days += '<td>' + last.getDate() + '</td><td colspan="' + (6 - last.getDay()) + '"></td>';
		}
		calendar.find('tbody').html(days + '</tr>');
		
		var day = $F.WEEKDAYS();
		for (var i = 0; i < 7; i++) {
			calendar.find('thead tr').append('<th scope="col" title="' + day[i] + '">' + day[i].substr(0, 1) + '</th>');
		}

		return calendar;
	};





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
			var control = $(this);

			var message = control.find('fieldset,input,select,textarea').forces_validationMessage();

			if (!message) {

				var type = control.find(':text').forces_attr('type');
				switch (type) {
		
					case 'email':
						message = $F.MSG_INVALID_EMAIL;
					break;
		
					case 'date':
						message = $F.MSG_INVALID_DATE;
					break;
		
					case 'number':
						message = $F.MSG_INVALID_NUMBER;
					break;
		
					default:
						var confirmation = control.find('input,select,textarea').forces_isConfirmationFor();
						if (confirmation) {
							message = $F.MSG_INVALID_CONFIRM + confirmation.closest(':-xf-control').find(':-xf-label').text().replace(/[?: ]*$/, '');
						} else {
							message = 'invalid';
						}
				}
			}
		
			control
				.removeClass($F.CSS_VALID)
				.addClass($F.CSS_INVALID)
				.forces_alert(message)
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
	;
		
	



	// submission UI
	$(':-tf-form')

		.live($F.EVENT_XF_SUBMIT_ERROR, function() {

		var form = $(this);
			var controls = form.find($F.EXPR_HTML_CONTROLS);

			var status = form.data(DOM_STATUS) || form.data(DOM_STATUS, $F.HTML_STATUS()).data(DOM_STATUS);
			var errorList = $('<ol></ol>');
			var alert;
			
			controls
				.filter(':-xf-invalid')
					.each(function() {
						var widget = $(this);
						var confirmation = widget.forces_isConfirmationFor();

						if (alert = widget.forces_validationMessage()) {
							// message already known

						} else if (widget.is(':-xf-empty')) {
							alert = $F.MSG_MISSING;

						} else if (confirmation) {
							alert = $F.MSG_INVALID_CONFIRM + confirmation.closest(':-xf-control').find(':-xf-label').text().replace(/[?: ]*$/, '');
							
						} else {
							switch (widget.forces_attr('type')) {
								case 'date':
									alert = $F.MSG_INVALID_DATE;
								break;
								case 'email':
									alert = $F.MSG_INVALID_EMAIL;
								break;
								case 'number':
									alert = $F.MSG_INVALID_NUMBER;
								break;
							}
						}

						var link = $('<a href="#' + widget.forces_id() + '">' + widget.closest(':-xf-control').find(':-xf-label').text().replace(/[?:]*$/, ': ') + alert + '</a>');
						errorList.append($('<li></li>').append(link));
						alert = $F.MSG_INVALID;
					})
			;
			
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
			status.forces_id('status-alert');
			status
				.scrollTo({ hash: true, focus: true })
				.shake({ interval: 250, distance: 8, shakes: 1 })
			;

			controls
				.filter(':-xf-required:not(:-xf-empty,:-xf-invalid)')
					.forces_alert()
			;
			controls
				.filter(':-xf-required:not(:-xf-empty)')
					.closest(':-xf-control')
						.removeClass($F.CSS_MISSING)
			;
			controls
				.filter(':-xf-required:-xf-empty')
					.closest(':-xf-control')
						.addClass($F.CSS_MISSING)
						.forces_alert($F.MSG_MISSING)
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
	$('.xf-required').closest(':-xf-control').find($F.EXPR_HTML_CONTROLS).forces_attr('required', true);





})(jQuery);
}
