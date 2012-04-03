// GLOBAL VARS
var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
Ti.App.fireEvent('events.update');
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
      cacheSeconds: 60,
      onload: (typeof _callback === 'function') ? _callback : function(response) {
        Ti.API.info("Response Data: "+ response.responseText);
        Ti.API.info("Is this cached data?: " + response.cached);
        globals.slcdbSaveEvents(response.responseText);
      }
    });
    events_xhr.post({url: globals.eventsUrl});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the application data.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
});

Ti.App.addEventListener('schedule.click', function(opts) {
  var className = opts.winClass.split("/");
  var winClass = require(opts.winClass)[className[2]];
  var scheduleFirstWin = new winClass(opts.arg, opts.title);
  Ti.API._activeTab.open(scheduleFirstWin, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
});

Ti.App.addEventListener('day.click', function(opts){
  var winClass = require('ui/common/workshopWindow').workshopWindow;
  var workshopWin = new winClass(opts);
  Ti.API._activeTab.open(workshopWin, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
});

Ti.App.addEventListener('map.click', function(opts) {
  var winClass = require('ui/common/staticPageWindow').staticPageWindow;
  var mapDetailWindow = new winClass(opts);
  Ti.API._activeTab.open(mapDetailWindow, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
});
