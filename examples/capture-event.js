var media = require('..');
var localMedia = require('..')();

localMedia.render(document.body);
localMedia.once('capture', function(stream) {
  // stream references underlying media stream that was captured
  console.log('capture complete');
});