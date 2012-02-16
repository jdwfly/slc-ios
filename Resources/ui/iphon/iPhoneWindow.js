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
    title: 'Testing',
    backgroundColor: '#ffffff',
    leftNavButton: leftNavButton
  });
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