var test = require('tape');
var detect = require('rtc-core/detect');
var media = require('..');
var clone = require('../clone');
var checkVideo = require('./helpers/check-video');
var cloned;

test('can capture and clone a media stream', function(t) {
  t.plan(3);

  media().on('capture', function(stream) {
    cloned = clone(stream);

    t.ok(stream instanceof MediaStream, 'successfully started media stream');
    t.ok(cloned instanceof MediaStream, 'successfully cloned stream');

    if (detect.moz) {
      t.ok(true, 'This browser cannot clone a stream :(');
    }
    else {
      t.ok(stream !== cloned, 'streams are not equal');
    }
  });
});

test('can render the cloned stream', function(t) {
  t.plan(3);

  media({ stream: cloned, muted: true }).render(document.body, function(el) {
    t.ok(el);
    t.equal(el.parentNode, document.body);
    t.ok(checkVideo([el]), 'valid streams');
  });
});
