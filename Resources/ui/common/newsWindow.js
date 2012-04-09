var globals = require('lib/globals');
var HTTPClientWithCache = require('lib/HTTPClientWithCache').HTTPClientWithCache;
var newsTableView = '',
    navBar = '',
    tableData = [];

exports.newsWindow = function() {
  var instance = Ti.UI.createWindow({
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  
  // iPhone Specific Code
  if (globals.osname === 'iphone') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('news.updateTableViewData');
    });
    instance.rightNavButton = refresh;
  }
  
  // create button bar toolbar
  // will need to make this compat for android
  navBar = Ti.UI.iOS.createTabbedBar({
    labels: ['News', 'Photos', 'Videos'],
    index: 0,
    backgroundColor: '#3b587b',
    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
    height: 30
  })
  navBar.addEventListener('click', function(x) {
    Ti.App.fireEvent('news.updateTableViewData');
  });
  instance.titleControl = navBar;
  
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
            height:'auto',
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
            text:tweet,
            left:54,
            top:0,
            bottom:2,
            height:'auto',
            width:236,
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
  var data = [{title: 'first'}, {title: 'second'}];
  newsTableView.setData(data);
}

function getVideoData() {
  
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
