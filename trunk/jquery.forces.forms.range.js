/**
 * jquery.forces.forms.range.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */





// convert to a range control
$.fn.forces_toRange = function() {
	if ($('<input type="range" />').attr('type') != 'range') {
		return this;
	}

	return this.map(function() {
			if (this.tagName.toLowerCase() == 'select') {
				var options = $(this)
					.find('option')
						.map(function() {
							return parseFloat($(this).val());
						})
						.sort()
				;

				if (isNaN(options[options.length - 1])) {
					return this;
				}
				
				var range = $('<input type="range" />');
				range.attr('min', options[0]);
				return range.get(0);
			} else {
				return this;
			}
		})
	;
};
