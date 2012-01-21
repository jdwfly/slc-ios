require('lib/require').monkeypatch(this);
var globals = {
  osname: Ti.Platform.osname,
  debugMode: false
};

var used = [Ti.UI.createButton, Ti.UI.createWindow, Ti.UI.iPhone.createNavigationGroup, Ti.UI.createTableView];

var testflight = require('com.0x82.testflight');
testflight.takeOff('d6b198db921f8ef931965685eeee400c_MzA5NTgyMDExLTA5LTIzIDE0OjI2OjMxLjQ2NjI3Nw');

(function() {
  var WindowObject;
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
    WindowObject = require('/ui/iphon/iPhoneWindow');
  }
  else {
    WindowObject = require('/ui/android/AndroidWindow');
  }
  new WindowObject().open();
})();