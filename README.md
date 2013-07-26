# rtc-media

Simple [getUserMedia](http://dev.w3.org/2011/webrtc/editor/getusermedia.html)
cross-browser wrappers.  Part of the [rtc.io](http://rtc.io/) suite, which is
sponsored by [NICTA](http://opennicta.com) and released under an
[Apache 2.0 license](/LICENSE).

Capturing media on your machine is as simple as:

```js
require('rtc-media')();
```

While this will in fact start the user media capture process, it won't 
do anything with it.  Lets take a look at a more realistic example:

```js
var media = require('rtc-media');

media().render(document.body);
```

[run on requirebin](http://requirebin.com/?gist=6085450)

In the code above, we are creating a new instance of our userMedia wrapper
using the `media()` call and then telling it to render to the
`document.body` once video starts streaming.  We can further expand the
code out to the following to aid our understanding of what is going on:

```js
var Media = require('rtc-media');
var userMedia = new Media({ start: true });

userMedia.render(document.body);
```

The code above is written in a more traditional JS style, but feel free
to use the first style as it's quite safe (thanks to some checks in the
code).

## Media prototype reference

### render(targets, opts?, stream?)

Render this media element to elements matching the specified selector or
specific targets.  If the targets are regular DOM elements rather than 
`video` or `audio` elements, then new `video` or `audio` elements are 
created to accept the media stream once started.

In all cases, an array of video/audio elements (either created or 
existing) from the render call and can be manipulated as required by 
your application.  It is important to note, however, that the elements
may not yet have streams associated with them due to the async nature
of the underlying `getUserMedia` API (requesting permission, etc).

A simple example of requesting default media capture and rendering to the 
document body is shown below:

```js
var media = require('rtc-media'); // or require('rtc/media')

// start the stream and render to the document body once active
media().render(document.body);
```

### start(constraints, callback)

Start the media capture.  If constraints are provided, then they will 
override the default constraints that were used when the media object was 
created.

### stop()

Stop the media stream

### _prepareElements()

### _bindStream(element, stream)

### _unbind()

Gracefully detach elements that are using the stream from the 
current stream.

### _createObjectUrl(stream)

This method is used to create an object url that can be attached to a video
or audio element.  Object urls are cached to ensure only one is created
per stream.

### _handleSuccess(stream)

### _handleFail(evt)

## Debugging Tips

Chrome and Chromium can both be started with the following flag:

```
--use-fake-device-for-media-stream
```

This uses a fake stream for the getUserMedia() call rather than attempting
to capture the actual camera.  This is useful when doing automated testing
and also if you want to test connectivity between two browser instances and
want to distinguish between the two local videos.
