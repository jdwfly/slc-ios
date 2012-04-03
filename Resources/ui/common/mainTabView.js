var globals = require('lib/globals');
exports.mainTabView = function() {
  var instance = Ti.UI.createTabGroup();
  
  var scheduleWindow = require('ui/common/scheduleWindow').scheduleWindow;
  var scheduleTab = Ti.UI.createTab({  
    icon: 'data/83-calendar.png',
    title: 'Schedule',
    window: new scheduleWindow()
  });
  
  var mapsWindow = require('ui/common/mapsWindow').mapsWindow;
  var mapsTab = Ti.UI.createTab({  
    icon: 'data/103-map.png',
    title: 'Maps',
    window: new mapsWindow()
  });
  
  var newsWindow = require('ui/common/newsWindow').newsWindow;
  var newsTab = Ti.UI.createTab({
    icon: 'data/23-bird.png',
    title: 'News',
    window: new newsWindow()
  });
  
  var speakersWindow = require('ui/common/speakersWindow').speakersWindow;
  var speakersTab = Ti.UI.createTab({
    icon: 'data/112-group.png',
    title: 'Speakers',
    window: new speakersWindow()
  });
  
  var liveWindow = require('ui/common/liveWindow').liveWindow;
  var liveTab = Ti.UI.createTab({
    icon: 'data/69-display.png',
    title: 'Live',
    window: new liveWindow()
  });
    
  instance.addTab(scheduleTab);
  instance.addTab(mapsTab);
  instance.addTab(newsTab);
  instance.addTab(speakersTab);
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
    instance.addTab(liveTab);
  }
  return instance;
}
