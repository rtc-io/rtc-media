var detect = require('rtc-core/detect');

require('./create-element');

if (! detect.moz) {
  require('./clone');
}
