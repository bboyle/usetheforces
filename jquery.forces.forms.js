// jquery.forces.forms.js
// usetheforces.googlecode.com

(function($){

// selectors
$.extend($.expr[':'], {
	'-xf-control': function(e) {
		return $(e).is('.xf-input');
	},
	'-xf-hint': function(e) {
		return $(e).hasClass('xf-hint');
	},
	'-xf-input': function(e) {
		return $(e).hasClass('xf-input');
	},
	'-xf-label': function(e) {
		return $(e).hasClass('xf-label');
	},
});


$.fn.extend({
	// get form control
	formControl: function() {
		return this.is(':-xf-control') ? this : this.parents(':-xf-control').eq(0);
	},

	// recalculate
	recalculate: function() {
		if (this.relevant()) this.show();
		else this.hide();
	},

	// get/set relevance
	relevant: function(expression) {
		var formControl = this.formControl();
		if (expression) {
			formControl.data('relevant', expression);
		} else {
			expression = formControl.data('relevant', expression);
		}

		var relevant = true;
		if (typeof(expression) == "boolean") {
			relevant = expression;
		} else if (typeof(expression) == "function") {
			relevant = expression(this) == true;
		}
		
		if (!relevant) {
			// TODO +filter from jquery object
			formControl.hide()
			return false;
		}
		
		// default
		formControl.show();
		return true;
	}
});


// form control changes
$('form.forces').change(function(eventObject) {

	var formControl = $(eventObject.target).formControl();

	// recalculate all controls
	// TODO rather than use "each", make functions work with jQuery object
	$(':-xf-control', formControl.parents('form')).each(function (i) {
		$(this).recalculate();
	});
});


})(jQuery);
