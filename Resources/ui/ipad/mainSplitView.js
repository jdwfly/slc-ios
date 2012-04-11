exports.mainSplitView = function() {
  var win = Ti.UI.createWindow({
    title: 'Home',
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  var data = [], scheduleRow, mapsRow, newsRow, speakerRow, liveRow;
  scheduleRow = Ti.UI.createTableViewRow({
    title: 'Schedule',
    leftImage: '/data/11-clock.png',
    onclick: 'scheduleWindow',
    requirejs: 'ui/common/scheduleWindow'
  });
  data.push(scheduleRow);
  mapsRow = Ti.UI.createTableViewRow({
    title: 'Maps',
    leftImage: '/data/103-map.png',
    onclick: 'mapsWindow',
    requirejs: 'ui/common/mapsWindow'
  });
  data.push(mapsRow);
  
  var homeTableView = Ti.UI.createTableView({
    data: data,
    backgroundColor: '#eeeeee',
    separatorColor: '#eeeeee'
  });
  homeTableView.addEventListener('click', function(z) {
    alert(z.rowData.requirejs);
    var winClass = require(z.rowData.requirejs)[z.rowData.onclick];
    var scheduleWindow = new winClass();
    masterWin.open(scheduleWindow);
  });
  win.add(homeTableView);
  
  var masterWin = Ti.UI.iPhone.createNavigationGroup({
    backgroundColor:'#fff',
    window: win
  });
  // Window shown in wider, right "pane"
  var detailWin = Ti.UI.createWindow({
    backgroundColor:'#dfdfdf',
    title: 'Detail View',
    barColor: '#3b587b'
  });
  // the split window
  var splitwin = Ti.UI.iPad.createSplitWindow({
      detailView:detailWin,
      masterView:masterWin,
      orientationModes:[ Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT ],
      barColor: '#3b587b'
  });
  splitwin.addEventListener('visible', function(x) {
    if (x.view == 'detail') {
      
    } else if (x.view == 'master') {
      detailWin.leftNavButton = null;
    }
  });
  
  
  return splitwin;
};
