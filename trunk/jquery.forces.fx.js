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
