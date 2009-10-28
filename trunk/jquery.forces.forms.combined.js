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


	// constants
	var MONTHS = 'January February March April May June July August September October November December'.split(/ /);
	var WEEKDAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/ /);
	var TODAY = new Date();


	// private functions
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
$F.dateCalc = function(date, delta) {
	return new Date(date.getFullYear()+(delta.year||0), date.getMonth()+(delta.month||0), date.getDate()+(delta.date||0));
};


// check date equality
$F.dateEquals = function(date, y, m, d) {
	return (date.getMonth() == m-1 && date.getDate() == d && date.getFullYear() == y);
};


$F.DATE_TODAY = function() {
	return new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
};


})(jQuery);
} /* if jQuery *//**
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
	var $F = $.forces = $.forces || {};





	// CONSTANTS (public)
	$F.EVENT_XF_DISABLED = '-xf-disabled';
	$F.EVENT_XF_ENABLED = '-xf-enabled';

	$F.EVENT_XF_FOCUS_IN = '-xf-focus-in';
	$F.EVENT_XF_FOCUS_OUT = '-xf-focus-out';

	$F.EVENT_XF_OPTIONAL = '-xf-optional';
	$F.EVENT_XF_REQUIRED = '-xf-required';

	$F.EVENT_XF_SUBMIT_DONE = '-xf-submit-done';
	$F.EVENT_XF_SUBMIT_ERROR = '-xf-submit-error';
	$F.EVENT_TF_SUBMIT_SUPPRESSED = '-tf-submit-suppressed';

	$F.EXPR_HTML_CONTROLS = ':text, textarea';

	$F.SUBMIT_TOLERANCE = 10000;

	// constants (private)
	var SUBMIT_TIMESTAMP = '-tf-submitted';





	// selectors
	$.extend($.expr[':'], {
		'-xf-empty': function(e) {
			return $.trim($(e).val()).length == 0;
		},
		'-xf-irrelevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) != 0;
		},
		'-xf-optional': function(e) {
			return ($(e).data('-tf-FLAGS') & 4) == 0;
		},
		'-xf-relevant': function(e) {
			return ($(e).data('-tf-FLAGS') & 1) == 0;
		},
		'-xf-required': function(e) {
			return ($(e).data('-tf-FLAGS') & 4) != 0;
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
		var e, f = 0;
		
		var _flagEvent = function(e, flag, set, event) {
			e.forces__flags(flag, set);
			e.trigger(event);
		};
		
		return this.each(function() {
			e = $(this);
			f = e.data('-tf-FLAGS');
	
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
			
			// validate all fields of unknown validity
	
			// are there invalid fields?
			var invalid = form.find(':text').filter(':-xf-required:-xf-empty');
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





	$F.inputEventHandler = function(evt) {
		$(evt.target).trigger(evt.type == 'focus' ? $F.EVENT_XF_FOCUS_IN : $F.EVENT_XF_FOCUS_OUT);
	};





	// TODO enable/disabled forces (partially implemented)
	$.fn.forces_enable = function() {
		$('form').bind('submit', $F.formSubmitHandler);
		// support for "live" focus/blur events
		$($F.EXPR_HTML_CONTROLS).bind('focus blur', $F.inputEventHandler);
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
		.live($F.EVENT_XF_FOCUS_IN, function() {
			$(this).addClass($F.CSS_ACTIVE);
		})
		.live($F.EVENT_XF_FOCUS_OUT, function() {
			$(this).removeClass($F.CSS_ACTIVE);
		})
	;
	
	



	// submission UI
	$(':-tf-form')
		.live($F.EVENT_XF_SUBMIT_ERROR, function() {
			var form = $(this);
			var status = form.data(DOM_STATUS) || form.data(DOM_STATUS, $($F.HTML_STATUS)).data(DOM_STATUS);
			var errorList = $('<ol></ol>');
			form
				.addClass($F.CSS_SUBMIT_ERROR)
				.find(':text')
					.filter(':-xf-required:-xf-empty')
						.each(function() {
							var widget = $(this);
							var alert = 'must be completed';
							var link = $('<a href="#' + widget.forces_id() + '">' + widget.closest(':-xf-control').find(':-xf-label').text() + ': ' + alert + '</a>').click(function() {  widget.scrollTo({ ancestor: ':-xf-control', hash: true, focus: true }); return false });
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
			status.scrollTo({ hash: true, focus: true });
			status.shake({ interval: 250, distance: 8, shakes: 1 });
		})
		.live($F.EVENT_TF_SUBMIT_SUPPRESSED, function() {
			$(this).find(':submit').shake({ interval: 75, distance: 4, shakes: 2 });
		})
	;



	

	// auto enable
	$('.usetheforces').forces_enable();
	$('.xf-required').closest(':-xf-control').find(':text').forces_attr('required', true);





})(jQuery);
}
