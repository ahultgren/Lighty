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
				var contents = '<img src="' + data[0].the_post_thumbnail[0] + '" />'
					+ '<p class="desc">' + data[0].the_excerpt + '</p>';
				
				return contents;
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
			.append('<div class="lighty-waiter"></div>')
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
				container.empty().append(settings.itemTemplate.call(this, data));

				// Remove loading icon and show content	
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
					position: 'absolute',
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