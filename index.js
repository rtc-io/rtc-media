var capture = require('rtc-capture');
var attach = require('rtc-attach');

/**
  # rtc-media

  This is a convenience function for invoking media capture and rendering
  using the [`rtc-capture`](https://github.com/rtc-io/rtc-capture) and
  [`rtc-attach`](https://github.com/rtc-io/rtc-attach) packages respectively
  within an application.

  ## Example Usage

  Default constraints (`{ audio: true, video: true }`) capture and rendering
  an new video element within the document.body:

  <<< examples/render-to-body.js

**/

module.exports = function(opts) {
  // do we have constraints
  var constraints = (opts || {}).constraints || { video: true, audio: true };

  // or do we have a stream
  var stream = (opts || {}).stream;

  // if we have been passed constraints, assume we are attaching a local stream
  // otherwise, use the generic attach options
  var streamAttach = constraints ? attach.local : attach;

  // detect a target
  var target = (opts || {}).target || document.body;

  function handleAttach(err, el) {
    if (err) {
      return;
    }

    if (target && target !== el) {
      target.appendChild(el);
    }
  }

  // if we have a stream, move onto rendering immediately
  if (stream) {
    return streamAttach(stream, opts, handleAttach);
  }

  return capture(constraints, opts, function(err, stream) {
    streamAttach(stream, opts, handleAttach);
  });
};
