# rtc-media

Simple [getUserMedia](http://dev.w3.org/2011/webrtc/editor/getusermedia.html)
cross-browser wrappers.  Part of the [rtc.io](http://rtc.io/) suite.

## Quick Start

If you are keen to use the `rtc-media` library along with other modules in 
the rtc.io suite, then you might want to consider using them in the 
[recommended development toolchain](http://docs.rtc.io/development-toolchain).

This quick start assumes familiarity with that process.

First, create a new simple HTML page for this example:

```html
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

```js
var media = require('rtc-media'),
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

## Debugging Tips

Chrome and Chromium can both be started with the following flag:

```
--use-fake-device-for-media-stream
```

This uses a fake stream for the getUserMedia() call rather than attempting
to capture the actual camera.  This is useful when doing automated testing
and also if you want to test connectivity between two browser instances and
want to distinguish between the two local videos.

## Media prototype reference

### attach(target)

Attach the media stream to the target element

### start(constraints, callback)

Start the media capture.  If constraints are provided, then they will 
override the default constraints that were used when the media object was 
created.

### stop()

Stop the media stream

### _bindStream(element, stream)

### _unbind()

Gracefully detach elements that are using the stream from the current stream

### _createObjectUrl(stream)

This method is used to create an object url that can be attached to a video or 
audio element.  Object urls are cached to ensure only one is created per stream.

### _handleSuccess(stream)

### _handleFail(evt)
