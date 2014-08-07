var detect = require('rtc-core/detect');

function share(constraints, callback) {
  var vc = constraints && constraints.video;
  var source = vc && vc.mandatory && vc.mandatory.chromeMediaSource;

  // if we have no source, then we have nothing to do!
  if (! source) {
    return callback(null, constraints);
  }

  callback(null, constraints);
}

function shareMoz(constraints, callback) {
  // not supporting moz yet
  return callback(null, constraints);
}

module.exports = detect.moz ? shareMoz : share;
