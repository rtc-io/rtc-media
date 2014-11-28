var crel = require('crel');

// ensure we have a style tag that tells the video renderer what size it should be
document.body.appendChild(crel('style', [
  'body { margin: 0px; width: 100vw; height: 100vh; overflow: hidden }',
  'body > * { width: 100%; height: 100%; object-fit: contain }'
].join('\n')));

// specify a plugin
require('..')({
  target: document.body,
  plugins: [
    require('rtc-plugin-nicta-ios')
  ]
});
