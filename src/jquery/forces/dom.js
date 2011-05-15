/**
 * jquery.forces.dom.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!=="undefined") {
(function($){

	// jquery.forces
	var $F = $.forces = $.forces || {};
	// constants (private)
	var ID_COUNTER = 0;





	// generate a new id
	// this id should be unique
	// uniqueness is not checked (why? performance), be alert but not alarmed
	// http://www.w3.org/TR/xslt#function-generate-id
	$F.generateId = function() {
		return 'tf-ID-' + ++ID_COUNTER;
	};





	// returns the @id of first element in list
	// or assigns the suggested id
	// or assigns a new unique id
	// based (in part) on http://www.w3.org/TR/xslt#function-generate-id
	$.fn.forces_id = function(suggestedId) {
		var j = $(this);
		if (!suggestedId || document.getElementById(suggestedId)) {
			suggestedId = $F.generateId();
		}
		return j.attr('id') || j.attr('id', suggestedId).attr('id');
	};



	
	
})(jQuery);
} /* if jQuery */