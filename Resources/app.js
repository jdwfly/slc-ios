require('lib/require').monkeypatch(this);
Ti.taffy = require('lib/taffy').taffyDb;

// GLOBAL VARS
var globals = {
  osname: Ti.Platform.osname,
  debugMode: true,
  firstRun: Ti.App.Properties.getBool('firstRun', true),
  db: require('lib/db')
};

// Initialize the taffy database with json
db = globals.db.init();

(function() {
  var WindowObject;
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
    WindowObject = require('/ui/iphon/iPhoneWindow');
  }
  else {
    WindowObject = require('/ui/android/AndroidWindow');
  }
  new WindowObject().open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
})();