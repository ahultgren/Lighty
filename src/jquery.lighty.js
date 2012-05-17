/*
 * jquery.lighty
 * 
 *
 * Copyright (c) 2012 Andreas Hultgren
 * Licensed under the MIT license.
 */

(function($) {
	// Private vars and methods

	// Public methods
	var methods = {

	};

	// Make things accessible
	$.fn.awesome = function(method) {
		// Method calling logic
		if( methods[method] ){
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if( typeof method === 'object' || ! method ){
			return methods.init.apply( this, arguments );
		} 
		else{
			$.error( 'Method ' +  method + ' does not exist on jQuery.morePosts' );
		}
		return this.each(function() {
			$(this).html('awesome');
		});
	};

}(jQuery));
