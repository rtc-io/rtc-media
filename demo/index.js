var media = require('rtc-media');
var stream = media();

stream.on('start', function() {
  alert('started');
});

stream.render('.local');