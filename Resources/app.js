require('lib/require').monkeypatch(this);
var globals = {
  osname: Ti.Platform.osname,
  debugMode: true
};

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