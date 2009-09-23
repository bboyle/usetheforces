/**
 * jquery.forces.forms.combined.js
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


	// CONSTANTS
	var EVENT_REQUIRED = $F.EVENT_REQUIRED = '-xf-required';
	var EVENT_OPTIONAL = $F.EVENT_OPTIONAL = '-xf-optional';
	var EVENT_RELEVANT = $F.EVENT_RELEVANT = '-xf-relevant';
	var EVENT_IRRELEVANT = $F.EVENT_IRRELEVANT = '-xf-irrelevant';


// selectors
$.extend($.expr[':'], {
	'-tf-irrelevant': function(e) {
		return ($(e).data('-tf-FLAGS') & 1) != 0;
	},
	'-tf-relevant': function(e) {
		return ($(e).data('-tf-FLAGS') & 1) == 0;
	},
	'-tf-required': function(e) {
		return ($(e).data('-tf-FLAGS') & 4) != 0;
	}
});


// pseudo attr() to support @required and @relevant
$.fn.forces_attr = function(name, value) {
	// read
	if (typeof(value) == 'undefined') {
		value = this.data('-tf-@'+name);
		return  value ? value : (this.is(':-tf-'+name) ? name : null);
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
	var e, f = 0, d = $(document);
	
	var _flagEvent = function(e, flag, set, event) {
		e.forces__flags(flag, set);
		d.trigger(event, [e]);
	};
	
	
	return this.each(function() {
		e = $(this);
		f = e.data('-tf-FLAGS');

		// relevant
		switch (f & 3) {
			case 2: // -> irrelevant
				_flagEvent(e, 1, true, EVENT_IRRELEVANT);
			break;
			case 1: // -> relevant
				_flagEvent(e, 1, false, EVENT_RELEVANT);
			break;
		}

		switch (f & 12) {
			case 8: // -> required
				_flagEvent(e, 4, true, EVENT_REQUIRED);
			break;
			case 4: // -> optional
				_flagEvent(e, 4, false, EVENT_OPTIONAL);
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
$(document).bind('submit', function(evt) {
	var form = $(evt.target);

	// is this form being managed by forces?
		
		// is this submit event too soon after the last one?
			// cancel the submit event
		// prevent repeat submit events (store time of submit)
		
		// validate all fields of unknown validity
		// are there invalid fields?
			// throw a submit error
			// re-enable submit events (delete the stored submit time)
			// cancel this submit event

	// submission is ok
	return true;
});



// selectors
$.extend($.expr[':'], {
	'-xf-control': function(e) {
		return $(e).is('.xf-input,.xf-select');
	},
	'-xf-label': function(e) {
		return $(e).is('.xf-label');
	}
});


// find "control" element
$.fn.forces_control = function() {
	return this.map(function() {
		var e = $(this);
		return (e.is(':-xf-control') ? e : e.parents(':-xf-control')).get(0);
	});
};


// find "label" element
$.fn.forces_label = function() {
	return this.map(function() {
		var e = $(this);
		if (e.is(':-xf-label')) {
			return e;
		}
		if (!e.is(':-xf-control')) {
			e = e.forces_control();
		}
		return e.find('.xf-label').get(0);
	});
};


// event: required/optional toggle
$(document).bind($F.EVENT_REQUIRED, function(evt, target) {
	target.forces_label().after('<abbr class="xf-required" title="required">*</abbr>');
});
$(document).bind($F.EVENT_OPTIONAL, function(evt, target) {
	target.forces_control().find('.xf-required').remove();
});


})(jQuery);
} /* if jQuery */