var globals = require('lib/globals');

exports.photosDetailWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    backgroundColor: '#000000',
    barColor: '#3b587b',
    fullscreen: true
  });
  instance.orientationModes = [Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT];
  
  var image = Ti.UI.createImageView({
    image: "http://www.lancasterbaptist.org/slc/" + globals.html_decode(opts.image),
    height: Ti.UI.FILL,
    width: Ti.UI.FILL
  });
  
  var scroll = Ti.UI.createScrollView({
    maxZoomScale: 10,
    minZoomScale: 1.0,
    backgroundColor: 'transparent'
  });
  
  scroll.add(image)
  
  instance.add(scroll);
  
  return instance;
};
