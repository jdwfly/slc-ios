var globals = require('lib/globals');
exports.workshopWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.workshop[0].title,
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  
  // Android Specific Code
  if (globals.osname === 'android') {
    instance.backgroundColor = "#111111";
    instance.activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      var menuItem = menu.add({title:"Refresh"});
      menuItem.addEventListener("click", function(e) {
        Ti.App.fireEvent('events.update');
      });
    };
  }
  
  // iPhone Specific Code
  if (globals.osname === 'iphone') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('events.update');
    });
    instance.rightNavButton = refresh;
  }
  
  var tableData = [], workshopTableView, row, title, titleLabel, notesImage,
    textView, speaker, speakerLabel, category, categoryLabel, room;
  
  if (opts.nodes.length != 0) {
    for (var i = 0, node; node = opts.nodes[i]; i++) {
      //Ti.API.info(node);
      title = globals.html_decode(node.title);
      speaker = node.speaker;
      room = node.room;
      category = globals.html_decode(node.track);
      row = Ti.UI.createTableViewRow({
        backgroundColor: '#eeeeee',
        layout: 'absolute',
        height: 90
      });
      row.node = node;
      if (node.notes != "None") {
        row.notes = node.notes;
        notesImage = Ti.UI.createImageView({
          image: '/data/notes.png',
          left: 15,
          top: 5,
          height: 74,
          width: 63
        });
        notesImage.notes = node.notes;
        notesImage.addEventListener('click', function(s) {
          if (this.notes == "None") {
            var dialog = Ti.UI.createAlertDialog({
              message: "We're sorry, but the notes for this session are not available.",
              ok: 'Okay',
              title: 'Oh noes!'
            }).show();
          } else {
            Ti.Platform.openURL(this.notes);
          }
        });
        row.add(notesImage);
      }
      
      textView = Ti.UI.createView({
        top: 5,
        left: 85,
        width: '70%',
        height: 'auto',
        layout: 'vertical'
      });
      
      titleLabel = Ti.UI.createLabel({
        text: title,
        color: '#273a51',
        font: {fontWeight: 'bold'},
        left: 0
      });
      textView.add(titleLabel);
      
      if (room == null) {
        room = '';
      } else {
        room = " | " + room;
      }
      
      speakerLabel = Ti.UI.createLabel({
        text: speaker + room,
        color: '#4d73a0',
        font: {fontSize: 12},
        left: 0
      });
      textView.add(speakerLabel);
      
      categoryLabel = Ti.UI.createLabel({
        text: category,
        color: '#515151',
        font: {fontSize: 12, fontStyle: 'italic'},
        left: 0
      });
      textView.add(categoryLabel);
      
      row.add(textView);
      row.add(Ti.UI.createView({
        bottom: 0,
        width: "90%",
        height: 1,
        backgroundColor: '#e0e0e0'
      }));
      
      row.addEventListener('click', function(e) {
        //Ti.API.info(JSON.stringify(e.row));
        var options = [];
        if (e.row.node.notes != 'None') options.push('View Notes');
        if (e.row.node.download != 'None') options.push('Play Session', 'Download Session');
        options.push('Cancel');
        if (options[0] == 'Cancel') return;
        var sessionDialog = Ti.UI.createOptionDialog({
          options: options,
          cancel: globals.array_search('Cancel', options)
        });
        sessionDialog.addEventListener('click', function(f) {
          //Ti.API.info(options[f.index]);
          if (options[f.index] == 'View Notes') {
            Ti.Platform.openURL(e.row.node.notes);
          }
          if (options[f.index] == 'Play Session') {
            // TODO
            var audioWindow = Ti.UI.createWindow({
              title: 'Now Playing',
              backgroundColor: '#010101'
            });
            var audioPlayer = Ti.Media.createAudioPlayer({
              url: e.row.node.download,
              allowBackground: true
            });
            audioWindow.add(audioPlayer);
            
            var playButton = Ti.UI.createButton({
              
            });
            playButton.addEventListener('click', function(d) {
              audioPlayer.start();
            });
            audioWindow.add(playButton);
            
            mainTabView.activeTab.open(audioWindow, {animated: true});
          }
          if (options[f.index] == 'Download Session') {
            // TODO
          }
        });
        sessionDialog.show();
      });
      
      tableData.push(row);
    }
  } else {
    tableData = [{title: 'No results'}];
  }
  workshopTableView = Ti.UI.createTableView({
    data: tableData,
    separatorColor: '#eeeeee',
    backgroundColor: '#eeeeee'
  });
  instance.add(workshopTableView);
  
  return instance;
};
