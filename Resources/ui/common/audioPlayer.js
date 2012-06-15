var g = require('lib/globals');

exports.window = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.node.title
  });
  
  
  return instance;
};
