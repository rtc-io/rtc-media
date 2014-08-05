/**

  #### `clone(inputStream, opts?)` => MediaStream

  The `clone` helper function accepts an existing `MediaStream` and creates
  a new `MediaStream` with a cloned copy of each of the audio and video
  tracks contained within.

  This can be useful when you wish to mute (disable) either an audio or
  video stream sent over the wire, but keep the locally rendered stream
  active.

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
  var tracks = []
    // clone the audio tracks
    .concat(input.getAudioTracks().filter(audioTrackFilter).map(cloneTrack)
    // clone the video tracks
    .concat(input.getVideoTracks().filter(videoTrackFilter).map(cloneTrack);

  return new MediaStream(tracks);
};

function cloneTrack(track) {
  return track.clone();
}
