var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
var ScrollableGridView = require('ui/common/scrollableGridView').createScrollableGridView;
var newsTableView = '',
    navBar = '',
    tableData = [];

exports.newsWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Videos',
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  
  // iPhone Specific Code
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('news.updateTableViewData');
    });
    instance.rightNavButton = refresh;
  }
  // Android specific code
  if (globals.osname === 'android') {
    navBar = {index: 0};
    instance.activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      var menuItem = menu.add({title:"Refresh"});
      menuItem.addEventListener("click", function(f) {
        Ti.App.fireEvent('news.updateTableViewData');
      });
    };
  }
  
  newsTableView = Ti.UI.createTableView({
    data: tableData,
    separatorColor: '#eeeeee',
    backgroundColor: '#eeeeee'
  });
  newsTableView.addEventListener('click', function(x) {
    // TODO do something with the clicks
  });
  instance.add(newsTableView);
  
  // Load table data when window is focused
  instance.addEventListener('focus', function(x) {
    Ti.App.fireEvent('news.updateTableViewData');
  });
  
  return instance;
}

Ti.App.addEventListener('news.updateTableViewData', function(x) {
  getVideoData();
});

Ti.App.addEventListener('news.setTableViewData', function(x) {
  newsTableView.setData(x.data);
});

function getVideoData() {
  if (Ti.Network.online){
    var videos_xhr = new HTTPClientWithCache({
      baseUrl: 'http://www.lancasterbaptist.org/slc/app/1/',
      retryCount: 2,
      cacheSeconds: 300,
      onload: function(response) {
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        var videos = JSON.parse(response.responseText);
        var tdata = [], row, thumb, title;
        for (var c in videos.nodes) {
          row = Ti.UI.createTableViewRow({
            backgroundColor: '#eeeeee',
            layout: 'vertical'
          });
          thumb = Ti.UI.createImageView({
            image: videos.nodes[c].node.image,
            width: 280,
            height: 135,
            top: 10
          });
          row.add(thumb);
          title = Ti.UI.createLabel({
            text: videos.nodes[c].node.title,
            width: '280',
            height: 'auto'
          });
          row.add(title);
          
          row.vimeo = videos.nodes[c].node.vimeo;
          
          row.addEventListener('click', function(s) {
            if (s.row.vimeo != undefined) {
              Ti.Platform.openURL('http://vimeo.com/' + s.row.vimeo);
            }
          });
          
          tdata.push(row);
        }        
        
        if (newsTableView != undefined) {
          newsTableView.setData(tdata);
        }
      }
    });
    videos_xhr.post({url: 'videos'});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the videos page.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
}

exports.getNewsVideoData = function() {
  return getVideoData();
}
