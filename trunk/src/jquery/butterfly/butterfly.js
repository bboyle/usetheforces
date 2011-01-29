/**
 * "Float like a butterfly"
 *              Muhammad Ali (a not-so-lightboxer).
 * 
 * jquery.butterfly is a fairly light-weight and fully accessible lightbox implementation for jQuery.
 * 
 * jquery.butterfly.js
 * @version 0.4
 * Changelog:
 *   *  0.1 Initial implementation.
 *   *  0.2: Support for resizing added
 *   *  0.3: Support added for callback functions (open/close/resize pre and post events). Error handling added for when lightbox target resource doesn't exist.
 *   *  0.4: Accessibility features added (controlling focus for user initiated lightboxes, keyboard support) - as per: http://irama.org/web/dhtml/lightbox/#accessibility
 *
 *
 * @author Andrew Ramsden <http://irama.org/>
 * @see http://irama.org/web/dhtml/butterfly/
 * @license GNU GENERAL PUBLIC LICENSE (GPL) <http://www.gnu.org/licenses/gpl.html>
 * 
 * @requires jQuery (tested with 1.4.1) <http://jquery.com/>
 * @requires jQuery jARIA plugin <http://outstandingelephant.com/jaria/>
 * 
 * @optional (but reccommended) jQuery ResizeEvents plugin <http://irama.org/web/dhtml/resize-events/>
 * @optional (but reccommended) jQuery Got Style? plugin <http://irama.org/web/dhtml/got-style/>
 * @optional (but reccommended) jQuery ARIA keyboard navigation plugin <http://irama.org/web/dhtml/aria/key-nav/>
 *
 */
jQuery.butterfly = {};

jQuery.butterfly.defaultOptions = {
	contentDefaultWidth: null, // for content (can be em, % or px) - null default means 50em if pxToEm is available or 700px otherwise (a good line length for legibility)
	contentDefaultHeight: '100%', // for content (can be em, % or px)
	mediaMaxWidth: '100%', // for images (can be em, % or px)
	mediaMaxHeight: '100%', // for images (can be em, % or px)
	treatAsMedia: false, // set to true for content to be resized as if it's media (good for video content)
	lightBoxMargin: null, // margin around screen (can be em, % or px) - null default == 2em if pxToEm is available or 20px otherwise
	animateResize: true,
	animationSpeed: 250,
	collapseHeightWhenPossible: true, // when content is shorter than available height, collapse height of lightbox
	reuseFragment: false, // when using a fragment from the same page as the link, reuse the same DOM nodes (persisting their state) or clone a new copy?
	closeButton: false, // Should we have a close button?
	closeButtonImage: '', // set to the path of your close button image
	closeButtonCorner: 'tl', // top left 'tl' or top right 'tr' or bottom left (bl) or bottom right (br) - top left is the most intuitive option that doesn't overlap scrollabrs
	clickOverlayCloses: true, // Will clicking the overlay layer (the dark tinted area) close the lightbox?
	zoomFromClicked: false, // experiemental
	callbackPreOpen: null, // six callback functions can be defined that will be called at various points in the opening, closing and resizing of lightboxes
	callbackPreResize: null,
	callbackPostResize: null,
	callbackPostOpen: null,
	callbackPreClose: null,
	callbackPostClose: null
};

jQuery.butterfly.conf = {
	overlayOpacity: .7
};

(function($) {// start closure
	
	// On DOMLoad
	$(function(){
			
		
		// If ResizeEvents plugin is available, listen for resize events
			if (typeof ResizeEvents != 'undefined') {
				$(this).each(function(){
					ResizeEvents.bind (
						'x-text-resize x-window-resize', // no need to catch 'x-initial-sizes', lightbox not open initially
						resizeLightBox
					);
				});
			}
		
		// Create containers
			$('body').append('<div id="jb-overlay"></div><div id="jb-window"><div id="jb-window-inner"><div id="jb-window-content" tabindex="0"></div></div></div>');
			$('#jb-overlay')
				.fadeTo(0,$.butterfly.conf.overlayOpacity)
				.css({
					position : 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%'
				})
				.hide()
			;
			$('#jb-window')
				.css({
					position : 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%'
				})
				.hide()
				.click(overlayClicked)
				.bind('keydown',lightBoxKeypress)
			;
			$('#jb-window-inner')
				.css({
					width: '50%',
					height: '50%',
					margin: 'auto',
					overflow: 'auto'
				})
				.centre()
			;
			$('#jb-window-content')
				.css({
					overflow: 'hidden'
				})
				.hide()
			;
				
	});
	
	$.fn.butterfly = function (options) {
		
		options = typeof options != 'undefined' ? options : {};
		
		$(this).each(function () {
			initLightBox.apply(this, [options]);
		});
		
		return $(this); // facilitate chaining
	};
	
	initLightBox = function (options) {
		
		// Merge runtime options with defaults
		// Note: The first argument sent to extend is an empty object to
		// prevent extend from overriding the default $.AKN.defaultOptions object.
			options = (typeof options == 'undefined')
				? $.butterfly.defaultOptions
				: $.extend({}, $.butterfly.defaultOptions, options)
			;
		
		pxToEmExists = (typeof Number.prototype.pxToEm != 'undefined') ? true : false;
		
		if (options.lightBoxMargin == null) {
			// if no margin specified, use 2em if pxToEm available, otherwise use 20px
			options.lightBoxMargin = pxToEmExists ? '2em' : '20px' ;
		}
		if (options.contentDefaultWidth == null) {
			// if no default width specified, use 50em if pxToEm available, otherwise use 700px (good line lengths for legibility)
			options.contentDefaultWidth = pxToEmExists ? '50em' : '700px' ;
		}
		
		
		$(this).data('options', options);
		
		$(this).click(openLightBox);
	};
	
	openLightBox = function (e) {
		
		if (typeof e != 'undefined') {
			e.preventDefault(); // so that links aren't followed
		}
		
		
		// if lightbox is open already and fragment was reused... clean up
			if ($('#jb-overlay').is(':visible')) {
					options = $('#jb-overlay').data('options');
					if (options.linkType == 'fragment' && options.reuseFragment) {
						$('.jb-placeholder').after($(href));
						$('.jb-placeholder').remove();
					}
				originalTrigger = options.originalTrigger;
			} else {
				// if opening for the first time, set the original trigger
					originalTrigger = this;
			}
		
		
		// get target content
			href = $(this).attr('href');
		
		// get options
			options = $(this).data('options');
			options.href = href;
			options.trigger = this; // current trigger element
			options.originalTrigger = originalTrigger; // original trigger element
			$('#jb-window').removeClass('type-media type-image type-fragment type-ajax');
			isImg = isImage(href);
			if (isImg) {
				options.linkType = 'image';
				$('#jb-window').addClass('type-image type-media');
				$('#jb-window-inner').css('overflow','hidden');
			} else if (href.substring(0,1) == '#') {
				options.linkType = 'fragment';
				$('#jb-window').addClass('type-fragment');
				$('#jb-window-inner').css('overflow','auto');
			} else {
				options.linkType = 'ajax';
				$('#jb-window').addClass('type-ajax');
				$('#jb-window-inner').css('overflow','auto');
			}
			
			if (options.treatAsMedia) {
				$('#jb-window').addClass('type-media');
			}
			
		// assign link options to lightbox
			$('#jb-overlay').data('options', options);
		
		// run preOpen callback function
			if (options.callbackPreOpen != null && typeof options.callbackPreOpen == 'function') {
				options.callbackPreOpen.apply(this);
			}
		
		// add/remove close button
			if (options.closeButton) {
				if ($('#jb-close-button').size() == 0) {
					$('#jb-window').prepend('<a href="#" id="jb-close-button"><img src="'+options.closeButtonImage+'" alt="Close lightbox" /></a>');
					$('#jb-close-button').click(closeLightBox);
				}
			} else {
				$('#jb-close-button').remove();
			}
		// add class if overlay can be clicked to close
			if (options.clickOverlayCloses) {
				$('#jb-window').addClass('reactive');
			} else {
				$('#jb-window').removeClass('reactive');
			}
		
		
		if ($('#jb-overlay').is(':visible')) {
			// if lightbox open:
				$('#jb-window-content').fadeOut(null, function(){
					$(this).empty();
					$('#jb-window').addClass('loading');
					loadLightBoxContent.apply(this, [loadLightBoxComplete]);
				});
				
		} else {
		// if lightbox closed:
			// hide button
				$('#jb-close-button').hide();
				
			// show overlay
				$('#jb-overlay').fadeIn().centre();
			
			// open small lightbox with loading spinner
				$('#jb-window').addClass('loading');
				$('#jb-window').show();
			
			// to zoom or not to zoom?
				if (options.zoomFromClicked) {
					// align window with clicked element (for 'zoom in' effect)
						triggerOffset = $(this).offset();
						$('#jb-window-inner').css({
							top: triggerOffset.top,
							left: triggerOffset.left,
							width: $(this).width(),
							height: $(this).height()
						});
				} else {
					// just centre
						$('#jb-window-inner')
							.css({
								width: '100px',
								height: '100px'
							})
							.centre()
						;
				}
			
			// load new content to hidden layer
				loadLightBoxContent.apply(this, [loadLightBoxComplete]);
		}
		
		
			
			
		
		// for any images in the lightbox, if they are now physically smaller than the relevant max-size, add click-to-zoom capability
		
	};
	
	loadLightBoxComplete = function(){
		// once loaded
			// remove spinner
				$('#jb-window').removeClass('loading');
				
			// resize
				resizeLightBox.apply(this, [function(){
					
					
					// fade in new content
						$('#jb-window-content').fadeIn(null, function(){
						
							// set focus to start of lightbox content
								$('#jb-window-content')
									//.attr('tabindex',0) // add to tab index (now occurs during initialisation)
									.focus() // set focus
								;
						
							// run postOpen callback function
								if (options.callbackPostOpen != null && typeof options.callbackPostOpen == 'function') {
									options.callbackPostOpen.apply(this);
								}
						});
						
					
				}]);
			
	};
	
	resizeLightBox = function (callback) {
		
		
		options = $('#jb-overlay').data('options');
		if (typeof options == 'undefined') {
			return; // options haven't been assigned to lightbox overlay yet
		}
		
		
		lbMargin = parseInt(parsePixels(options.lightBoxMargin), 10);
		
		availableWidth = $('#jb-window').width() - (lbMargin * 2);
		availableHeight = $('#jb-window').height() - (lbMargin * 2);
		
		
		// find current default/max dimensions (convert to pixels if necessary)
			contentDefaultWidth = parsePixels(options.contentDefaultWidth, availableWidth);
			contentDefaultHeight = parsePixels(options.contentDefaultHeight, availableHeight);
			mediaMaxWidth = parsePixels(options.mediaMaxWidth, availableWidth);
			mediaMaxHeight = parsePixels(options.mediaMaxHeight, availableHeight);
		
		
		
		
		
			//$.debug('def w = '+contentDefaultWidth);
			//$.debug('def h = '+contentDefaultHeight);
		
		
		// run preResize callback function
				if (options.callbackPreResize != null && typeof options.callbackPreResize == 'function') {
					options.callbackPreResize.apply($('#jb-window'), [availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, mediaMaxWidth, mediaMaxHeight]);
				}
		
		
		/*// IE6 needs help with resizing the overlay and window
		if (
			$.browser.msie && $.browser.version == 6
		) {
			
			$('#jb-overlay, #jb-window').css({
				position: 'absolute',
				top: 0-$('body').css('margin-top'),
				left: 0-$('body').css('margin-left'),
				width: $(window).width(),
				height: $(window).height()
			});
			
		}
			*/
			
			
			
			// $.debug('--------------------------------------------------------');
			
			// $.debug('content w = '+w);
			// $.debug('content h = '+h);
		
		if (options.linkType == 'image' || options.treatAsMedia) {
		
			// measure content size
				w = $('#jb-window-content').lightBoxContentWidth();
				h = $('#jb-window-content').lightBoxContentHeight();
				//alert($('#jb-window-content img').attr('width'));
				//w = $('#jb-window-content img').get(0).width;
				//h = $('#jb-window-content img').get(0).height;
				
				
			// compare dimensions against max width and height
				if (w > mediaMaxWidth) {
					reductionRatio = w / mediaMaxWidth;
					w = mediaMaxWidth;
					h = h / reductionRatio;
					// $.debug('w ratio = '+reductionRatio);
				}
				if (h > mediaMaxHeight) {
					reductionRatio = h / mediaMaxHeight;
					h = mediaMaxHeight;
					w = w / reductionRatio;
					// $.debug('h ratio = '+reductionRatio);
				}
			
			// compare dimensions against available width and height
				if (w > availableWidth) {
					reductionRatio = w / availableWidth;
					w = availableWidth;
					h = h * reductionRatio;
					// $.debug('w ratio = '+reductionRatio);
				}				
				if (h > availableHeight) {
					reductionRatio = h / availableHeight;
					h = availableHeight;
					w = w * reductionRatio;
					// $.debug('h ratio = '+reductionRatio);
				}
				// $.debug('max img width = '+options.mediaMaxWidth);
				// $.debug('max img height = '+options.mediaMaxHeight);
				
		} else {
			
			// not an image or treat as media (must be content fragment)
			
			// $.debug('contentDefaultWidth = '+options.contentDefaultWidth);
			// $.debug('contentDefaultHeight = '+options.contentDefaultHeight);
			
			// measure content width
				w = $('#jb-window-content').lightBoxContentWidth();
			
				if (
					contentDefaultWidth == '' ||
					contentDefaultWidth == '100%' ||
					availableWidth < contentDefaultWidth
				) {
					w = availableWidth;
				} else {
					w = contentDefaultWidth;
				}
			
			if (options.collapseHeightWhenPossible) {
				
				// set new width temporarily
					prevWidth = $('#jb-window-inner').width();
					//$('#jb-window-inner').width(w); // not kicking in fast enough, use animate to lock in new width
					$('#jb-window-inner').animate({width: w}, 0);
					
				// measure height
					h = $('#jb-window-content').lightBoxContentHeight(relaxWidth = false);
					
				// set width back to previous value
					$('#jb-window-inner').width(prevWidth);
					
					if (
						availableHeight < h
					) {
						h = availableHeight;
					} else {
						// do nothing
						// h = contentDefaultHeight;
					}
					
			} else {
				
				// same height for all content boxes (based on contentDefaultHeight)
					h = $('#jb-window-content').lightBoxContentHeight();
					if (
						contentDefaultHeight == '' ||
						contentDefaultHeight == '100%' ||
						availableHeight < contentDefaultHeight
					) {
						h = availableHeight;
					} else {
						h = contentDefaultHeight;
					}
			}
			
		}
		
		// $.debug('availableWidth = '+availableWidth);
		// $.debug('availableHeight = '+availableHeight);
		// $.debug('final w = '+w);		
		// $.debug('final h = '+h);
		
				
		topLeft = findOffsetToCentre(w, h);
		
		// if not animating resize, set speed to 0
		animationSpeed = options.animateResize ? options.animationSpeed : 0;
		
		$('#jb-close-button').hide();
		
		$('#jb-window-inner').animate({
			'width' : w,
			'height' : h,
			'left' : topLeft[1],
			'top' : topLeft[0]
		}, animationSpeed, 0, function() {
			
			w = $('#jb-window-inner').width();
			h = $('#jb-window-inner').height();
			
			if ($('#jb-close-button').size() > 0) {
				buttonWidth = parseInt($('#jb-close-button').width(), 10);
				buttonHeight = parseInt($('#jb-close-button').height(), 10);
				
				switch (options.closeButtonCorner) {
					default: case 'tl':
						buttonLeft = topLeft[1] - buttonWidth/2;
						buttonTop = topLeft[0] - buttonHeight/2;
					break;
					case 'tr':
						buttonLeft = topLeft[1] + w - buttonWidth/2;
						buttonTop = topLeft[0] - buttonHeight/2;
					break;
					case 'br':
						buttonLeft = topLeft[1] + w - buttonWidth/2;
						buttonTop = topLeft[0] + h - buttonHeight/2;
					break;
					case 'bl':
						buttonLeft = topLeft[1] - buttonWidth/2;
						buttonTop = topLeft[0] + h - buttonHeight/2;
					break;
				}
				
				$('#jb-close-button')
					.css({
						position: 'absolute',
						'z-index': '99999',
						left: buttonLeft,
						top: buttonTop
					})
					.show()
				;
			}
			
			// run postResize callback function
				if (options.callbackPostResize != null && typeof options.callbackPostResize == 'function') {
					options.callbackPostResize.apply($('#jb-window'), [availableWidth, availableHeight, contentDefaultWidth, contentDefaultHeight, mediaMaxWidth, mediaMaxHeight]);
				}
			
			if (typeof callback != 'undefined' && typeof callback.apply != 'undefined') {
				callback.apply();
			}
		});
		
	};
	
	loadLightBoxContent = function (callback) {
		
		options = $('#jb-overlay').data('options');
		href = options.href;
		
		// remove previous error states
			$('#jb-window').removeClass('error-no-content');
		
		switch (options.linkType) {
			case 'fragment': // internal page fragment
				
				if (options.reuseFragment) {
					$(href).after('<span class="jb-placeholder"></span>');
					$('#jb-window-content').empty().append($(href)); // href becomes a selector for an id fragment
				} else {
					$('#jb-window-content').empty().append($(href).clone(withDataAndEvents=true));
				}
				
				checkForContent.apply(this, [options.linkType, href]);
				callback.apply(this);
				
			break;
			case 'image': // link to image
				
					$('#jb-window-content').empty().append(
						'<img src="'+href+'" alt="" style="max-width: 100%; max-height: 100%; float: left;" />'
					);
					$('#jb-window-content img')
						.error(function(){
							checkForContent.apply(this, [options.linkType, href, callback]);
						})
						.load(callback)
					;
			
			break;
			default: case 'ajax': case '': // link to external page (or fragment of a page)
			
				// ajax call on remote file
				$.ajaxSetup ({
					cache: true
				});
				if (href.indexOf('#') != -1) {
					ajaxHref = href.split('#').join(' #');
				} else {
					ajaxHref = href;
				}
				$('#jb-window-content').empty().load(ajaxHref, function(){
					checkForContent.apply(this, [options.linkType, href]);
					callback.apply(this);
				});
				
			break;
		}
		
		
	};
	
	checkForContent = function (linkType, href, callback) {
		// check if no content loaded
			wasError = false;
			
			// checkForContent only called for images on .error()
			// otherwise, if no children() exist
			if (linkType == 'image' || $('#jb-window-content').children().size() == 0) {
				wasError = true;
			}
			
			if (wasError) {
				options = $('#jb-overlay').data('options');
				options.linkType = 'fragment';
				options.treatAsMedia = false;
				$('#jb-overlay').data('options', options);
				$('#jb-window')
					.removeClass('type-image type-media')
					.addClass('type-fragment error-no-content')
				;
				$('#jb-window-content').empty().append('<p>There was an error loading lightbox content. <strong>'+$(options.trigger).text()+'</strong> (<samp>'+href+'</samp>) could not be found.</p>');
			}
			if (typeof callback != 'undefined') {
				callback.apply(this);
			}
	};
	
	closeLightBox = function () {
		options = $('#jb-overlay').data('options');
		href = options.href;
		
		// run preClose callback function
			if (options.callbackPreClose != null && typeof options.callbackPreClose == 'function') {
				options.callbackPreClose.apply(options.trigger);
			}
		
		// cleanup after fragment positioning
			if (options.linkType == 'fragment' && options.reuseFragment) {
				$('.jb-placeholder').after($(href));
				$('.jb-placeholder').remove();
			}
		
		$('#jb-overlay').fadeOut();
		$('#jb-window').hide();
		$('#jb-window-content').hide();
		
		// return focus to original trigger element
			originalTriggerEL = $(options.originalTrigger);
			if (typeof originalTriggerEL.attr('tabindex') == 'undefined') {
				originalTriggerEL.attr('tabindex',0);
			}
			originalTriggerEL.focus();
		
		// run postClose callback function
			if (options.callbackPostClose != null && typeof options.callbackPostClose == 'function') {
				options.callbackPostClose.apply(options.trigger);
			}
	};
	
	
	/**
	 * A plugin to measure the width of an element accurately (even if it is hidden)
	 */
	$.fn.lightBoxContentWidth = function () {
		
		jbWindow = $(this).closest('#jb-window');
		isImageType = jbWindow.hasClass('type-media') ? true : false;
		isImageMedia = jbWindow.hasClass('media-image') ? true : false;
		currentWidth = $('#jb-window-inner').width();
		currentHeight = $('#jb-window-inner').height();
		
		
		// relax size for measurement
			if (
				$.browser.msie &&
				$.browser.version == 7 &&
				isImageType &&
				isImageMedia && 
				$(this).find('img').outerWidth({margin:true}) == 0 // IE7 width == 0 on initial load
			) { // only works with '100%' for IE7 on initial load
				$('#jb-window-inner').css({
					width: '100%',
					height: '100%'
				});
			} else { // must use 'auto' for all other situations
				$('#jb-window-inner').css({
					width: 'auto',
					height: 'auto'
				});
			}
		
		// if element is hidden, unhide it, then measure
			if ($(this).css('display') == 'none') {
							
				// make element display for a second
					$(this).css('display', 'block');
					
				// measure
					if (isImageType) {
						fullWidth = $(this).find('img').outerWidth({margin:true});
					} else {
						fullWidth = $(this).outerWidth({margin:true});
					}
				// restore
					$(this).css('display', 'none');
					
			} else {
				fullWidth = $(this).outerWidth({margin:true});
			}
		
		
		// reinstate previous size
			$('#jb-window-inner').animate({
				width: currentWidth,
				height: currentHeight
			},0);
		
		return fullWidth;
	};
	
	/**
	 * A plugin to measure the height of an element accurately (even if it is hidden)
	 */
	$.fn.lightBoxContentHeight = function (relaxWidth) {
		
		relaxWidth = typeof relaxWidth != 'undefined' ? relaxWidth : true;
		jbWindow = $(this).closest('#jb-window');
		isImageType = jbWindow.hasClass('type-media') ? true : false;
		isImageMedia = jbWindow.hasClass('media-image') ? true : false;
		
		// always relax height
			currentWidth = $('#jb-window-inner').width();
			currentHeight = $('#jb-window-inner').height();
			
		// relax size for measurement
			if (
				$.browser.msie && 
				$.browser.version == 7 && 
				isImageType && 
				isImageMedia &&
				$(this).find('img').outerWidth({margin:true}) == 0 // IE7 width == 0 on initial load
			) { // only works with '100%' for IE7 on initial load
					$('#jb-window-inner').height('100%');
					if (relaxWidth) {
						$('#jb-window-inner').width('100%');
					}
			} else { // must use 'auto' for all other situations
					$('#jb-window-inner').height('auto');
					if (relaxWidth) {
						$('#jb-window-inner').width('auto');
					}
			}
		
		// if element is hidden, unhide it, then measure
		if ($(this).css('display') == 'none') {
						
			// make element display for a second
				$(this).css('display', 'block');
			
			// measure
				fullHeight = $(this).outerHeight({margin:true});
				
			// restore
				$(this).css('display', 'none');
			
				
		} else {
			fullHeight = $(this).outerHeight({margin:true});
		}
		
		// reinstate previous size
			$('#jb-window-inner')
				.width(currentWidth)
				.height(currentHeight)
			;
		
		return fullHeight;
	};
	
	
	overlayClicked = function (evt) {
		options = $('#jb-overlay').data('options');
				
		if (evt.target == $('#jb-window').get(0) && options.clickOverlayCloses) {
			closeLightBox.apply();
		} else {
			// do nothing
		}
	};
	
	/**
	 * Key pressed on key board
	 */
	lightBoxKeypress = function (evt) {
		$.debug('Key pressed: '+evt.keyCode);
		if (evt.keyCode == 27) {
			closeLightBox.apply();
		}
	};
	
	/**
	 * A plugin to centre a visible element on the screen
	 */
	$.fn.centre = function () {
		$(this).css("position","fixed");
		$(this).css("top", ( $(window).height() - $(this).outerHeight() ) / 2 + "px");
		$(this).css("left", ( $(window).width() - $(this).outerWidth() ) / 2 + "px");
		return this;
	};
	
	findOffsetToCentre = function (w, h) {
		topOffset = ( $(window).height() - h ) / 2;
		leftOffset = ( $(window).width() - w ) / 2;
		
		//// $.debug ('w = '+w+' | h = '+h+' | top = '+top+' | left = '+left);
		
		return [topOffset, leftOffset];
	};
	
	
	/**
	 * Dump debug messages to // console if available, otherwise to status bar.
	 */
	$.debug = function (message){
		if (typeof window.console != 'undefined' && window.console.log != 'undefined') {
			window.console.log(message);
		} else {
			// un comment next line if testing IE6 issues in dev environment (don't use for production)
				//window.status = message;
		}
	};
	
	/**
	 * from: http://stackoverflow.com/questions/1933501/how-to-put-targetblank-in-jquery
	 */
	isImage = function (fileName) {
		
        if (typeof fileName == 'undefined' || fileName == '') {
            return false;
        }
        var pos = (fileName+'').lastIndexOf(".");
        if (pos == -1){
            return false;
        } else {
            var extension = fileName.substring(pos);
            switch (extension.toLowerCase()) {
            case ".jpg":
            case ".png":
            case ".gif":
            case ".bmp":
            case ".jpeg":
                return true;
            break;
            default:
                return false;
            break;
            }
        }
    };
	
	/**
	 * Converts % or em values to a number of pixels (integer).
	 * Use pxToEm (reverse mode) to convert em values to pixels (if the plugin is available)
	 * @param String input The dimenion to be converted (may include % or em or px)
	 * @param integer centDimension The dimension that represents 100%
	 * @return integer Converted dimension in pixels
	 */
	parsePixels = function (input, centDimension) {
		
		centDimension = typeof centDimension != 'undefined' ? centDimension : $('body').width() ;
		
		input = input
			.replace('px','') // remove px units if present
			.replace(/^\s+|\s+$/g,"") // trim leading and trailing whitespace
		;
		
		if (!isNaN(input)) {
			// int already, return as pixels
				return parseInt(input, 10);
		} else if (input.substr(input.length - 1) == '%') {
			// %, convert to pixels
				
				if (typeof centDimension != 'undefined') {
					input = parseInt(input
						.substr(0, input.length - 1) // strip unit
						.replace(/^\s+|\s+$/g,"") // trim
					, 10);
					return input/100 * parseInt(centDimension, 10);
				} else {
					$.debug('Warning: percentage unit was supplied to parsePixels() but could not be calculated because centDimension was not supplied.');
					return parseInt(input, 10);
				}
				
		} else if (input.substr(input.length - 2) == 'em') {
			// em, check for pxToEm and convert (or warn)
				if (typeof Number.prototype.pxToEm != 'undefined') {
					input = parseInt(input
						.substr(0, input.length - 2) // strip unit
						.replace(/^\s+|\s+$/g,"") // trim
					, 10);
					input = input.pxToEm({
					   reverse: true
					});
					return input.substr(0, input.length - 2); // strip unit px;

				} else {
					$.debug('Warning: em unit was supplied to parsePixels() but could not be calulated because pxToEm plugin was not found.');
					return parseInt(input, 10);
				}
		} else {
			// unknown units, warn
			$.debug('Warning: unknown unit was supplied. parsePixels() can support px, em or % units only.');
			return parseInt(input, 10);
		}
	};


})(jQuery); /* end closure */
