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
  var elements;

  t.plan(4);

  elements = media()
    .on('capture', function(stream) {
      t.ok(stream instanceof MediaStream, 'valid stream');
    })
    .on('render', function() {
      t.ok(checkVideo(elements), 'valid streams');
    })
    .render(document.body);

  t.equal(elements.length, 1);
  t.equal(elements[0].parentNode, document.body);
});

test('can wrap an existing stream', function(t) {
  t.plan(3);

  media(testStream).render(document.body, function(elements) {
    t.equal(elements.length, 1);
    t.equal(elements[0].parentNode, document.body);
    t.ok(checkVideo(elements), 'valid streams');
  });
});

/*
test('create a video element', function(t) {
});
*/