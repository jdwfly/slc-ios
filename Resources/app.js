// GLOBAL VARS
var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
Ti.API.info(globals.osname);
var MainTabView;
if (globals.osname === 'iphone' || globals.osname === 'android') {
  MainTabView = require('/ui/common/mainTabView').mainTabView;
}
else {
  MainTabView = require('/ui/ipad/ipadMainWindow');
}
new MainTabView().open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});

// Global Event Listeners
Ti.App.addEventListener('events.update', function(_callback){
  if (Ti.Network.online) {
    var events_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 3600,
      onload: (typeof _callback === 'function') ? _callback : function(response) {
        Ti.API.info("Response Data: "+ response.responseText);
        Ti.API.info("Is this cached data?: " + response.cached);
      }
    });
    events_xhr.post({url: globals.eventsUrl});
  } else {
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the application data.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
});

Ti.App.addEventListener('schedule.click', function(opts) {
  var className = opts.winClass.split("/");
  Ti.API.info("className = " + className);
  var winClass = require(opts.winClass)[className[2]];
  Ti.API.info("winClass = " + winClass);
  var scheduleFirstWin = new winClass();
  Ti.API._activeTab.open(scheduleFirstWin, {animated: true});
});
