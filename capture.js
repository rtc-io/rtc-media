/* jshint node: true */
/* global navigator: false */

'use strict';

var detect = require('rtc-core/detect');

// monkey patch getUserMedia from the prefixed version
navigator.getUserMedia = detect.call(navigator, 'getUserMedia');

module.exports = function(constraints, callback) {
  navigator.getUserMedia(
    constraints,
    callback.bind(null, null),
    callback
  );
};