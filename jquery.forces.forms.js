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


})(jQuery);
