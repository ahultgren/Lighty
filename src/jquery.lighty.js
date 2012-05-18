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
	// Private vars
	var settings = {
			baseZ: 5,
			bgColor: 'rgba(0,0,0,0.85)',
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
		container;

	// Private methods
	var showLightbox = function(){
		var that = $(this);
		// Show bg and loading icon
		bg.show();
		container
			.append('<div class="' + settings.prefix + 'waiter"></div>')
			.lighty('resize', {width: 30, height: 30})
			.show();

		// Get data
		$.ajax({
			url: that.attr('href'),
			data: settings.data.call(that),
			dataType: 'json',
			error: function(xhr, text){
				//## errorTemplate?
				console.log(xhr, text);
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
	};

	// Public methods
	var methods = {
		init: function(options){
			// Extend default settings
			$.extend(settings, options);

			// Prepare bakground
			bg = $(document.createElement('div'))
				.attr('id', settings.prefix + 'bg')
				.css({
					background: settings.bgColor,
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					'z-index': settings.baseZ
				})
				.hide()
				.appendTo('body');

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

			// Prepare eventhandlers
			bg.click(function(){
				hideLightbox();
			});
			//## pressing right and left keys?

			// Prepare each lightboxed item
			return this.each(function(){
				$(this).click(function(e){
					e.preventDefault();
					showLightbox.call(this);
				});
			});
		},
		resize: function(args, callback){
			return this.each(function(){
				var $window = $(window),
					windowWidth = $window.width(),
					windowHeight = $window.height(),
					diff;

				// Make sure args is an object
				args = args || {};

				// Make sure there's something to animate to
				args.height = args.height || $(this).height();
				args.width = args.width || $(this).width();

				// Make sure the image is never larger than the screen
				//## Must compensate for padding and shit...
				if( args.width > windowWidth - 50 ){
					diff = (windowWidth - 50) / args.width;
					console.log("width", diff);
					args.width *= diff;
					args.height *= diff;
				}
				if( args.height > windowHeight - 100 ){
					diff = (windowHeight - 100) / args.height;
					console.log("height",diff);
					args.width *= diff;
					args.height *= diff;
				}

				// Animate to the center
				$(this).animate({
					width: args.width,
					height: args.height,
					left: windowWidth/2 - args.width/2,
					top: windowHeight/2 - args.height/2
				},
				{
					duration: 200,
					complete: function(){
						if( typeof callback === 'function' ){
							callback();
						}
					}
				});
			});
		}
	};

	// Make things accessible
	$.fn.lighty = function(method) {
		// Method calling logic
		if( methods[method] ){
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if( typeof method === 'object' || ! method ){
			return methods.init.apply( this, arguments );
		} 
		else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.lighty' );
		}
	};
}(jQuery));