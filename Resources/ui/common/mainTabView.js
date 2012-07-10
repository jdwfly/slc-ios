var globals = require('lib/globals');
exports.mainTabView = function() {
  var instance = Ti.UI.createTabGroup();
  
  /*
   Not Used after conference
  var scheduleWindow = require('ui/common/scheduleWindow').scheduleWindow;
  var scheduleTab = Ti.UI.createTab({  
    icon: 'data/11-clock.png',
    title: 'Schedule',
    window: new scheduleWindow()
  });
  */
  
  var sessionWindow = require('ui/common/sessionWindow').window;
  var sessionTab = Ti.UI.createTab({
    icon: 'data/120-headphones.png',
    title: 'Sessions',
    window: new sessionWindow()
  });
  
  var mapsWindow = require('ui/common/mapsWindow').mapsWindow;
  var mapsTab = Ti.UI.createTab({  
    icon: 'data/103-map.png',
    title: 'Maps',
    window: new mapsWindow()
  });
  
  var newsWindow = require('ui/common/newsWindow').newsWindow;
  var newsTab = Ti.UI.createTab({
    icon: 'data/45-movie-1.png',
    title: 'Media',
    window: new newsWindow()
  });
  
  var speakersWindow = require('ui/common/speakersWindow').speakersWindow;
  var speakersTab = Ti.UI.createTab({
    icon: 'data/112-group.png',
    title: 'Speakers',
    window: new speakersWindow()
  });
  
  var liveWindow = require('ui/iphon/liveWindow').liveWindow;
  var liveTab = Ti.UI.createTab({
    icon: 'data/69-display.png',
    title: 'Live',
    window: new liveWindow()
  });
    
  instance.addTab(sessionTab);
  instance.addTab(mapsTab);
  instance.addTab(newsTab);
  instance.addTab(speakersTab);
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
    instance.addTab(liveTab);
  }
  
  // Workaround for not knowing the current tab
  // http://developer.appcelerator.com/question/98501/titaniumuicurrenttab-is-null
  instance.addEventListener('focus', function(e) {
    instance._activeTab = e.tab;
    instance._activeTabIndex = e.index;
    if (instance._activeTabIndex == -1) return;
    //Ti.API.info(instance._activeTabIndex);
    //Ti.API.info(instance._activeTab.title);
    Ti.API._activeTab = instance._activeTab;
    //Ti.API.info(Ti.API._activeTab.title);
  });
  
  return instance;
}
