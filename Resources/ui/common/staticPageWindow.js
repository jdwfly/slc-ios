exports.staticPageWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.title,
    backgroundColor: '#ffffff'
  });
  
  var webView = Ti.UI.createWebView({
    url: 'ui/static/' + opts.arg,
    scalesPageToFit: true
  });
  instance.add(webView);
  
  return instance;
};
