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
	 * @param cfg { interval: 250, distance: 8, shakes: 2 }
	 * - interval (integer, optional) The number of ms between animations
	 * - distance (integer, optional) Pixel distance to shake the ui element left and right of its initial position
	 * - shakes   (integer, optional) The number of times to shake the ui element
	 * @return this jQuery object, to facilitate chaining
	 */
	$.fn.shake = function(cfg) {
		// default config for optional arguments
		cfg = $.extend({ interval: 75, distance: 10, shakes: 2 }, cfg);
		
		// store original margin offsets
		var leftMargin = parseInt($(this).css('marginLeft')) || 0;
		var rightMargin = parseInt($(this).css('marginRight')) || 0;
		
		for (var i = 0; i < cfg.shakes; i++) {
			$(this)
				.animate({ marginLeft: leftMargin-cfg.distance, marginRight: rightMargin+cfg.distance }, cfg.interval)
				.animate({ marginLeft: leftMargin+cfg.distance, marginRight: rightMargin-cfg.distance }, cfg.interval)
			;
		}
		
		// reset margins to original offsets
		return $(this).animate({ marginLeft: leftMargin, marginRight: rightMargin }, cfg.interval);
	};





})(jQuery);
}
