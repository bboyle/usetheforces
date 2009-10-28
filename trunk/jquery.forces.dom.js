/**
 * jquery.forces.dom.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){

	// jquery.forces
	var $F = $.forces = $.forces || {};





	$.fn.forces_id = function(id) {
		var j = $(this);
		if (!id || document.getElementById(id)) {
			id = $F.generateId();
		}
		return j.attr('id') || j.attr('id', id).attr('id');
	};



	
	
})(jQuery);
} /* if jQuery */