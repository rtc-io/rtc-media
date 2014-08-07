var detect = require('rtc-core/detect');
var extend = require('cog/extend');


function share(constraints, callback) {
  var vc = constraints && constraints.video;
  var source = vc && vc.mandatory && vc.mandatory.chromeMediaSource;

  function handleMessage(evt) {
    if (evt && evt.data && evt.data.type === 'shareresult') {
      window.removeEventListener('message', handleMessage);

      if (evt.data.error) {
        return callback(new Error(evt.data.error.message || evt.data.error));
      }

      // modify the constraints
      extend(constraints.video.mandatory, {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: evt.data.sourceId
      });

      // pass the constraints through
      return callback(null, constraints);
    }
  }

  // if we have no source, then we have nothing to do!
  if (! source) {
    return callback(null, constraints);
  }

  window.addEventListener('message', handleMessage);
  window.postMessage({ device: 'window', src: 'page', type: 'share' }, '*');
}

// NOTE:
// firefox requires Firefox Nightly
// and about:config tweaks:
// - media.getusermedia.screensharing.enabled
// - media.getusermedia.screensharing.allowed_domains
function shareMoz(constraints, callback) {
  return callback(null, constraints);
}

module.exports = detect.moz ? shareMoz : share;
