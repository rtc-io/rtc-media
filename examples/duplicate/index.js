var media = require('../../');
var stream = media();

// send the stream to the video element
stream.render('.video');

// when capture of the stream starts, create another stream and also
// render to the video element
stream.on('capture', function(stream) {
  media(stream).render('.video');
});