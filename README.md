# rtc-media

Simple [getUserMedia](http://dev.w3.org/2011/webrtc/editor/getusermedia.html)
cross-browser wrappers.  Part of the [rtc.io](http://rtc.io/) suite, which is
sponsored by [NICTA](http://opennicta.com) and released under an
[Apache 2.0 license](/LICENSE).


[![NPM](https://nodei.co/npm/rtc-media.png)](https://nodei.co/npm/rtc-media/)

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

## Installation

```
npm install rtc-media --save
```

Or, you can use the `rtc-media` module as part of the
[rtc](https://github.com/rtc-io/rtc) suite by installing rtc:

```
npm install rtc --save
```

## Example Usage

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

### Media Events

If you want to know when media is captured (and you probably do), then
you can tap into the `capture` event of the created media object:

```js
media().once('capture', function(stream) {
  // stream references underlying media stream that was captured
});
```

## Reference

### media(opts?)

Capture media using the underlying
[getUserMedia](http://www.w3.org/TR/mediacapture-streams/) API.

The function accepts a single argument which can be either be:

- a. An options object (see below), or;
- b. An existing
  [MediaStream](http://www.w3.org/TR/mediacapture-streams/#mediastream) that
  the media object will bind to and provide you some DOM helpers for.

The function supports the following options:

- `capture` - Whether capture should be initiated automatically. Defaults
  to true, but toggled to false automatically if an existing stream is
  provided.

- `muted` - Whether the video element created for this stream should be
  muted.  Default is true but is set to false when an existing stream is
  passed.

- `constraints` - The constraint option allows you to specify particular
  media capture constraints which can allow you do do some pretty cool
  tricks.  By default, the contraints used to request the media are 
  fairly standard defaults:

  ```js
    {
      video: {
        mandatory: {},
        optional: []
      },
      audio: true
    }
  ```

### capture(constraints, callback)

Capture media.  If constraints are provided, then they will 
override the default constraints that were used when the media object was 
created.

### render(targets, opts?, callback?)

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

You may optionally provide a callback to this function, which is 
will be triggered once each of the media elements has started playing
the stream:

```js
media().render(document.body, function(elements) {
  console.log('captured and playing');
});
```

### stop()

Stop the media stream

## Debugging Tips

Chrome and Chromium can both be started with the following flag:

```
--use-fake-device-for-media-stream
```

This uses a fake stream for the getUserMedia() call rather than attempting
to capture the actual camera.  This is useful when doing automated testing
and also if you want to test connectivity between two browser instances and
want to distinguish between the two local videos.

## Internal Methods

There are a number of internal methods that are used in the `rtc-media`
implementation. These are outlined below, but not expected to be of
general use.

### _prepareElements(opts, element)

The prepareElements function is used to prepare DOM elements that will
receive the media streams once the stream have been successfully captured.

### _bindStream(stream)

Bind a stream to previously prepared DOM elements.

### _unbind()

Gracefully detach elements that are using the stream from the 
current stream.

### _createObjectUrl(stream)

This method is used to create an object url that can be attached to a video
or audio element.  Object urls are cached to ensure only one is created
per stream.

### _handleSuccess(stream)

Handle the success condition of a `getUserMedia` call.

### _handleFail(evt)

Handle the failure condition of a `getUserMedia` call.

## License(s)

### Apache 2.0

Copyright 2013 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
