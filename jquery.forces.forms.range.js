/**
 * jquery.forces.forms.range.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */





// convert to a range control
$.fn.forces_toRange = function() {

	return this.map(function() {
			if (this.tagName.toLowerCase() == 'select') {
				return $('<input type="range" />').get(0);
			} else {
				return this;
			}
		})
	;
};
