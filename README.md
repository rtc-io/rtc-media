# rtc-media

Simple [getUserMedia](http://dev.w3.org/2011/webrtc/editor/getusermedia.html)
cross-browser wrappers.  Part of the [rtc.io](http://rtc.io/) suite, which is
sponsored by [NICTA](http://opennicta.com) and released under an
[Apache 2.0 license](/LICENSE).


[![NPM](https://nodei.co/npm/rtc-media.png)](https://nodei.co/npm/rtc-media/)

[![Build Status](https://img.shields.io/travis/rtc-io/rtc-media.svg?branch=master)](https://travis-ci.org/rtc-io/rtc-media) [![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![Dependency Status](https://david-dm.org/rtc-io/rtc-media.svg)](https://david-dm.org/rtc-io/rtc-media) 

## Example Usage

Capturing media on your machine is as simple as:

```js
require('rtc-media')();
```

While this will in fact start the user media capture process, it won't
do anything with it.  Lets take a look at a more realistic example:

```js
// require the media capture helper from rtc.io
var media = require('rtc-media');

// capture video and render it to the document body
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

### Events

Once a media object has been created, it will provide a number of events
through the standard node EventEmitter API.

#### `capture`

The `capture` event is triggered once the requested media stream has
been captured by the browser.

```js
var media = require('rtc-media');
var localMedia = require('rtc-media')();

localMedia.render(document.body);
localMedia.once('capture', function(stream) {
  // stream references underlying media stream that was captured
  console.log('capture complete');
});
```

#### `render`

The `render` event is triggered once the stream has been rendered
to the any supplied (or created) video elements.

While it might seem a little confusing that when the `render` event
fires that it returns an array of elements rather than a single element
(which is what is provided when calling the `render` method).

This occurs because it is completely valid to render a single captured
media stream to multiple media elements on a page.  The `render` event
is reporting once the render operation has completed for all targets that
have been registered with the capture stream.

## Reference

### media

```
media(opts?)
```

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

### capture

```
capture(constraints, callback)
```

Capture media.  If constraints are provided, then they will
override the default constraints that were used when the media object was
created.

### render

```js
render(target, opts?, callback?)
```

Render the captured media to the specified target element.  While previous
versions of rtc-media accepted a selector string or an array of elements
this has been dropped in favour of __one single target element__.

If the target element is a valid MediaElement then it will become the
target of the captured media stream.  If, however, it is a generic DOM
element it will a new Media element will be created that using the target
as it's parent.

A simple example of requesting default media capture and rendering to the
document body is shown below:

```js
// require the media capture helper from rtc.io
var media = require('rtc-media');

// capture video and render it to the document body
media().render(document.body);
```

You may optionally provide a callback to this function, which is
will be triggered once each of the media elements has started playing
the stream:

```js
var media = require('rtc-media');

media().render(document.body, function(el) {
  console.log('captured and playing to media element: ', el);
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

### _prepareElement(opts, element)

The prepareElement function is used to prepare DOM elements that will
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

#### `clone(inputStream, opts?)` => MediaStream

The `clone` helper function accepts an existing `MediaStream` and creates
a new `MediaStream` with a cloned copy of each of the audio and video
tracks contained within.

This can be useful when you wish to mute (disable) either an audio or
video stream sent over the wire, but keep the locally rendered stream
active.

```js
var media = require('rtc-media');
var clone = require('rtc-media/clone');

media().on('capture', function(stream) {
  // create a clone of the stream
  var cloned = clone(stream);

  // using the cloned stream, we will be able to enable and disable tracks without
  // affecting the originally cloned stream
});

```

An additional `opts` argument can be passed to this function to
selectively filter which tracks are cloned:

- `filterAudio` - a filter **function** that can be used to decide
  whether an audio track is cloned into the new `MediaStream`.

- `filterVideo` - as per the `filterAudio` option but for video
  tracks.

## License(s)

### Apache 2.0

Copyright 2014 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
