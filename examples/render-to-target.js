// create a video element
var crel = require('crel');
var video = crel('video');

// capture using default constraints and render to the target
require('..')({ target: video });

// add the target element to the document
document.body.appendChild(video);
