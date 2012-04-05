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
      cacheSeconds: 10,
      onload: function(response) {
        Ti.API.info("Response Data: "+ response.responseText);
        Ti.API.info("Is this cached data?: " + response.cached);
        globals.slcdbSaveEvents(response.responseText);
        if (typeof _callback === 'function') {
          _callback;
        }
      }
    });
    events_xhr.post({url: globals.eventsUrl});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the schedule data.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
});

Ti.App.addEventListener('speakers.update', function(_callback){
  if (Ti.Network.online) {
    var speakers_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 3600,
      onload: function(response) {
        Ti.API.info("Response Data: "+ response.responseText);
        Ti.API.info("Is this cached data?: " + response.cached);
        globals.setSpeakerData(response.responseText);
        Ti.App.fireEvent('speakers.updateTableView');
        if (typeof _callback === 'function') {
          _callback;
        }
      }
    });
    //speakers_xhr.prune(0);
    speakers_xhr.post({url: globals.speakersUrl});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the speakers data.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
});

Ti.App.addEventListener('schedule.click', function(opts) {
  var className = opts.winClass.split("/");
  var winClass = require(opts.winClass)[className[2]];
  var scheduleFirstWin = new winClass(opts);
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

Ti.App.addEventListener('speakers.click', function(opts) {
  var winClass = require('ui/common/speakerDetailWindow').speakerDetailWindow;
  var speakerDetailWindow = new winClass(opts);
  Ti.API._activeTab.open(speakerDetailWindow, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
});

Ti.App.addEventListener('live.click', function() {
  if (Ti.Network.online) {
    var winClass = require('ui/iphon/livePlayerWindow').livePlayerWindow;
    var livePlayerWindow = new winClass();
    Ti.API._activeTab.open(livePlayerWindow, {animated: true});
  } else {
    var dialog = Ti.UI.createAlertDialog({
      title: 'Oh noes!',
      message: 'You must be online in order to access our live stream events.',
      ok: 'Okay'
    }).show();
  }
});
