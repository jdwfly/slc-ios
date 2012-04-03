var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
exports.scheduleWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Schedule',
    backgroundColor: '#fff'
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
  
  var scheduleData = [
    {title: "Registration", hasChild:true, winClass:'ui/common/staticPageWindow', arg:'registration.html'},
    {title: "Saturday, June 9", hasChild:true, winClass:'ui/common/dayWindow', arg:'June 9, 2012'},
    {title: "Sunday, June 10", hasChild:true, winClass:'ui/common/dayWindow', arg:'June 10, 2012'},
    {title: "Monday, June 11", hasChild:true, winClass:'ui/common/dayWindow', arg:'June 11, 2012'},
    {title: "Tuesday, June 12", hasChild:true, winClass:'ui/common/dayWindow', arg:'June 12, 2012'},
    {title: "Wednesday, June 13", hasChild:true, winClass:'ui/common/dayWindow', arg:'June 13, 2012'}];
  var scheduleTableView = Ti.UI.createTableView({data:scheduleData});
  
  scheduleTableView.addEventListener('click', function(e) {
    Ti.App.fireEvent('schedule.click', {
      winClass: e.rowData.winClass, 
      arg: e.rowData.arg,
      title: e.rowData.title,
      callback: false
    });
  });
  instance.add(scheduleTableView);
  
  return instance;
}
