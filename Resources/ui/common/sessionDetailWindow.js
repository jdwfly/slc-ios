var g = require('lib/globals');

exports.window = function(opts) {
  var instance = Ti.UI.createWindow({
    backgroundImage: "/data/sessionPlayerBG.png",
    barColor: '#3b587b'
  });
  //Ti.API.info(opts);
  
  var textView = Ti.UI.createView({
    top: 275,
    left: 10,
    width: 200,
    height: 'auto',
    layout: 'vertical'
  });
  
  var titleLabel = Ti.UI.createLabel({
    text: g.html_decode(opts.node.title),
    color: '#273a51',
    font: {fontWeight: 'bold'},
    left: 0
  });
  textView.add(titleLabel);
  var speakerLabel = Ti.UI.createLabel({
    text: opts.node.speaker,
    color: '#4d73a0',
    font: {fontSize: 12},
    left: 0
  });
  textView.add(speakerLabel);
  var categoryLabel = Ti.UI.createLabel({
    text: g.html_decode(opts.node.track),
    color: '#515151',
    font: {fontSize: 12, fontStyle: 'italic'},
    left: 0
  });
  textView.add(categoryLabel);
  instance.add(textView);
  
  var buttonView = Ti.UI.createView({
    top: 275,
    left: 210,
    width: 'auto',
    height: 'auto',
    layout: 'horizontal'
  });
  var playButton = Ti.UI.createView({
    backgroundImage: '/data/36-circle-play.png',
    width: 44,
    height: 44
  });
  playButton.addEventListener('click', function(e) {
    //Ti.API.info('Play was clicked');
    //Ti.API.info(audioPlayer);
    //Ti.API.info('Is playing :' + audioPlayer.getPlaying());
    //Ti.API.info('Is paused  :' + audioPlayer.getPaused());
    //Ti.API.info('url        :' + audioPlayer.getUrl());
    if (audioPlayer.getUrl() != opts.node.download) {
      audioPlayer.stop();
      audioPlayer.setUrl(opts.node.download);
    }
    if (!audioPlayer.getPlaying() && !audioPlayer.getPaused()) {
      audioPlayer.setUrl(opts.node.download);
      audioPlayer.start();
    }
    if (audioPlayer.getPaused()) {
      audioPlayer.start();
    }
  });
  buttonView.add(playButton);
  var pauseButton = Ti.UI.createView({
    backgroundImage: '/data/37-circle-pause.png',
    width: 44,
    height: 44,
    left: 10
  });
  pauseButton.addEventListener('click', function(e) {
    audioPlayer.pause();
  });
  buttonView.add(pauseButton);
  
  instance.add(buttonView);
  if (opts.node.notes) {
    var notesButton = Ti.UI.createLabel({
      text: 'Notes',
      backgroundColor: '#333333',
      color: '#ffffff',
      top: 330,
      left: 210,
      width: 100,
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      borderRadius: 5
    });
    notesButton.notes = opts.node.notes;
    notesButton.addEventListener('click', function(e) {
      Ti.Platform.openURL(this.notes);
    });
    instance.add(notesButton);
  }
  
  return instance;
};
