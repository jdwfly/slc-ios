var globals = require('lib/globals');
exports.workshopWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.title,
    backgroundColor: '#fff'
  });
  
  return instance;
};
