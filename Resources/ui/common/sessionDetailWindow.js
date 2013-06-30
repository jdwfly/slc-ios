var g = require('lib/globals');

exports.window = function(opts) {
  var instance = Ti.UI.createWindow({
    backgroundImage: "/data/sessionPlayerBG.jpg",
    barColor: '#3b587b'
  });
  //Ti.API.info(opts);

  
  var textView = Ti.UI.createView({
    bottom: 0,
    right: 10,
    width: 200,
    height: 100,
    layout: 'vertical'
  });
  
  var titleLabel = Ti.UI.createLabel({
    text: g.html_decode(opts.node.title),
    color: '#273a51',
    font: {fontWeight: 'bold'},
    right: 0
  });
  textView.add(titleLabel);
  var speakerLabel = Ti.UI.createLabel({
    text: opts.node.speaker,
    color: '#273a51',
    font: {fontSize: 12},
    right: 0
  });
  textView.add(speakerLabel);
  var categoryLabel = Ti.UI.createLabel({
    text: g.html_decode(opts.node.track),
    color: '#273a51',
    font: {fontSize: 12, fontStyle: 'italic'},
    right: 0
  });
  textView.add(categoryLabel);
  instance.add(textView);
  
  var buttonView = Ti.UI.createView({
    bottom: 50,
    left: 10,
    width: 'auto',
    height: 44,
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
    Ti.App.fireEvent('play.click', {
      title: g.html_decode(opts.node.title),
      speaker: opts.node.speaker,
      track: g.html_decode(opts.node.track)
    });
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
      bottom: 10,
      left: 10,
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
