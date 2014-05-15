/**
 * Contains all of the Application Level Events
 * This is only brought into the app.js so there are a few
 * vars that exist locally in app.js that are used here.
 */

function notOnlineAlert() {
  var dialog = Ti.UI.createAlertDialog({
    title: 'Oh noes!',
    message: 'You must be online in order to access our live stream events.',
    ok: 'Okay'
  }).show();
}

/*
 * Logs when a session is played to Flurry
 */
exports.playClick = function() {
  flurry.logEvent('Session Play', {
    title: args.title,
    speaker: args.speaker,
    track: args.track
  });
};

/*
 * Updates the event data in the db
 */
exports.eventsUpdate = function(args) {
  if (Ti.Network.online) {
    var events_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 300,
      onload: function(response) {
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        globals.slcdbSaveEvents(response.responseText);
        if (typeof args.callback === 'function') {
          args.callback;
        }
      }
    });
    if (args.prune) {
      events_xhr.prune_cache(0);
    }
    events_xhr.post({url: globals.eventsUrl});
  } else {
    notOnlineAlert();
  }
};

/*
 * Updates the speaker data in the db
 */
exports.speakersUpdate = function(args) {
  if (Ti.Network.online) {
    var speakers_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 300,
      onload: function(response) {
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        globals.setSpeakerData(response.responseText);
        Ti.App.fireEvent('speakers.updateTableView');
        if (typeof args.callback === 'function') {
          args.callback;
        }
      }
    });
    if (args.prune) {
      speakers_xhr.prune_cache(0);
    }
    speakers_xhr.post({url: globals.speakersUrl});
  } else {
    notOnlineAlert();
  }
};

exports.liveUpdate = function(args) {
  if (Ti.Network.online) {
    var live_xhr = new HTTPClientWithCache({
      baseUrl: globals.baseUrl,
      retryCount: 2,
      cacheSeconds: 300,
      onload: function(response) {
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        globals.setLiveData(response.responseText);
        Ti.App.fireEvent('live.updateTableView');
        if (typeof args.callback === 'function') {
          args.callback;
        }
      }
    });
    if (args.prune) {
      live_xhr.prune_cache(0);
    }
    live_xhr.post({url: globals.liveUrl});
  } else {
    notOnlineAlert();
  }
};

/*
 * Opens child window on the schedule tab
 */
exports.scheduleClick = function(opts) {
  var winClass = require('ui/common/workshopWindow').workshopWindow;
  var nodeData = globals.dbGetWorkshopEvents(opts.nid);
  var workshop = globals.dbGetSingleEvent(opts.nid);
  var args = {
    workshop: workshop,
    nodes: nodeData
  };
  var scheduleFirstWin = new winClass(args);
  mainTabView.activeTab.open(scheduleFirstWin, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    opts.callback();
  }
};

/*
 * Opens child window on the session tab
 */
exports.sessionClick = function(opts) {
  var winClass = require('ui/common/sessionDetailWindow').window;
  var nodeData = globals.dbGetSingleEvent(opts.nid);
  var args = {node: nodeData[0]};
  var audioPlayerWin = new winClass(args);
  mainTabView.activeTab.open(audioPlayerWin, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    opts.callback();
  }
};

/*
 * Opens child window on the map tab
 */
exports.mapClick = function(opts) {
  var winClass = require('ui/common/staticPageWindow').staticPageWindow;
  var mapDetailWindow = new winClass(opts);
  mainTabView.activeTab.open(mapDetailWindow, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
};

/*
 * Opens child window on the speakers tab
 */
exports.speakersClick = function(opts) {
  var winClass = require('ui/common/speakerDetailWindow').speakerDetailWindow;
  var speakerDetailWindow = new winClass(opts);
  mainTabView.activeTab.open(speakerDetailWindow, {animated: true});
  // Run user supplied callback
  if (typeof opts.callback === 'function') {
    callback();
  }
};

/*
 * Opens child window on livestream tab
 */
exports.liveClick = function() {
  if (Ti.Network.online) {
    var winClass = require('ui/iphon/livePlayerWindow').livePlayerWindow;
    var livePlayerWindow = new winClass();
    flurry.logEvent('Livestream Play');
    mainTabView.activeTab.open(livePlayerWindow, {animated: true});
  } else {
    notOnlineAlert();
  }
};

/*
 * Opens child window on news/photos tab
 * NOT IN USE CURRENTLY
 */
exports.photosClick = function(opts) {
  var winClass = require('ui/common/photosDetailWindow').photosDetailWindow;
  var photoDetailWindow = new winClass(opts);
  if (globals.osname != 'android') photoDetailWindow.hideTabBar();
  mainTabView.activeTab.open(photoDetailWindow, {animated: true});
  if (typeof opts.callback === 'function') {
    callback();
  }
};
