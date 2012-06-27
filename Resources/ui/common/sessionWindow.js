var g = require('lib/globals');
var tableView = Ti.UI.createTableView();
var data = [];
var index = [];

exports.window = function() {
  var instance = Ti.UI.createWindow({
    title: 'Sessions',
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  
  // Android Specific Code
  if (g.osname === 'android') {
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
  if (g.osname === 'iphone' || g.osname === 'ipad') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('events.update', {prune: true});
    });
    instance.rightNavButton = refresh;
  }
  
  var search = Ti.UI.createSearchBar();
  tableView.data = getSessionData();
  tableView.search = search;
  tableView.index = index;
  instance.add(tableView);
  
  instance.addEventListener('focus', function(e) {
    Ti.App.fireEvent('events.update');
  });
  instance.addEventListener('click', function(e) {
    Ti.App.fireEvent('session.click', {nid: e.row.node.nid});
  });
  
  return instance;
};

Ti.App.addEventListener('sessions.updateTableView', function(e) {
  var sessionData = getSessionData();
  tableView.setData(sessionData);
});

function getSessionData() {
  var events = g.slcdbGetSessions(),
      data = [],
      row = '',
      title = '';
  for (var i = 0, node; node = events[i]; i++) {
    // no download, dont show
    if (node.download == 'None') continue;
    title = g.html_decode(node.title);
    speaker = node.speaker;
    room = node.room;
    category = g.html_decode(node.track);
    row = Ti.UI.createTableViewRow({
      backgroundColor: '#eeeeee',
      layout: 'absolute',
      height: 78
    });
    row.notes = node.notes;
    row.node = node;
    /**
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
    */
    
    textView = Ti.UI.createView({
      top: 5,
      left: 15,
      width: 'auto',
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
    
    speakerLabel = Ti.UI.createLabel({
      text: speaker,
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
    data.push(row);
  }
  return data;
}
