var test = require('tape');
var media = require('..');

test('can capture a media stream', function(t) {
  t.plan(1);

  media().on('start', function(stream) {
    t.ok(stream instanceof MediaStream, 'successfully started media stream');
  });
});

test('can render a media stream', function(t) {
  t.plan(1);

  media()
    .on('start', function(stream) {
      t.ok(stream instanceof MediaStream, 'valid stream');
    })
    .render(document.body);
});

/*
test('create a video element', function(t) {
});
*/