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
 * jquery.forces.fx.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.forces || {};





	/**
	 * "shake it like a polaroid picture".
	 * shake plugin provides negative feedback to the user by shaking a ui element left and right.
	 * This animation is similar to head shake gesture for "no" in Western cultures.
	 * This approach has been taken for some Mac OS X UIs.
	 * 
	 * @param interval (integer, optional) The number of ms between animations
	 * @param distance (integer, optional) Pixel distance to shake the ui element left and right of its initial position
	 * @param shakes   (integer, optional) The number of times to shake the ui element
	 * @return this jQuery object, to facilitate chaining
	 */
	$.fn.shake = function(/* optional */ interval, /* optional */ distance, /* optional */ shakes ) {
		// init defaults for optional arguments
		var interval = interval || 250;
		var distance = distance || 8;
		var shakes = shakes || 1;
		
		// store original margin offsets
		var leftMargin = parseInt($(this).css('marginLeft'));
		var rightMargin = parseInt($(this).css('marginRight'));
		
		for (var i = 0; i < shakes; i++) {
			$(this)
				.animate({ marginLeft: leftMargin-distance, marginRight: rightMargin+distance }, interval)
				.animate({ marginLeft: leftMargin+distance, marginRight: rightMargin-distance }, interval)
			;
		}
		
		// reset margins to original offsets
		return $(this).animate({ marginLeft: leftMargin, marginRight: rightMargin }, interval);
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
	$F.EVENT_XF_FOCUS_IN = '-xf-focus-in';
	$F.EVENT_XF_FOCUS_OUT = '-xf-focus-out';
	$F.EVENT_XF_REQUIRED = '-xf-required';
	$F.EVENT_XF_OPTIONAL = '-xf-optional';
	$F.EVENT_XF_ENABLED = '-xf-enabled';
	$F.EVENT_XF_DISABLED = '-xf-disabled';
	$F.EVENT_XF_SUBMIT_ERROR = '-xf-submit-error';
	$F.EVENT_XF_SUBMIT_DONE = '-xf-submit-done';
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
	
	



	// pseudo attr() to support @required and @relevant
	$.fn.forces_attr = function(name, value) {
		// read
		if (typeof(value) == 'undefined') {
			value = this.data('-tf-@'+name);
			return  value ? value : (this.is(':-xf-'+name) ? name : null);
		}
		// write
		switch (name) {
			case 'relevant': // irrelevant
				this.forces__flags(2, value !== true && value != 'relevant');
				break;
			case 'required':
				this.forces__flags(8, value === true || value == 'required');
				break;
			default:
				// exit
				return this;
		}
		return this.data('-tf-@'+name, value === true ? name : value).forces_recalculate();
	};

	$.fn.forces_removeAttr = function(name) {
		switch (name) {
			case 'relevant': // irrelevant
				this.forces__flags(2, false);
				break;
			case 'required':
				this.forces__flags(8, false);
				break;
			default:
				// exit
				return this;
		}
		return this.removeData('-tf-@'+name).forces_recalculate();
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
	$F.submitHandler = function(evt) {
		var form = $(this);
	
		// is this form being managed by forces?
		if (true) {
			
			// is this submit event too soon after the last one?
			if (form.data(SUBMIT_TIMESTAMP) && evt.timeStamp - form.data(SUBMIT_TIMESTAMP) < $F.SUBMIT_TOLERANCE) {
				// cancel the submit event
				evt.stopImmediatePropagation();
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





	// TODO enable/disabled forces (partially implemented)
	$('form').live('submit', $F.submitHandler);
	$.fn.forces_enable = function() {
		// support for "live" focus/blur events
		$(':input').bind('focus blur', function(evt) {
			$(evt.target).trigger(evt.type == 'focus' ? $F.EVENT_XF_FOCUS_IN : $F.EVENT_XF_FOCUS_OUT);
		});
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
