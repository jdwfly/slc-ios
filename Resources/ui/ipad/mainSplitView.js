var detailWin;
exports.mainSplitView = function() {
  var win = Ti.UI.createWindow({
    backgroundColor: '#eeeeee',
    barColor: '#405e84'
  });
  var data = [], scheduleRow, mapsRow, newsRow, photosRow, speakerRow, liveRow;
  scheduleRow = Ti.UI.createTableViewRow({
    title: 'Schedule',
    leftImage: '/data/11-clock.png',
    hasChild: true,
    onclick: 'scheduleWindow',
    requirejs: 'ui/common/scheduleWindow'
  });
  data.push(scheduleRow);
  mapsRow = Ti.UI.createTableViewRow({
    title: 'Maps',
    leftImage: '/data/103-map.png',
    hasChild: true,
    onclick: 'mapsWindow',
    requirejs: 'ui/common/mapsWindow'
  });
  data.push(mapsRow);
  newsRow = Ti.UI.createTableViewRow({
    title: 'News',
    leftImage: '/data/56-feed.png'
    /**
     This is going to have to be different than the phone version
    onclick: 'newsWindow',
    requirejs: 'ui/common/newsWindow'
    */
  });
  data.push(newsRow);
  photosRow = Ti.UI.createTableViewRow({
    title: 'Photos',
    leftImage: '/data/42-photos.png',
    onclick: 'photosWindow',
    requirejs: 'ui/ipad/photosWindow'
  });
  data.push(photosRow);
  speakerRow = Ti.UI.createTableViewRow({
    title: 'Speakers',
    leftImage: '/data/112-group.png',
    hasChild: true,
    onclick: 'speakersWindow',
    requirejs: 'ui/common/speakersWindow'
  });
  data.push(speakerRow);
  liveRow = Ti.UI.createTableViewRow({
    title: 'Live Stream',
    leftImage: '/data/69-display.png',
    onclick: 'liveWindow',
    requirejs: 'ui/iphon/liveWindow'
  });
  data.push(liveRow);
  var homeTableView = Ti.UI.createTableView({
    data: data,
    backgroundColor: '#eeeeee',
    separatorColor: '#eeeeee'
  });
  homeTableView.addEventListener('click', function(z) {
    if (z.rowData.requirejs) {
      var winClass = require(z.rowData.requirejs)[z.rowData.onclick];
      if (z.rowData.hasChild) {
        var scheduleWindow = new winClass();
        masterWin.open(scheduleWindow);
      } else {
        Ti.App.fireEvent('detailView.change', {
          requirejs: z.rowData.requirejs,
          classname: z.rowData.onclick
        });
      }
    }
  });
  win.add(homeTableView);
  
  var masterWin = Ti.UI.iPhone.createNavigationGroup({
    backgroundColor:'#fff',
    window: win
  });
  // Window shown in wider, right "pane"
  detailWin = Ti.UI.createWindow({
    backgroundColor:'#dfdfdf',
    barColor: '#3b587b'
  });
  var detailNavWin = Ti.UI.iPhone.createNavigationGroup({
    window: detailWin
  });

  // the split window
  var splitwin = Ti.UI.iPad.createSplitWindow({
      detailView:detailNavWin,
      masterView:masterWin,
      orientationModes:[ Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT, Ti.UI.PORTRAIT ],
      barColor: '#3b587b'
  });
  splitwin.addEventListener('visible', function(x) {
    if (x.view == 'detail') {
      x.button.title = "Menu";
      detailWin.leftNavButton = x.button;
    } else if (x.view == 'master') {
      detailWin.leftNavButton = null;
    }
  });
  
  return splitwin;
};

Ti.App.addEventListener('detailView.change', function(args) {
  var viewClass = require(args.requirejs)[args.classname];
  var detailViewContents = new viewClass(args.args);
  var detailView = Ti.UI.createView({
    top: 0,
    left: 0,
    height: '100%'
  });
  detailView.add(detailViewContents);
  detailWin.animate({view: detailView, transition: Ti.UI.iPhone.AnimationStyle.CURL_UP}, function() {
    if (args.classname == 'photosWindow') {
      Ti.App.fireEvent('photos.getPhotoData');
      detailWin.setTitle('Photos');
    }
  });
});
