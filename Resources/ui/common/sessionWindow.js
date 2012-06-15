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
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
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
    Ti.App.fireEvent('session.click', {nid: e.row.nid});
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
  for (var i = 0, item; item = events[i]; i++) {
    // no download, dont show
    if (item.download == 'None') continue;
    Ti.API.info(item);
    title = g.html_decode(item.title);
    row = Ti.UI.createTableViewRow({
      title: title
    });
    row.nid = item.nid;
    data.push(row);
  }
  return data;
}
