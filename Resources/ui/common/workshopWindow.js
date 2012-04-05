var globals = require('lib/globals');
exports.workshopWindow = function(opts) {
  var instance = Ti.UI.createWindow({
    title: opts.workshop.fieldByName('title'),
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  
  return instance;
};
