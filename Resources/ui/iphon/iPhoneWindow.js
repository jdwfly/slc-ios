exports.iPhoneWindow = function() {
  var leftNavButton = Ti.UI.createButton({
    title: 'Menu'
  });
  leftNavButton.addEventListener('click', function() {
    if (navGroup.slide) {
      navGroup.animate({left: 0, duration: 500});
      navGroup.slide = false;
    } else {
      navGroup.animate({left: 250, duration: 700});
      navGroup.slide = true;
    }
  });
  var instance = Ti.UI.createWindow({
    backgroundColor: '#ffffff'
  });
  var mainWindow = Ti.UI.createWindow({
    title: 'Schedule',
    backgroundColor: '#ffffff',
    leftNavButton: leftNavButton,
    barColor: '#64770d'
  });
  var viewport = Ti.UI.createScrollView({});
  toolbar = require('ui/common/scheduleToolbar');
  scheduleToolbar = new toolbar({
    top: 0,
    height: 44,
    borderTop: false,
    borderBottom: true,
    barColor: '#eff1f6',
    borderColor: '#b9bcc1',
    zIndex: 1000
  });
  mainWindow.add(scheduleToolbar);
  
  var data = [];
  db().each(function(e) {
    data.push({title: e.name});
  });
  var tableView = Ti.UI.createTableView({
    top: 44,
    data: data
  });
  Ti.API.info(data);
  //viewport.add(tableView);
  mainWindow.add(tableView);
  var sideMenu = require('ui/common/sideMenu');
  var mainMenu = new sideMenu();
  
  var navGroup = Ti.UI.iPhone.createNavigationGroup({
    window: mainWindow,
    width: '100%',
    slide: false
  });
  instance.add(mainMenu);
  instance.add(navGroup);
  
  return instance;
};