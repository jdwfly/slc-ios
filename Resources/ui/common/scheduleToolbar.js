exports.scheduleToolbar = function(properties) {
  if (typeof properties === 'undefined') {
    var properties = {};
  }
  platform = Ti.Platform.osname;
  if (platform === 'iphone' || platform === 'ipad') {
    var buttons = Ti.UI.iOS.createTabbedBar({
      labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      index: 0,
      backgroundColor: '#707070',
      backgroundImage: 'none'
    });
    flexSpace = Ti.UI.createButton({
      systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    properties.items = [flexSpace, buttons, flexSpace];
    var instance = Ti.UI.iOS.createToolbar(properties);
  } else {
    
  }
  return instance;
};
