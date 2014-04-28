var globals = require('lib/globals');
exports.staticPageWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.title,
    backgroundColor: '#eeeeee'
  });
  
  var webView = Ti.UI.createWebView({
    url: '/ui/static/' + opts.arg,
    scalesPageToFit: true
  });
  instance.add(webView);
  
  if (globals.osname === 'android') {
    instance.addEventListener('android:back', function(e) {
      webView = null;
      this.close();
    });
  }
  
  return instance;
};
