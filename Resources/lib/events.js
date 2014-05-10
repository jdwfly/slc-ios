/**
 * Contains all of the Application Level Events
 * This is only brought into the app.js so there are a few
 * vars that exist locally in app.js that are used here.
 */

exports.liveClick = function() {
  if (Ti.Network.online) {
    var winClass = require('ui/iphon/livePlayerWindow').livePlayerWindow;
    var livePlayerWindow = new winClass();
    flurry.logEvent('Livestream Play');
    mainTabView.activeTab.open(livePlayerWindow, {animated: true});
  } else {
    var dialog = Ti.UI.createAlertDialog({
      title: 'Oh noes!',
      message: 'You must be online in order to access our live stream events.',
      ok: 'Okay'
    }).show();
  }
};
