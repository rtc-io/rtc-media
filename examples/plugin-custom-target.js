// create the video target
var crel = require('crel');
var video = require('video');

// specify a plugin
require('..')({
  target: video,
  plugins: [
    require('rtc-plugin-nicta-ios')
  ]
});

// add the target to the document
// NOTE: original video element may be removed and replaced with
// an element suited to plugin rendering requirements (e.g. canvas)
document.body.appendChild(video);
