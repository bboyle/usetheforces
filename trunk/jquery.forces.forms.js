/** 
 * jquery.forces.forms.js 
 * @see http://usetheforces.googlecode.com/ 
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html> 
 * @requires jQuery 
 */

(function($){

// selectors 
$.extend($.expr[':'], { 
	'-xf-control': function(e) { 
		return $(e).is('.xf-input,.xf-select1,.xf-group'); 
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
	'-xf-label': function(e) { 
		return $(e).hasClass('xf-label'); 
	}, 
	'-xf-select1': function(e) { 
		return $(e).hasClass('xf-seelct1'); 
	}, 
});


$.fn.extend({ 
	// get form control 
	formControl: function() { 
		return this.is(':-xf-control') ? this : this.parents(':-xf-control').eq(0); 
	},

	// recalculate 
	recalculate: function() { 
		this.relevant(); 
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
	} 
});


// form control changes 
$('form.forces').change(function(eventObject) { 
var formControl = $(eventObject.target).formControl();
	// recalculate all controls 
	// TODO rather than use "each", make functions work with jQuery object 
	$(':-xf-control', formControl.parents('form')).each(function() { 
		$(this).recalculate(); 
	}); 
});


})(jQuery);