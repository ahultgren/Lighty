# jq Lighty

Lighty is another lightweight lighbox plugin, but with the USP is to fetch the contents through AJAX _very_ easily. Works especially great together with my Wordpress plugin [WP JSON Posts](https://github.com/ahultgren/WP-JSON-Posts). All that's needed are links that points to a page where json may be fetched.

## Getting Started
This is a very basic example that will make the lightboxing mostly work:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.lighty.min.js"></script>
<script>
jQuery(function($) {
	$('.meow a').lighty();
});
</script>
```

_Note: Lighty assumes your links refers to a page where the data is formatted in a sensible way. In the case of WP JSON Posts this is achieved by linking to the normal page (thus allowing for graceful degradation) but adding "jsonposts" to the query string._

However one main goal of Lighty is to keep the core functionality as as light as possible (as the name implies). Thus no unnecessary styling is added and you'll have to add it yourself. In `examples/style.css` there's some example code that's okay together with the default template and WP JSON Posts.

## Settings
```javascript
$('.meow a').lighty({
	baseZ : 5, // The lowest z-index used by Lighty
	data: function(){
		// Return an object containing the data you need to send to the server, for example:
		return {
			jsonposts: 1
		};
	},
	prefix: 'lighty-', // All Lighty's ids and classes are prefixed with this to avoid conflicts with other plugins
	itemTemplate: function(data){
		// data contains the data response from the ajax request
		// return an object containg the markup, content width and content height, for example:
		return {
			markup: '<img src="' + data[0].the_post_thumbnail[0] + '" />' + '<p class="desc">' + data[0].the_excerpt + '</p>',
			width: data[0].the_post_thumbnail[1],
			height: data[0].the_post_thumbnail[2]
		};
	}
});
```

## Contributing
I'm sure there're some parts that can be improved, so please do so!

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## License
Copyright (c) 2012 Andreas Hultgren  
Licensed under the MIT license.
