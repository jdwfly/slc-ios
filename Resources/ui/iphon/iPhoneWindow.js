exports.iPhoneWindow = function() {
  var instance = Ti.UI.createWindow({
    backgroundColor: '#ffffff'
  });
  var mainWindow = Ti.UI.createWindow({
    title: 'Schedule',
    backgroundColor: '#ffffff',
    barColor: '#64770d'
  });
  var viewport = Ti.UI.createScrollView({});
  toolbar = require('ui/common/scheduleToolbar').scheduleToolbar;
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
  
  var navGroup = Ti.UI.iPhone.createNavigationGroup({
    window: mainWindow,
    width: '100%',
    slide: false
  });
  instance.add(navGroup);
  
  return instance;
};