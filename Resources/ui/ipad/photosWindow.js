var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
var ScrollableGridView = require('ui/common/scrollableGridView').createScrollableGridView;
var photosTableView = '',
    tableData = [];
exports.photosWindow = function() {
  var instance = Ti.UI.createWindow({
    backgroundColor: '#eeeeee'
  });
  
  photosTableView = Ti.UI.createTableView({
    data: tableData,
    separatorColor: '#eeeeee',
    backgroundColor: '#eeeeee'
  });
  instance.add(photosTableView);
  
  return instance;
};

Ti.App.addEventListener('photos.getPhotoData', function() {
  getPhotoData();
});

function getPhotoData() {
  if (Ti.Network.online){
    var photos_xhr = new HTTPClientWithCache({
      baseUrl: 'http://www.lancasterbaptist.org/slc/app/1/',
      retryCount: 2,
      cacheSeconds: 10,
      onload: function(response) {
        // Create the imageview data array
        //Ti.API.info("Response Data: "+ response.responseText);
        //Ti.API.info("Is this cached data?: " + response.cached);
        var photos = JSON.parse(response.responseText);
        var idata = [];
        for (var c in photos.nodes[0].node.small_link) {
          var v = Ti.UI.createImageView({
            image: encodeURI(photos.nodes[0].node.small_link[c]),
            height: 100,
            width: 100
          });
          idata.push(v);
        }
        // create the scrollable grid view
        var scrollGrid = new ScrollableGridView({
          data: idata,
          cellWidth: 100,
          cellHeight: 100,
          xSpacer: 1,
          ySpacer: 1,
          xGrid: 3
        });
        
        var row = Ti.UI.createTableViewRow({
          height: '100%',
          width: '100%',
          selectedBackgroundColor: '#eeeeee'
        });
        row.add(scrollGrid);
        var tdata = [row];
        photosTableView.setData(tdata);
      }
    });
    photos_xhr.post({url: 'photos'});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the photos page.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
}
