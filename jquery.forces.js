// jquery.forces.js
// usetheforces.googlecode.com

(function($){

// selectors
$.extend($.expr[':'], {
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


})(jQuery);
