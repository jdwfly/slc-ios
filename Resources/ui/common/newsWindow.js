var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
var ScrollableGridView = require('ui/common/scrollableGridView').createScrollableGridView;
var newsTableView = '',
    navBar = '',
    tableData = [];

exports.newsWindow = function() {
  var instance = Ti.UI.createWindow({
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
    
    // create button bar toolbar
    // will need to make this compat for android
    navBar = Ti.UI.iOS.createTabbedBar({
      labels: ['News', 'Photos', 'Videos'],
      index: 0,
      backgroundColor: '#3b587b',
      style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
      height: 30
    });
    navBar.addEventListener('click', function(x) {
      Ti.App.fireEvent('news.updateTableViewData');
    });
    instance.titleControl = navBar;
  }
  
  if (globals.osname === 'android') {
    navBar = {index: 0};
    instance.activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      var menuItem = menu.add({title:"Refresh"});
      menuItem.addEventListener("click", function(f) {
        Ti.App.fireEvent('news.updateTableViewData');
      });
      var menuNews = menu.add({title: "News"});
      menuNews.addEventListener('click', function(f) {
        navBar = {index:0};
        Ti.App.fireEvent('news.updateTableViewData');
      });
      var menuPhotos = menu.add({title: 'Photos'});
      menuPhotos.addEventListener('click', function(f) {
        navBar = {index:1};
        Ti.App.fireEvent('news.updateTableViewData');
      });
      var menuVideos = menu.add({title: 'Videos'});
      menuVideos.addEventListener('click', function(f) {
        navBar = {index:2};
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
  if (navBar.index == 0) {
    getTweetData();
  }
  if (navBar.index == 1) {
    getPhotoData();
  }
  if (navBar.index == 2) {
    getVideoData();
  }
});

Ti.App.addEventListener('news.setTableViewData', function(x) {
  Ti.API.info(x.data);
  newsTableView.setData(x.data);
});

function getTweetData() {
  if (Ti.Network.online) {
    var news_xhr = new HTTPClientWithCache({
      baseUrl: 'https://search.twitter.com/',
      retryCount: 2,
      cacheSeconds: 10,
      onload: function(response) {
        Ti.API.info("Response Data: "+ response.responseText);
        Ti.API.info("Is this cached data?: " + response.cached);
        var tweets = JSON.parse(response.responseText);
        var data = [];
        for (var c=0; c<tweets.results.length; c++) {
          var tweet = tweets.results[c].text;
          var user = tweets.results[c].from_user;
          var avatar = tweets.results[c].profile_image_url;
          var created_at = globals.prettyDate(globals.strtotime(tweets.results[c].created_at));
          var bgcolor = (c % 2) == 0 ? '#fff' : '#eee';
          
          var row = Ti.UI.createTableViewRow({hasChild:false,height:'auto',backgroundColor:bgcolor});

          // Create a vertical layout view to hold all the info labels and images for each tweet
          var post_view = Ti.UI.createView({
            height: Ti.UI.SIZE,
            layout:'vertical',
            left:5,
            top:5,
            bottom:5,
            right:5
          });
    
          var av = Ti.UI.createImageView({
              image:avatar,
              left:0,
              top:0,
              height:48,
              width:48
            });
          // Add the avatar image to the view
          post_view.add(av);
    
          var user_label = Ti.UI.createLabel({
            text:user,
            left:54,
            width:120,
            top:-48,
            bottom:2,
            height:16,
            textAlign:'left',
            color:'#444444',
            font:{fontFamily:'Trebuchet MS',fontSize:14,fontWeight:'bold'}
          });
          // Add the username to the view
          post_view.add(user_label);
    
          var date_label = Ti.UI.createLabel({
            text:created_at,
            right:0,
            top:-18,
            bottom:2,
            height:14,
            textAlign:'right',
            width:110,
            color:'#444444',
            font:{fontFamily:'Trebuchet MS',fontSize:12}
          });
          // Add the date to the view
          post_view.add(date_label);
    
          var tweet_text = Ti.UI.createLabel({
            text: globals.html_decode(tweet),
            left:54,
            top:0,
            bottom:2,
            height:'auto',
            width: 'auto',
            textAlign:'left',
            font:{fontSize:14}
          });
          // Add the tweet to the view
          post_view.add(tweet_text);
          // Add the vertical layout view to the row
          row.add(post_view);
          row.className = 'item'+c;
          data.push(row);
        }
        newsTableView.setData(data);
      }
    });
    news_xhr.post({url: 'search.json?q=' + encodeURIComponent('#rootedconf OR from:slconference OR @slconference -rootedministry')});
  } else {
    // Maybe this should fail silently with just a log message
    var dialog = Ti.UI.createAlertDialog({
      message: 'You must be online to refresh the news page.',
      ok: 'Okay',
      title: 'Oh noes!'
    }).show();
  }
}

function getPhotoData() {
  if (Ti.Network.online){
    var photos_xhr = new HTTPClientWithCache({
      baseUrl: 'http://www.lancasterbaptist.org/slc/app/1/',
      retryCount: 2,
      cacheSeconds: 10,
      onload: function(response) {
        // Create the imageview data array
        Ti.API.info("Response Data: "+ response.responseText);
        Ti.API.info("Is this cached data?: " + response.cached);
        var photos = JSON.parse(response.responseText);
        var idata = [];
        for (var c in photos.nodes[0].node.small_link) {
          var v = Ti.UI.createImageView({
            image: encodeURI(photos.nodes[0].node.small_link[c]),
            height: 100,
            width: 100,
            clickImage: encodeURI(photos.nodes[0].node.pictures[c])
          });
          v.addEventListener('click', function(e) {
            Ti.App.fireEvent('photos.click', {image: this.clickImage});
          });
          idata.push(v);
        }
        Ti.API.info(idata);
        // create the scrollable grid view
        var scrollGrid = new ScrollableGridView({
          data: idata,
          cellWidth: 100,
          cellHeight: 100,
          xSpacer: 1,
          ySpacer: 1,
          xGrid: (globals.osname == 'ipad') ? 5 : 3
        });
        
        var row = Ti.UI.createTableViewRow({
          height: '100%',
          width: '100%',
          selectedBackgroundColor: '#eeeeee'
        });
        row.add(scrollGrid);
        var tdata = [row];
        
        if (newsTableView != undefined) {
          newsTableView.setData(tdata);
        }
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

function getVideoData() {
  if (Ti.Network.online){
    var videos_xhr = new HTTPClientWithCache({
      baseUrl: 'http://www.lancasterbaptist.org/slc/app/1/',
      retryCount: 2,
      cacheSeconds: 10,
      onload: function(response) {
        Ti.API.info("Response Data: "+ response.responseText);
        Ti.API.info("Is this cached data?: " + response.cached);
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
            Ti.API.info("Vimeo = "+s.row.vimeo);
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

exports.getNewsTweetData = function() {
  return getTweetData();
}

exports.getNewsPhotoData = function() {
  return getPhotoData();
}

exports.getNewsVideoData = function() {
  return getVideoData();
}
