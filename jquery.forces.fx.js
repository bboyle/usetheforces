/**
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
