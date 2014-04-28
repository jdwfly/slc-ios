var g = require('lib/globals');

exports.window = function(opts) {
  var instance = Ti.UI.createWindow({
    backgroundImage: "/data/sessionPlayerBG.jpg"
  });

  var textView = Ti.UI.createView({
    bottom: 0,
    right: "10dp",
    width: "200dp",
    height: "100dp",
    layout: 'vertical'
  });
  
  var titleLabel = Ti.UI.createLabel({
    text: g.html_decode(opts.node.title),
    color: '#273a51',
    font: {fontWeight: 'bold', fontSize: "14dp"},
    right: 0
  });
  textView.add(titleLabel);
  var speakerLabel = Ti.UI.createLabel({
    text: opts.node.speaker,
    color: '#273a51',
    font: {fontSize: "12dp"},
    right: 0
  });
  textView.add(speakerLabel);
  var categoryLabel = Ti.UI.createLabel({
    text: g.html_decode(opts.node.track),
    color: '#273a51',
    font: {fontSize: "12dp", fontStyle: 'italic'},
    right: 0
  });
  textView.add(categoryLabel);
  instance.add(textView);
  
  var buttonView = Ti.UI.createView({
    bottom: "50dp",
    left: "10dp",
    width: 'auto',
    height: "44dp",
    layout: 'horizontal'
  });
  var playButton = Ti.UI.createView({
    backgroundImage: '/data/36-circle-play.png',
    width: "44dp",
    height: "44dp"
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
    width: "44dp",
    height: "44dp",
    left: "10dp"
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
      bottom: "10dp",
      left: "10dp",
      width: "100dp",
      font: {fontSize: "12dp"},
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
