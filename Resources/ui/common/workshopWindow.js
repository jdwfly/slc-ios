var globals = require('lib/globals');
exports.workshopWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.workshop.fieldByName('title'),
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
  
  var tableData = [], workshopTableView, row;
  
  if (opts.nodes.rowCount != 0) {
    while (opts.nodes.isValidRow()) {
      row = {title: opts.nodes.fieldByName('title')};
      tableData.push(row);
      opts.nodes.next();
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
