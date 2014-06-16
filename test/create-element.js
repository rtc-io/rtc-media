var test = require('tape');
var media = require('..');
var checkVideo = require('./helpers/check-video');
var testStream;

test('can capture a media stream', function(t) {
  t.plan(1);

  media().on('capture', function(stream) {
    t.ok(stream instanceof MediaStream, 'successfully started media stream');
    testStream = stream;
  });
});

test('can render a media stream', function(t) {
  var element;

  t.plan(4);

  element = media()
    .on('capture', function(stream) {
      t.ok(stream instanceof MediaStream, 'valid stream');
    })
    .on('render', function() {
      t.ok(checkVideo([element]), 'valid streams');
      t.equal(element.parentNode, document.body, 'element inserted');
    })
    .render(document.body);

  t.ok(element instanceof HTMLMediaElement, 'created media element');
});

test('can wrap an existing stream', function(t) {
  t.plan(3);

  media({ stream: testStream, muted: true }).render(document.body, function(el) {
    t.ok(el);
    t.equal(el.parentNode, document.body);
    t.ok(checkVideo([el]), 'valid streams');
  });
});

/*
test('create a video element', function(t) {
});
*/
