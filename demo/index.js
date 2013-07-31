var media = require('../');
var stream = media();

stream.on('start', function() {
  alert('started');
});

stream.render('.local');