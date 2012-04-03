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
    {title: "Registration", hasChild:true, test:'../pages/staticpage.js', staticpage:'registration.html'},
    {title: "Saturday, June 9", hasChild:true, test:'../pages/day.js', date:'June 9, 2012'},
    {title: "Sunday, June 10", hasChild:true, test:'../pages/day.js', date:'June 10, 2012'},
    {title: "Monday, June 11", hasChild:true, test:'../pages/day.js', date:'June 11, 2012'},
    {title: "Tuesday, June 12", hasChild:true, test:'../pages/day.js', date:'June 12, 2012'},
    {title: "Wednesday, June 13", hasChild:true, test:'../pages/day.js', date:'June 13, 2012'}];
  var scheduleTableView = Ti.UI.createTableView({data:scheduleData});
  
  scheduleTableView.addEventListener('click', function(e) {
    /*
      All of this will need to change to App event listener
    if (e.rowData.test) {
      slc.scheduleFirstWin = Ti.UI.createWindow({
        url:e.rowData.test,
        title:e.rowData.title,
        staticpage: e.rowData.staticpage,
        date: e.rowData.date
      });
      Ti.UI.currentTab.open(slc.scheduleFirstWin,{animated:true});
    }
    */
  });
  instance.add(scheduleTableView);
  
  return instance;
}
