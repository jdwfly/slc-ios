var globals = require('lib/globals');
exports.mapsWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Maps',
    backgroundColor: '#fff'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  if (globals.osname === 'android') {
    win.backgroundColor = '#111111';
  }
  
  var data = [
    {title: "Auditorium Seating", hasChild:true, winClass:'../pages/staticpage.js', arg: 'seating.html'},
    {title: "Campus", hasChild:true, winClass:'../pages/staticpage.js', arg: 'campus.html'},
    {title: "Revels Floor 1", hasChild:true, winClass:'../pages/staticpage.js', arg: 'revels1.html'},
    {title: "Revels Floor 2", hasChild:true, winClass:'../pages/staticpage.js', arg: 'revels2.html'},
    {title: "Revels Floor 3", hasChild:true, winClass:'../pages/staticpage.js', arg: 'revels3.html'},
    {title: "Nursery 0-35 months", hasChild:true, winClass:'../pages/staticpage.js', arg: 'nursery.html'}
  ];
  
  var tableView = Ti.UI.createTableView({data:data, backgroundColor: 'transparent'});
  
  tableView.addEventListener('click', function(f) {
    Ti.App.fireEvent('map.click', {
      url: f.rowData.arg,
      title: f.rowData.title,
      callback: false
    });
  });
  instance.add(tableView);
  
  return instance;
}