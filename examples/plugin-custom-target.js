// create the video target
var crel = require('crel');
var video = crel('video');

// ensure we have a style tag that tells the video renderer what size it should be
document.body.appendChild(crel('style', [
  'body { margin: 0px; width: 100vw; height: 100vh; overflow: hidden }',
  'body > * { width: 100%; height: 100%; object-fit: contain }'
].join('\n')));

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
