/* jshint node: true */
/* global navigator: false */
/* global window: false */
/* global MediaStream: false */
/* global HTMLVideoElement: false */
/* global HTMLAudioElement: false */

/**
  # rtc-media

  Simple [getUserMedia](http://dev.w3.org/2011/webrtc/editor/getusermedia.html)
  cross-browser wrappers.  Part of the [rtc.io](http://rtc.io/) suite.
**/

'use strict';

/**
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
  </body>
  </html>
  ```

  And also a JS file that will do most of the work:

  ```js
  var media = require('rtc-media');

  media().render('.video');
  ``` 
**/

var crel = require('crel');
var extend = require('cog/extend');
var qsa = require('cog/qsa');
var detect = require('feature/detect');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// monkey patch getUserMedia from the prefixed version
navigator.getUserMedia = detect.call(navigator, 'getUserMedia');

// patch window url
window.URL = window.URL || detect('URL');

// patch media stream
window.MediaStream = detect('MediaStream');

/**
  ## Media prototype reference
**/
function Media(opts) {
  if (! (this instanceof Media)) {
    return new Media(opts);
  }

  // inherited
  EventEmitter.call(this);

  // if the opts is a media stream instance, then handle that appropriately
  if (opts instanceof MediaStream) {
    opts = {
      stream: opts,
      start: false,
      muted: false
    };
  }

  // ensure we have opts
  opts = extend({}, {
    start: true,
    muted: true,
    constraints: {
      video: {
        mandatory: {},
        optional: []
      },
      audio: true
    }
  }, opts);

  // save the constraints
  this.constraints = opts.constraints;

  // if a name has been specified in the opts, save it to the media
  this.name = opts.name;

  // initialise the stream to null
  this.stream = opts.stream || null;

  // initialise the muted state
  this.muted = typeof opts.muted == 'undefined' || opts.muted;

  // create a bindings array so we have a rough idea of where 
  // we have been attached to
  // TODO: revisit whether this is the best way to manage this
  this._bindings = [];

  // if we are autostarting, then start
  if (opts.start) {
    this.start();
  }
}

util.inherits(Media, EventEmitter);
module.exports = Media;

/**
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
  
**/
Media.prototype.render = function(targets, opts, stream) {
  // if the stream is not provided, then use the current stream
  stream = stream || this.stream;

  // ensure we have opts
  opts = opts || {};

  // TODO: free existing elements

  // use qsa to get the targets
  if (typeof targets == 'string' || (targets instanceof String)) {
    targets = qsa(targets);
  }
  // otherwise, make sure we have an array
  else {
    targets = [].concat(targets || []);
  }

  // if no stream was specified, wait for the stream to initialize
  if (! stream) {
    this.once('start', this._bindStream.bind(this));
  }

  // bind the stream to all the identified targets
  return targets
            .filter(Boolean)
            .map(this._prepareElements.bind(this, opts));
};

/**
  ### start(constraints, callback)

  Start the media capture.  If constraints are provided, then they will 
  override the default constraints that were used when the media object was 
  created.
**/
Media.prototype.start = function(constraints, callback) {
  var media = this;
  var handleEnd = this.emit.bind(this, 'stop');

  // if we already have a stream, then abort
  if (this.stream) { return; }

  // if no constraints have been provided, but we have 
  // a callback, deal with it
  if (typeof constraints == 'function') {
    callback = constraints;
    constraints = this.constraints;
  }

  // if we have a callback, bind to the start event
  if (typeof callback == 'function') {
    this.once('start', callback.bind(this));
  }

  // get user media, using either the provided constraints or the 
  // default constraints
  navigator.getUserMedia(
    constraints || this.constraints,
    function(stream) {
      if (typeof stream.addEventListener == 'function') {
        stream.addEventListener('ended', handleEnd);
      }
      else {
        stream.onended = handleEnd;
      }

      // save the stream and emit the start method
      media.stream = stream;
      media.emit('start', stream);
    },
    this._handleFail.bind(this)
  );
};

/**
  ### stop()

  Stop the media stream
**/
Media.prototype.stop = function(opts) {
  var media = this;

  if (! this.stream) { return; }

  // remove bindings
  this._unbind(opts);

  // stop the stream, and tell the world
  this.stream.stop();

  // on start rebind
  this.once('start', function(stream) {
    media._bindings.forEach(function(binding) {
      media._bindStream(stream, binding.opts, binding.el);
    });
  });

  // remove the reference to the stream
  this.stream = null;
};

/**
  ### _prepareElements()
**/
Media.prototype._prepareElements = function(opts, element) {
  var parent;
  var validElement = (element instanceof HTMLVideoElement) ||
        (element instanceof HTMLAudioElement);
  var preserveAspectRatio = typeof opts.preserveAspectRatio == 'undefined';

  // if the element is not a video element, then create one
  if (! validElement) {
    parent = element;

    // create a new video element
    // TODO: create an appropriate element based on the types of tracks 
    // available
    element = crel('video', {
      preserveAspectRatio: preserveAspectRatio || true
    });

    // if muted, inject the muted attribute
    if (this.muted) {
      element.setAttribute('muted');
    }

    // add to the parent
    parent.appendChild(element);
  }

  // flag the element as bound
  this._bindings.push({
    el: element,
    opts: opts
  });

  return element;
};

/**
  ### _bindStream(element, stream)
**/
Media.prototype._bindStream = function(stream) {
  var media = this;

  // iterate through the bindings and bind the stream
  this._bindings.map(function(binding) {
    // check for mozSrcObject
    if (typeof binding.el.mozSrcObject != 'undefined') {
      binding.el.mozSrcObject = stream;
    }
    else {
      binding.el.src = media._createObjectURL(stream) || stream;
    }

    // attempt to play the video
    if (typeof binding.el.play == 'function') {
      binding.el.play();
    }
  });
};

/**
  ### _unbind()

  Gracefully detach elements that are using the stream from the 
  current stream.
**/
Media.prototype._unbind = function(opts) {
  // ensure we have opts
  opts = opts || {};

  // iterate through the bindings and detach streams
  this._bindings.forEach(function(binding) {
    var element = binding.el;

    // remove the source
    element.src = null;

    // check for moz
    if (element.mozSrcObject) {
      element.mozSrcObject = null;
    }

    // check for currentSrc
    if (element.currentSrc) {
      element.currentSrc = null;
    }
  });
};

/**
  ### _createObjectUrl(stream)

  This method is used to create an object url that can be attached to a video
  or audio element.  Object urls are cached to ensure only one is created
  per stream.
**/
Media.prototype._createObjectURL = function(stream) {
  try {
    return window.URL.createObjectURL(stream);
  }
  catch (e) {
  }
};

/**
  ### _handleSuccess(stream)
**/
Media.prototype._handleSuccess = function(stream) {
  // update the active stream that we are connected to
  this.stream = stream;

  // emit the stream event
  this.emit('stream', stream);
};

/**
  ### _handleFail(evt)
**/
Media.prototype._handleFail = function() {
  // TODO: make this more friendly
  this.emit('error', new Error('Unable to capture requested media'));
};

/**
  ## Debugging Tips

  Chrome and Chromium can both be started with the following flag:

  ```
  --use-fake-device-for-media-stream
  ```

  This uses a fake stream for the getUserMedia() call rather than attempting
  to capture the actual camera.  This is useful when doing automated testing
  and also if you want to test connectivity between two browser instances and
  want to distinguish between the two local videos.
**/