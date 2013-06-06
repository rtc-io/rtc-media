# rtc-media

Simple [getUserMedia](http://dev.w3.org/2011/webrtc/editor/getusermedia.html) cross-browser wrappers.  Part of the [rtc.io](http://rtc.io/) suite.

## Lightning Start

Add a script tag to your html to include the media library:

```html
<script src="https://js.rtc.io/media-0.0.0.js"></script>
```

Add some more script goodness to make cool stuff happen:

```html
<script>
window.addEventListener('load', function() {
	media().render(document.body);
});
</script>
```

## Quick Start

If you are keen to use the `rtc-media` library along with other modules in the rtc.io suite, then you might want to consider using them in the [recommended development toolchain](http://docs.rtc.io/development-toolchain).  This quick start assumes familiarity with that process.

First, create a new simple HTML page for this example:

```html:demo/index.html
<!DOCTYPE html>
<head>
<title>Media Capture Demo</title>
<style>
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
}

.video {
    width: 640px;
    height: 480px;
}
</style>
</head>
<body>
<div class="video"></div>
<script src="bundle.js"></script>
</body>
</html>
```

And also a JS file that will do most of the work:

```js:demo/index.js
var media = require('../'),
	qsa = require('cog/qsa'),
    video = media();

// create media and attach to the specified element
video.render('.video');

window.addEventListener('load', function() {
	qsa('button').forEach(function(button){ 
		button.addEventListener('click', function() {
			video[button.dataset.action].call(video);
		});
	});
});
``` 
