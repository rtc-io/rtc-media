# rtc-media

This is a convenience function for invoking media capture and rendering
using the [`rtc-capture`](https://github.com/rtc-io/rtc-capture) and
[`rtc-attach`](https://github.com/rtc-io/rtc-attach) packages respectively
within an application.


[![NPM](https://nodei.co/npm/rtc-media.png)](https://nodei.co/npm/rtc-media/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) 
[![rtc.io google group](http://img.shields.io/badge/discuss-rtc.io-blue.svg)](https://groups.google.com/forum/#!forum/rtc-io)



## Example Usage

Default constraints (`{ audio: true, video: true }`) capture and rendering
an new video element within the document.body:

```js
// capture using default constraints and render a new video element
// in the document body
require('rtc-media')({ target: document.body });

```

#### `clone(inputStream, opts?)` => MediaStream

The `clone` helper function accepts an existing `MediaStream` and creates
a new `MediaStream` with a cloned copy of each of the audio and video
tracks contained within.

This can be useful when you wish to mute (disable) either an audio or
video stream sent over the wire, but keep the locally rendered stream
active.

__NOTE:__ At this time it is not possible to clone a `MediaStreamTrack` in
firefox (https://bugzilla.mozilla.org/show_bug.cgi?id=910249).  When this
function is called in firefox, the original stream is returned rather than
throwing an error.

ERROR: could not find: 

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
