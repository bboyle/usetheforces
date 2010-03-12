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
				var select = $(this);
				var options = select
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
				range.attr('max', options[options.length - 1]);
				range.attr('step', options[1] - options[0]);
				range.val(select.val());
				
				var copyAttributes = ['id', 'name', 'class', 'title'];
				while (copyAttributes.length) {
					var key = copyAttributes.shift();
					range.attr(key, select.attr(key));
				}
				
				select.replaceWith(range);
				
				return range.get(0);
			} else {
				return this;
			}
		})
	;
};
