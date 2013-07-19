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
console.log(video.render('.video'));