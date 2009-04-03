/**
 * jquery.forces.forms.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

(function($){

// selectors
$.extend($.expr[':'], {
	// (use)theforces
	'-tf-blank': function(e) {
		return $.trim($(e).xfValue()).length == 0;
	},
	// xforms
	'-xf-control': function(e) {
		return $(e).is('.xf-input,.xf-select1,.xf-select,.xf-group');
	},
	'-xf-group': function(e) {
		return $(e).hasClass('xf-group');
	},
	'-xf-hint': function(e) {
		return $(e).hasClass('xf-hint');
	},
	'-xf-input': function(e) { 
		return $(e).hasClass('xf-input'); 
	},
	'-xf-invalid' : function(e) {
		return $(e).is(':not(:-xf-valid)');
	},
	'-xf-label': function(e) { 
		return $(e).hasClass('xf-label'); 
	}, 
	'-xf-relevant': function(e) {
		return $(e).relevant();
	},
	'-xf-required': function(e) {
		return $(e).find('.required').size() > 0;
	},
	'-xf-select': function(e) {
		return $(e).hasClass('xf-select');
	},
	'-xf-select1': function(e) {
		return $(e).hasClass('xf-select1');
	},
	'-xf-valid': function(e) {
		return $(e).validate();
	}
	
});


$.fn.extend({
	// get form 
    form: function() { 
        return this.is('form') ? this : this.parents('form'); 
    },


    // get form control
	formControl: function() {
		return this.is(':-xf-control') ? this : this.parents(':-xf-control').eq(0);
	},


	// get/set relevance
	relevant: function(expression) {
		var formControl = this.formControl();
		if (expression) {
			formControl.data('relevant', expression);
		} else {
			expression = formControl.data('relevant', expression) || true;
		}
		var relevant = true;
		if (typeof(expression) == "function") {
			relevant = expression(this);
		} else if (expression) {
			relevant = expression;
		}
		if (relevant != true) {
			// TODO +filter from jquery object
			formControl.hide();
			return false;
		}
		formControl.slideDown();
		return true;
	},
	

	// is control valid
	validate: function() {
		if (this.is(':-tf-blank')) {
			return !this.is(':-xf-required');
		// } else { TODO constraint validation			
		}
		return true;
	},
	

	// get value
	xfValue: function() {
		if (this.find('input:text').size()) {
			return this.find('input:text').val();
		}
		// TODO support textarea, password, radio/checkboxes and select
		return null;
	}
});


// form events
$('form.forces')
	// form control changed
	.bind('change -tf-change',function(eventObject, /* optional */ target) {
		var formControl = $(target||eventObject.target).formControl();
		// evaluate relevance of all controls
		$(':-xf-control:-xf-relevant', formControl.parents('form'));
	})
	.keyup(function(eventObject){
		var formInput = $(eventObject.target);
		if (formInput.data('previousValue') != formInput.val()) {
			formInput.parents('form').trigger('-tf-change',[formInput]).data('previousValue', formInput.val());
		}
	})
	// form was submitted
	.submit(function(eventObject) {
		console.log('submit');

		var form = $(eventObject.target);

		console.log($(':-xf-control', form).size(), "fields");
		console.log($(':-xf-control:-xf-relevant', form).size(), "relevant fields");
		console.log($(':-xf-control:-xf-required', form).size(), "required fields");
		console.log($(':-xf-control:-tf-blank', form).size(), "blank fields");
		console.log($(':-xf-control:-xf-valid', form).size(), "valid fields");
		console.log($(':-xf-control:-xf-relevant:-xf-invalid', form).size(), "invalid (relevant) fields");
		
		// highlight (relevant) invalid controls
		$(':-xf-control:-xf-relevant:-xf-invalid', form).css('background', 'red');

		return false;
	});


})(jQuery);