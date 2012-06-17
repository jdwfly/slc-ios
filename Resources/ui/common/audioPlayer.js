var g = require('lib/globals');
var videoPlayer = '';
Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_AMBIENT;

exports.window = function(opts) {
  Ti.API.info(opts);
  var instance = Ti.UI.createWindow({
    title: 'Listen',
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  /**
  var mainView = Ti.UI.createView({
    layout: 'vertical'
  });
  
  var titleLabel = Ti.UI.createLabel({
    text: g.html_decode(opts.node.title)
  });
  mainView.add(titleLabel);
  
  var speakerLabel = Ti.UI.createLabel({
    text: opts.node.speaker
  });
  mainView.add(speakerLabel);
  
  var buttonView = Ti.UI.createView({
    layout: 'horizontal'
  });
  var playButton = Ti.UI.createView({
    backgroundImage: '/data/36-circle-play.png',
    width: 40,
    height: 40
  });
  buttonView.add(playButton);
  var stopButton = Ti.UI.createView({
    backgroundImage: '/data/38-circle-stop.png',
    width: 40,
    height: 40
  });
  mainView.add(buttonView);
  */
  videoPlayer = Ti.Media.createVideoPlayer({
    url: opts.node.download,
    allowBackground: true
  });
  
  instance.add(videoPlayer);
  
  instance.addEventListener('open', function(e) {
    videoPlayer.play();
  });
  
  return instance;
};

Ti.App.addEventListener('pause', function(e) {
  videoPlayer.pause();
});
Ti.App.addEventListener('resume', function(e) {
  videoPlayer.play();
});
