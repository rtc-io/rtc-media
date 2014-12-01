# rtc-media

This is a convenience function for invoking media capture and rendering
using the [`rtc-capture`](https://github.com/rtc-io/rtc-capture) and
[`rtc-attach`](https://github.com/rtc-io/rtc-attach) packages respectively
within an application.


[![NPM](https://nodei.co/npm/rtc-media.png)](https://nodei.co/npm/rtc-media/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) 
[![rtc.io google group](http://img.shields.io/badge/discuss-rtc.io-blue.svg)](https://groups.google.com/forum/#!forum/rtc-io)



## Example Usage

Default constraints `{ audio: true, video: true }` capture and rendering
an new video element within the document.body:

```js
// capture using default constraints and render a new video element
// in the document body
require('rtc-media')({ target: document.body });

```

In the event that you wish to make use of any of the rtc.io plugins, then
the following example demonstrates how to provide a single "capture and
render" call that will work with a plugin:

```js
var crel = require('crel');

// ensure we have a style tag that tells the video renderer what size it should be
document.body.appendChild(crel('style', [
  'body { margin: 0px; width: 100vw; height: 100vh; overflow: hidden }',
  'body > * { width: 100%; height: 100%; object-fit: contain }'
].join('\n')));

// specify a plugin
require('rtc-media')({
  target: document.body,
  plugins: [
    require('rtc-plugin-nicta-ios')
  ]
});

```

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
