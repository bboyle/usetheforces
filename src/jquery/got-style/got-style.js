/**
 * "Got style?" Some scripts are going to rely on the browser currently having CSS available and enabled.
 * This simple script will test if styles are supported on page load (or earlier if a formed element is provided),
 * then makes the boolean result available via $.browser.gotStyle().
 *
 * jquery.got-style.js
 * @version 0.1
 * Changelog:
 *   *  0.1 Initial implementation
 *
 * @author Andrew Ramsden
 * @see http://irama.org/web/dhtml/got-style/
 * @license GNU GENERAL PUBLIC LICENSE (GPL) <http://www.gnu.org/licenses/gpl.html>
 * 
 * @requires jQuery (tested with 1.3.1) <http://jquery.com/>
 * 
 */
(function($) {// start closure
	
	$.browser.gotStyleCache = null;
	
	$(document).ready(function(){
		$.browser.gotStyle(); // run on DOMLoad
	});
	
	/**
	 * @param DOMNode formedElement A DOMNode that is know to exist at time gotStyle is called.
	 *                i.e: If calling before DOMLoad, provide an element that has a closing tag above.
	 * @returns boolean Whether the browser has CSS available and enabled.
	 */
	$.browser.gotStyle = function (formedElement) {
		
		if ($.browser.gotStyleCache == null) {
			formedElement = formedElement || $('body');
			
			gotStyleTestEl = $('<div id="got-style"></div>')
				.css({
					width    :'1px', // set test dimensions
					height   :'1px',
					padding  : '0', // limit the impact the test element has on the page
					margin   : '0',
					overflow : 'hidden', // ensure layout is preserved for standards-compliant browsers
					zoom     : '1' // trigger hasLayout for IE
				})
			;
			$(formedElement).append(gotStyleTestEl);
			
			//$.debug(testEl.width());
			
			$.browser.gotStyleCache = (gotStyleTestEl.width() == 1) ? true : false ;
			gotStyleTestEl.remove();
		}
		
		return $.browser.gotStyleCache;
	};
	
})(jQuery); /* end closure */
