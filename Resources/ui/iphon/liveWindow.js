var globals = require('lib/globals');
exports.liveWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Live Stream',
    backgroundColor: '#313131',
    barColor: '#3b587b'
  });
  
  // Android Specific Code
  if (globals.osname === 'android') {
    instance.activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      var menuItem = menu.add({title:"Refresh"});
      menuItem.addEventListener("click", function(e) {
        Ti.App.fireEvent('livestream.update');
      });
    };
  }
  
  // iPhone Specific Code
  if (globals.osname === 'iphone') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('livestream.update');
    });
    instance.rightNavButton = refresh;
  }
  
  var liveImage = Ti.UI.createImageView({
    image: "/data/livestream.jpg",
    top: 20,
    width: 142,
    height: 104
  });
  instance.add(liveImage);
  var liveButton = Ti.UI.createButton({
    title: "Watch Live",
    font: {fontWeight: "bold"},
    width: 200,
    height: 40,
    top: 140,
    backgroundImage: "data/watchlive.jpg"  
  });
  liveButton.addEventListener('click', function(f) {
    Ti.App.fireEvent('live.click');
  });
  instance.add(liveButton);
  
  return instance;
}
