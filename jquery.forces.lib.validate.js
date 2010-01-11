/**
 * jquery.forces.forms.validate.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.extend($.forces || {}, {
	});





	/* Luhn algorithm number checker - (c) 2005-2009 - planzero.org            *
	 * This code has been released into the public domain, however please      *
	 * give credit to the original author where possible.                      */
	$F.isValidLuhn = function(number) {
		// Set the string length and parity
		var number_length = number.length;
		var parity = number_length % 2;

		// Loop through each digit and do the maths
		var total = 0;
		for (i = 0; i < number_length; i++) {
			var digit=number.charAt(i);
			// Multiply alternate digits by two
			if (i % 2 == parity) {
				digit = digit * 2;
				// If the sum is two digits, add them together (in effect)
				if (digit > 9) {
					digit = digit - 9;
				}
			}
			// Total up the digits
			total = total + parseInt(digit);
		}

		// If the total mod 10 equals 0, the number is valid
		return (total % 10 == 0);
	};


})(jQuery);
}
