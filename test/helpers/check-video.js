function captureFrame(el) {
  var canvas;
  var context;

  // if the element is not valid, then bail
  if ((! el) || (! (el instanceof HTMLVideoElement))) {
    return;
  }

  // create an offscreen canvas
  canvas = document.createElement('canvas');
  canvas.width = el.videoWidth;
  canvas.height = el.videoHeight;
  context = canvas.getContext('2d');

  document.body.appendChild(canvas);

  // draw the video onto the context
  context.drawImage(el, 0, 0);

  return canvas;
}

function validFrame(frame) {
  if (typeof frame == 'undefined') {
    return false;
  }

  return true;
}

module.exports = function(elements) {
  var ok = Array.isArray(elements);
  var frames = ok && elements.map(captureFrame);

  return ok && frames.filter(validFrame).length === elements.length;
};