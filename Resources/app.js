// GLOBAL VARS
var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;

// Initialize Flurry Analytics
var flurry = require('sg.flurry');
flurry.secureTransport(true);
flurry.logUncaughtExceptions(true);
flurry.crashReportingEnabled(true);
flurry.startSession('4FIT53J4GC77BQB84HX2');

// Grab the config.json file
var configFile = Ti.Filesystem.getFile("config.json");
var preParseData = (configFile.read().text);
var config = JSON.parse(preParseData);

var MainTabView = require('/ui/common/mainTabView').mainTabView;

// If there are no sessions, populate the database
var result = globals.dbGetEvents();
if (result.length == 0) {
  Ti.API.info("About to create events");
  Ti.App.fireEvent('events.update', {prune: true});
}
mainTabView = new MainTabView();

mainTabView.open();

// Global Event Listeners
// see lib/events.js for information
var events = require('lib/events');
Ti.App.addEventListener('play.click', events.playClick);

Ti.App.addEventListener('events.update', events.eventsUpdate);

if (config.tabs.schedule === true) {
  Ti.App.addEventListener('schedule.click', events.scheduleClick);
}

if (config.tabs.session === true) {
  Ti.App.addEventListener('session.click', events.sessionClick);
}

if (config.tabs.maps === true) {
  Ti.App.addEventListener('map.click', events.mapClick);
}

if (config.tabs.speakers === true) {
  Ti.App.addEventListener('speakers.click', events.speakersClick);
  Ti.App.addEventListener('speakers.update', events.speakersUpdate);
}

if (config.tabs.live === true) {
  Ti.App.addEventListener('live.click', events.liveClick);
  Ti.App.addEventListener('live.update', events.liveUpdate);
}

if (config.tabs.news === true) {
  Ti.App.addEventListener('photos.click', events.photosClick);
}

// Audio Player init - Not sure where else to do this
var audioPlayer = Ti.Media.createAudioPlayer({
  allowBackground: true
});
var nowPlaying = {};

Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;
