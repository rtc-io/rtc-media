var media = require('..');
var clone = require('../clone');

media().on('capture', function(stream) {
  // create a clone of the stream
  var cloned = clone(stream);

  // using the cloned stream, we will be able to enable and disable tracks without
  // affecting the originally cloned stream
});
