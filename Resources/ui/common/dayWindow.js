// THIS FILE MAY BE REMOVED BEFORE TESTING
// WARNING: NONE OF THIS CODE IS ACUTALLY NEEDED
var globals = require('lib/globals');
exports.dayWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.title,
    backgroundColor: '#fff'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  var today = new Date(opts.arg);
  
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
  
  var myDateString = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2);
  var events = globals.slcdbGetEvents(myDateString);
  var data = [];
  while (events.isValidRow()) {
    var row = Ti.UI.createTableViewRow();
    row.header = globals.secondsToTime(events.fieldByName('datefrom')) + '-' + globals.secondsToTime(events.fieldByName('dateto'));
    row.selectionStyle = "none";
    var title = globals.html_decode(events.fieldByName('title'));
    var content = Ti.UI.createLabel({
      text: title
    });
    if (events.fieldByName('eventtype') == "Workshop") {
      row.hasChild = true;
      row.selectionStyle = 1;
    }
    row.add(content);
    data.push(row);
    events.next();
  }
  var tableView = Ti.UI.createTableView({
    data:data
  });
  
  tableView.addEventListener('click', function(f){
    if (f.rowData.hasChild) {
      Ti.App.fireEvent('day.click', {
        header: f.rowData.header,
        title: f.row.children[0].text,
        date: today,
        callback: false
      });
    }
  });
  instance.add(tableView);
  
  return instance;
}
