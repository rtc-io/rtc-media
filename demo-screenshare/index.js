var media = require('../');
var qsa = require('cog/qsa');

var constraints = { constraints:
                    { video: {
                        mandatory: {
                          chromeMediaSource: 'screen'
                        }
                      }
                    }
                  };


var video = media( constraints );

// create media and attach to the specified element
video.render('.video');

window.addEventListener('load', function() {
  qsa('button').forEach(function(button){
    button.addEventListener('click', function() {
      video[button.dataset.action].call(video);
    });
  });
});
