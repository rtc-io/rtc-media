var canClone = typeof MediaStreamTrack != 'undefined' &&
  typeof MediaStreamTrack.prototype.clone == 'function';

/**

  #### `clone(inputStream, opts?)` => MediaStream

  The `clone` helper function accepts an existing `MediaStream` and creates
  a new `MediaStream` with a cloned copy of each of the audio and video
  tracks contained within.

  This can be useful when you wish to mute (disable) either an audio or
  video stream sent over the wire, but keep the locally rendered stream
  active.

  __NOTE:__ At this time it is not possible to clone a `MediaStreamTrack` in
  firefox (https://bugzilla.mozilla.org/show_bug.cgi?id=910249).  When this
  function is called in firefox, the original stream is returned rather than
  throwing an error.

  <<< examples/clone.js

  An additional `opts` argument can be passed to this function to
  selectively filter which tracks are cloned:

  - `filterAudio` - a filter **function** that can be used to decide
    whether an audio track is cloned into the new `MediaStream`.

  - `filterVideo` - as per the `filterAudio` option but for video
    tracks.

**/
module.exports = function(input, opts) {
  var audioTrackFilter = (opts || {}).filterAudio || Boolean;
  var videoTrackFilter = (opts || {}).filterVideo || Boolean;
  var tracks = [];

  // if we are unable to clone tracks, then return the original MediaStream
  // it's not ideal, but probably better than erroring out
  if (! canClone) {
    return input;
  }

  tracks = []
    // clone the audio tracks
    .concat(input.getAudioTracks().filter(audioTrackFilter).map(cloneTrack))
    // clone the video tracks
    .concat(input.getVideoTracks().filter(videoTrackFilter).map(cloneTrack));

  return new MediaStream(tracks);
};

function cloneTrack(track) {
  return track.clone();
}
