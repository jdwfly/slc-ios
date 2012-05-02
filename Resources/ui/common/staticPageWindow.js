exports.staticPageWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.title,
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  
  var webView = Ti.UI.createWebView({
    url: '/ui/static/' + opts.arg,
    scalesPageToFit: true
  });
  instance.add(webView);
  
  return instance;
};
