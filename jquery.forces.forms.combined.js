/*!
 * usetheforces
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */
/**
 * jquery.forces.date.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.forces || {};





	// constants (private)
	var MONTHS = 'January February March April May June July August September October November December'.split(/ /);
	var WEEKDAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/ /);
	var TODAY = new Date();





	// private: _pad a string
	var _pad = function(s, l, c) {
		s = String(s);
		while (s.length < l) s = String(c) + s;
		return s;
	};





	// format a date
	$F.dateFormat = function(date, format) {
		if (!date) return '';
		if (!format) return date.toString();
		return format
			.replace(/YYYY|yyyy|%Y/, date.getFullYear())
			.replace(/MM|%m/, _pad(date.getMonth()+1, 2, '0'))
			.replace(/dd|%d/, _pad(date.getDate(), 2, '0'))
			.replace(/%e/, _pad(date.getDate(), 2, ' '))
			.replace(/d/, date.getDate())
			.replace(/%B/, MONTHS[date.getMonth()])
			.replace(/%A/, WEEKDAYS[date.getDay()]);
	};





	// parse a date
	$F.dateParse = function(s, min, max) {
		s = s.split(/[^A-Za-z0-9]/);

		var base = min || max || TODAY;

		var date = {};
		function setDate(property, value) {
			date[property] = date[property] || value;
		}

		for (var i = 0; i < s.length; i++) {
			if (s[i].match(/^\d{4}$/)) {
				setDate('year', s[i]);
			} else if (s[i].match(/^\d{1,2}$/)) {
				// precedence: date, month, year
				var property = date.date ? (date.month ? 'year' : 'month') : 'date';
				if (property == 'year' && !date.year) {
					s[i] = (base.getFullYear()+"").substring(0,2) + _pad(s[i], 2, '0');
					if (min && min.getFullYear() > s[i]) {
						s[i] += 100;
					} else if (max && max.getFullYear() < s[i]) {
						s[i] -= 100;
					} else if (!min && !max && s[i] > base.getFullYear()+20) {
						s[i] -= 100;
					}
				}
				setDate(property, s[i]);
			}
		}

		if (date.date && date.month && date.year) {
			var d = new Date(date.year, date.month-1, date.date);
			if ($F.dateEquals(d, date.year, date.month, date.date)) {
				return d;
			}
		}

		return null;
	};





	// calculate a date
	// TODO negative values cause errors, as in new Date(-y, -m, -d)
	$F.dateCalc = function(date, delta) {
		delta = $.extend({ year: 0, month: 0, date: 0 }, delta);
		return new Date(
				date.getFullYear() + delta.year,
				date.getMonth() + delta.month,
				date.getDate() + delta.date
		);
	};





	// check date equality
	$F.dateEquals = function(date, y, m, d) {
		return (date.getMonth() == m-1 && date.getDate() == d && date.getFullYear() == y);
	};
	
	



	// return last day in month
	$F.dateEndOfMonth = function(date) {
		date = new Date(date.getFullYear(), date.getMonth(), 31);
		if (date.getDate() != 31) {
			date.setDate(31 - date.getDate());
			date = this.dateCalc(date, { month: -1 });
		}
		return date;
	};





	$F.DATE_TODAY = function() {
		return new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
	};





	$F.WEEKDAYS = function() {
		return WEEKDAYS.slice();
	};





})(jQuery);
}/**
 * jquery.forces.date.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){

	// jquery.forces
	var $F = $.forces = $.forces || {};
	// constants (private)
	var ID_COUNTER = 0;


// format a date
$F.generateId = function() {
	return 'tf-ID-' + ++ID_COUNTER;
};


})(jQuery);
} /* if jQuery *//**
 * jquery.forces.dom.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){

	// jquery.forces
	var $F = $.forces = $.forces || {};





	$.fn.forces_id = function(id) {
		var j = $(this);
		if (!id || document.getElementById(id)) {
			id = $F.generateId();
		}
		return j.attr('id') || j.attr('id', id).attr('id');
	};



	
	
})(jQuery);
} /* if jQuery *//**
 * jquery.forces.fx.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.forces || {};





	$.fn.scrollTo = function(cfg) {
		cfg = $.extend({ hash: false, focus: false, distance: 1 }, cfg);
		var j = $(this).eq(0);

		// location.hash
		if (cfg.hash === true) {
			location.hash = j.forces_id();
		} else if (typeof cfg.hash === "object") {
			location.hash = cfg.hash.forces_id();
		}
		
		// focus
		if (cfg.focus === true) {
			j.focus();
		} else if (typeof cfg.focus == "object") {
			cfg.focus.focus();
		}

		// scroll
		if (cfg.ancestor) {
			j = j.closest(cfg.ancestor);
		}
		$('html,body').animate({ scrollTop: j.offset().top - cfg.distance }, 100);

		return $(this);
	},





	/**
	 * "shake it like a polaroid picture".
	 * shake plugin provides negative feedback to the user by shaking a ui element left and right.
	 * This animation is similar to head shake gesture for "no" in Western cultures.
	 * This approach has been taken for some Mac OS X UIs.
	 * 
	 * @param cfg { interval: 250, distance: 8, shakes: 2 }
	 * - interval (integer, optional) The number of ms between animations
	 * - distance (integer, optional) Pixel distance to shake the ui element left and right of its initial position
	 * - shakes   (integer, optional) The number of times to shake the ui element
	 * @return this jQuery object, to facilitate chaining
	 */
	$.fn.shake = function(cfg) {
		cfg = $.extend({ interval: 75, distance: 10, shakes: 2 }, cfg);
		var j = $(this);
		
		// store original margin offsets
		var leftMargin = parseInt(j.css('marginLeft')) || 0;
		var rightMargin = parseInt(j.css('marginRight')) || 0;
		
		for (var i = 0; i < cfg.shakes; i++) {
			j
				.animate({ marginLeft: leftMargin-cfg.distance, marginRight: rightMargin+cfg.distance }, cfg.interval)
				.animate({ marginLeft: leftMargin+cfg.distance, marginRight: rightMargin-cfg.distance }, cfg.interval)
			;
		}
		
		// reset margins to original offsets
		return j.animate({ marginLeft: leftMargin, marginRight: rightMargin }, cfg.interval);
	};





})(jQuery);
}
/**
 * jquery.forces.forms.core.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.extend($.forces || {}, {
		// CONSTANTS (public)
		EVENT_XF_DISABLED: '-xf-disabled',
		EVENT_XF_ENABLED: '-xf-enabled',

		EVENT_XF_FOCUS_IN: '-xf-focus-in',
		EVENT_XF_FOCUS_OUT: '-xf-focus-out',

		EVENT_XF_OPTIONAL: '-xf-optional',
		EVENT_XF_REQUIRED: '-xf-required',

		EVENT_XF_VALID: '-xf-valid',
		EVENT_XF_INVALID: '-xf-invalid',
		
		EVENT_XF_VALUE_CHANGED: '-xf-value-changed',

		EVENT_XF_SUBMIT_DONE: '-xf-submit-done',
		EVENT_XF_SUBMIT_ERROR: '-xf-submit-error',
		EVENT_TF_SUBMIT_SUPPRESSED: '-tf-submit-suppressed',

		EXPR_HTML_CONTROLS: ':text,select,textarea,.xf-select1 fieldset',
		
		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
		// 1*( atext / "." ) "@" ldh-str 1*( "." ldh-str )
		REXP_EMAIL: /^[A-Za-z!#$%&'*+-\/=?^_`{|}~\.]+@[A-Za-z0-9-]*[A-Za-z0-9]+(?:\.[A-Za-z0-9-]*[A-Za-z0-9]+)+$/,
		
		REXP_NUMBER: /^[0-9]+$/,

		SUBMIT_TOLERANCE: 10000
	});





	// constants (private)
	var SUBMIT_TIMESTAMP = '-tf-submitted';
/*
	// bit flags
	var BIT_IRRELEVANT		= 1;
	var BIT_FLAG_IRRELEVANT	= 2;
	var BIT_REQUIRED		= 4;
	var BIT_FLAG_REQUIRED	= 8;
	var BIT_VALID			= 16;
	var BIT_INVALID			= 32;
*/




	// selectors
	$.extend($.expr[':'], {
		'-tf-not-validated': function(e) {
			return ($(e).data('-tf-FLAGS') & 48) == 0;
		},
		'-xf-empty': function(e) {
			e = $(e);
			if (e.find(':radio,:checkbox').length) {
				return e.find(':checked').length == 0;
			}
			return $.trim(e.val()).length == 0;
		},
		'-xf-invalid': function(e) {
			return ($(e).data('-tf-FLAGS') & 32) == 32;
		},
		'-xf-irrelevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) == 1;
		},
		'-xf-optional': function(e) {
			return ($(e).data('-tf-FLAGS') & 4) == 0;
		},
		'-xf-relevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) == 0;
		},
		'-xf-required': function(e) {
			return ($(e).data('-tf-FLAGS') & 4) == 4;
		},
		'-xf-valid': function(e) {
			return ($(e).data('-tf-FLAGS') & 16) == 16;
		}
	});
	
	



	// pseudo attr() to support @required, @relevant and @type
	$.fn.forces_attr = function(name, value) {
		// read
		if (typeof(value) == 'undefined') {
			value = this.data('-tf-@' + name);
			return value ? value : (this.is(':-xf-' + name) ? name : null);
		}
		// write
		switch (name) {

			case 'relevant': // irrelevant
				this.forces__flags(2, value !== true && value != 'relevant');
			break;
			
			case 'required':
				this.forces__flags(8, value === true || value == 'required');
			break;
			
			case 'type':
			break;

			default:
				// exit
				return this;
		}
		return this.data('-tf-@' + name, value === true ? name : value).forces_recalculate();
	};

	$.fn.forces_removeAttr = function(name) {
		switch (name) {

			case 'relevant': // irrelevant
				this.forces__flags(2, false);
			break;

			case 'required':
				this.forces__flags(8, false);
			break;

			case 'type':
			break;

			default:
				// exit
				return this;
		}
		return this.removeData('-tf-@' + name).forces_recalculate();
	};
	
	



	// recalculate all fields
	$.fn.forces_recalculate = function() {
		var e, f;
		
		var _flagEvent = function(e, flag, set, event) {
			e
				.forces__flags(flag, set)
				.trigger(event)
			;
		};
		
		return this.each(function() {
			e = $(this);
			f = e.data('-tf-FLAGS') || 0;
	
			// relevant
			switch (f & 3) {
				case 2: // -> irrelevant
					_flagEvent(e, 1, true, $F.EVENT_XF_DISABLED);
				break;
				case 1: // -> relevant
					_flagEvent(e, 1, false, $F.EVENT_XF_ENABLED);
				break;
			}
			switch (f & 12) {
				case 8: // -> required
					_flagEvent(e, 4, true, $F.EVENT_XF_REQUIRED);
				break;
				case 4: // -> optional
					_flagEvent(e, 4, false, $F.EVENT_XF_OPTIONAL);
				break;
			}
	
		});
	};
	
	



	// validate
	$.fn.forces_validate = function() {
		return $(this).each(function() {
			var e = $(this);
			var valid = true;
			var value = $.trim(e.val());

			if (value) {
				switch (e.forces_attr('type')) {

					case 'email':
						valid = $F.REXP_EMAIL.exec(value);
					break;
					
					case 'confirm':
						var previous = e.closest('form');
						if (previous.length) {
							previous = previous.find('input');
							for (var i = 1; i < previous.length; i++) {
								if (previous.eq(i).get(0) == this) {
									valid = value == $.trim(previous.eq(i-1).val());
									break;
								}
							}
						}
					break;

					case 'date':
						valid = $F.dateParse(value);
					break;

					case 'number':
						valid = $F.REXP_NUMBER.exec(value);
					break;
				}

				if (valid) {
					e
						.forces__flags(32, false)
						.forces__flags(16, true)
						.trigger($F.EVENT_XF_VALID)
					;
				} else {
					e
						.forces__flags(16, false)
						.forces__flags(32, true)
						.trigger($F.EVENT_XF_INVALID)
					;
				}

			} else {
				e
						.forces__flags(16, false)
						.forces__flags(32, false)
				;
			}
		});
	};





	// toggle flags
	$.fn.forces__flags = function(flag, add) {
		var e;
		this.set = function() {
			e = $(this);
			e.data('-tf-FLAGS', e.data('-tf-FLAGS') | flag);
		};
		this.unset = function() {
			e = $(this);
			e.data('-tf-FLAGS', e.data('-tf-FLAGS') & ~flag);
		};
		return add ? this.each(this.set) : this.each(this.unset);
	};
	
	



	// form submission
	$F.formSubmitHandler = function(evt) {
		var form = $(this);
	
		// is this form being managed by forces?
		if (true) {
			
			// is this submit event too soon after the last one?
			if (form.data(SUBMIT_TIMESTAMP) && evt.timeStamp - form.data(SUBMIT_TIMESTAMP) < $F.SUBMIT_TOLERANCE) {
				// cancel the submit event
				evt.stopImmediatePropagation();
				form.trigger($F.EVENT_TF_SUBMIT_SUPPRESSED);
				return false;
			}
	
			// prevent repeat submit events (store time of submit)
			form.data(SUBMIT_TIMESTAMP, evt.timeStamp);
			
			var controls = form.find($F.EXPR_HTML_CONTROLS);
			// TODO skip already validated fields?
			controls.forces_validate();
	
			// are there invalid fields?
			var invalid = controls.filter(':-xf-required:-xf-empty, :-xf-invalid');
			if (invalid.length) {
				// throw a submit error
				form.trigger($F.EVENT_XF_SUBMIT_ERROR);
				// re-enable submit events (delete the stored submit time)
				form.removeData(SUBMIT_TIMESTAMP);
				// cancel this submit event
				return false;
			}
		}
	
		// submission is ok
		form.trigger($F.EVENT_XF_SUBMIT_DONE);
		return true;
	};





	$F.inputFocusHandler = function(evt) {
		var control = $(evt.target);

		switch (evt.type) {
		
			case 'click':
			case 'focus':
			case 'mousedown':
				control
					.data('-tf-VALUE', control.val())
					.trigger($F.EVENT_XF_FOCUS_IN)
				;
			break;
			
			case 'blur':
				var oldValue = control.data('-tf-VALUE');
				control
					.removeData('-tf-VALUE')
					.trigger($F.EVENT_XF_FOCUS_OUT)
				;
				if (control.val() !== oldValue) {
					control
						.forces_validate()
						.trigger($F.EVENT_XF_VALUE_CHANGED)
					;
				}
			break;
		}
	};





	// TODO enable/disabled forces (partially implemented)
	$.fn.forces_enable = function(enable) {
		$F.toggleFormHandlers(enable, $(this));
	};
	// TODO use namespaced events
	$F.toggleFormHandlers = function(enable, form) {
		form = form || $('form');
		if (enable || enable === undefined) {
			form.bind('submit', $F.formSubmitHandler);
			$('input,select,textarea', form).bind('focus blur click mousedown', $F.inputFocusHandler);
		} else {
			form.unbind('submit');
			$('input,select,textarea', form).unbind('focus blur');
		}
	};
	



})(jQuery);
}
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
		HTML_REQUIRED: '<abbr class="xf-required" title="required">*</abbr>',
		HTML_ALERT_INLINE: '<em class="xf-alert"></em>',
		HTML_STATUS: '<div class="tf-status"><div class="tf-alert inner"><h1>Unable to submit form</h1><ol></ol></div></div>',
		HTML_CALENDAR: '<table class="tf-calendar"><caption>Calendar</caption><thead><tr></tr></thead><tbody></tbody></table>',

		MSG_INVALID: 'is invalid',
		MSG_INVALID_DATE: 'unrecognised date format',
		MSG_INVALID_EMAIL: 'must contain an email address',
		MSG_INVALID_CONFIRM: 'must match ',
		MSG_INVALID_NUMBER: 'must contain only digits',
		MSG_MISSING: 'must be completed',

		CSS_SUBMIT_ERROR: 'xf-submit-error',
		CSS_SUBMIT_DONE: 'xf-submit-done',
		CSS_ACTIVE: 'tf-active',
		CSS_VALID: 'xf-valid',
		CSS_INVALID: 'xf-invalid',
		CSS_MISSING: 'tf-missing',

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
			message = $($F.HTML_ALERT_INLINE).text(message);
			controls.append(message);
		}

		return src;
	};





	// calendar (date picker)
	$F.uiHtmlCalendar = function(config) {
		config = $.extend({ date: $F.DATE_TODAY() }, config);
		var calendar = $($F.HTML_CALENDAR).data('-tf-date-seed', new Date(config.date.getTime()));
		
		calendar.find('caption').text($F.dateFormat(config.date, '%B %Y'));
		
		var first = new Date(config.date.getTime());
		first.setDate(1);
		first = first.getDay();
		var days = '<tr>' + (first > 0 ? '<td colspan="' + first + '"></td>' : '') + '<td>1</td>';
		var last = $F.dateEndOfMonth(config.date);
		// TODO consider i += 7 (create row by row)
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
					.after($F.HTML_REQUIRED)
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

			var message = control.find(':text').forces_attr('type');
			
			switch (message) {

				case 'email':
					message = $F.MSG_INVALID_EMAIL;
				break;

				case 'confirm':
					message = $F.MSG_INVALID_CONFIRM + '"' + control.prev().find(':-xf-label').text().replace(/[?:]*$/, '') + '"';
				break;

				case 'date':
					message = $F.MSG_INVALID_DATE;
				break;

				case 'number':
					message = $F.MSG_INVALID_NUMBER;
				break;

				default:
					message = 'invalid';
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

			var status = form.data(DOM_STATUS) || form.data(DOM_STATUS, $($F.HTML_STATUS)).data(DOM_STATUS);
			var errorList = $('<ol></ol>');
			var alert;
			
			controls
				.filter(':-xf-required:-xf-empty, :-xf-invalid')
					.each(function() {
						var widget = $(this);
						if (widget.is(':-xf-empty')) {
							alert = $F.MSG_MISSING;
						} else {
							switch (widget.forces_attr('type')) {
								case 'date':
									alert = $F.MSG_INVALID_DATE;
								break;
								case 'email':
									alert = $F.MSG_INVALID_EMAIL;
								break;
								case 'confirm':
									alert = $F.MSG_INVALID_CONFIRM + '"' + widget.closest(':-xf-control').prev().find(':-xf-label').text().replace(/[?:]*$/, '') + '"';
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
