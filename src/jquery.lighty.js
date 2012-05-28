/*
 * jquery.lighty
 * 
 *
 * Copyright (c) 2012 Andreas Hultgren
 * Licensed under the MIT license.
 */

 /*
  * Todo and other ponderings
  * 
  */

(function($) {
	// Class
	function Lighty(){
		// Private vars
		var settings = {
				baseZ: 5,
				data: function(){
					return {
						jsonposts: 1
					};
				},
				prefix: 'lighty-',
				itemTemplate: function(data){
					var contents = '<img src="' + data[0].the_post_thumbnail[0] + '" />' + '<p class="desc">' + data[0].the_excerpt + '</p>';
					
					return {
						markup: contents,
						width: data[0].the_post_thumbnail[1],
						height: data[0].the_post_thumbnail[2]
					};
				}
			},
			bg,
			container,
			current,
			selector;

		// Private methods
		var showLightbox = function(){
			var that = $(this);

			// Save this as currently lightboxed
			current = that;

			// Show bg and loading icon
			bg.show();
			container
				.empty()
				.append('<div class="' + settings.prefix + 'waiter"></div>')
				.css({
					top: that.offset().top - $(window).scrollTop,
					left: that.offset().left,
					width: that.width(),
					height: that.height()
				})
				.show();

			// Get data
			$.ajax({
				url: that.attr('href'),
				data: settings.data.call(that),
				dataType: 'json',
				error: function(xhr, text){
					//## errorTemplate?
				},
				success: function(data){
					// Input the fetched data into template
					var content = settings.itemTemplate.call(this, data);

					// Resize the container
					container.lighty('resize', {width: content.width, height: content.height}, function(){
						// Swap from loader to content
						container.empty().append(content.markup);
					});
				}
			});

			return this;
		},
		hideLightbox = function(){
			bg.hide();
			container.hide().empty();
			current = undefined;
		};

		// Public methods
		this.init = function(options){
			selector = this;

			// Extend default settings
			$.extend(settings, options);

			// Prepare bakground
			bg = $(document.createElement('div'))
				.attr('id', settings.prefix + 'bg')
				.css({
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					'z-index': settings.baseZ
				})
				.hide()
				.appendTo('body')
				.click(function(){
					hideLightbox();
				});

			// Prepare lightbox container
			container = $(document.createElement('div'))
				.attr('id', settings.prefix + 'container')
				.css({
					position: 'fixed',
					left: $(window).width()/2,
					top: $(window).height()/2,
					'z-index': settings.baseZ + 1
				})
				.hide()
				.appendTo('body');

			// Pressing right and left keys
			$(window).keydown(function(e){
				var newBox;

				if( current ){
					if( e.which === 39 ){
						// Right
						e.preventDefault();
						newBox = selector[selector.index(current)+1];
					}
					else if( e.which === 37 ){
						// Left
						e.preventDefault();
						newBox = selector[selector.index(current)-1];
					}

					if( newBox ){
						showLightbox.call(newBox);
					}
					else if( (!newBox && (e.which === 39 || e.which === 37)) || e.which === 27 ){
						//    not new  AND      right or left key           OR Escape
						hideLightbox();
					}
				}
			});

			// Prepare each lightboxed item
			return this.each(function(){
				$(this).click(function(e){
					e.preventDefault();
					showLightbox.call(this);
				});
			});
		};

		this.resize = function(args, callback){
			return this.each(function(){
				var $window = $(window),
					windowWidth = $window.width(),
					windowHeight = $window.height(),
					that = $(this),
					diff;

				// Make sure args is an object
				args = args || {};

				// Make sure there's something to animate to
				args.height = args.height || that.height();
				args.width = args.width || that.width();

				// Make sure the image is never larger than the screen
				//## Must compensate for padding and shit...
				if( args.width > windowWidth - 50 ){
					diff = (windowWidth - 50) / args.width;
					args.width *= diff;
					args.height *= diff;
				}
				if( args.height > windowHeight - 100 ){
					diff = (windowHeight - 100) / args.height;
					args.width *= diff;
					args.height *= diff;
				}

				// Animate to the center
				that.animate({
					width: args.width,
					height: args.height,
					left: windowWidth/2 - args.width/2,
					top: windowHeight/2 - args.height/2
				},
				{
					duration: 200,
					complete: function(){
						that.height("auto");
						if( typeof callback === 'function' ){
							callback();
						}
					}
				});
			});
		};
	}

	// Make things accessible
	$.fn.lighty = function(method) {
		// Don't act on absent elements
		if( this.length ){
			// Method calling logic
			var lighty = new Lighty();

			if( lighty[method] ){
				return lighty[method].apply(this, Array.prototype.slice.call(arguments, 1));
			}
			else if( typeof method === 'object' || !method ){
				return lighty.init.apply(this, arguments);
			} 
			else {
				$.error('Method ' +  method + ' does not exist on jQuery.lighty');
			}
		}
	};
}(jQuery));