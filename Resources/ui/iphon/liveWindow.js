var globals = require('lib/globals');
var tableView = Ti.UI.createTableView({
  height: (globals.osname === "ipad") ? 300 : 150,
  bottom: 0,
  backgroundColor: '#e9e9e9',
  separatorColor: '#e9e9e9'
});
var data = [];
exports.liveWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Live Stream',
    backgroundColor: '#e9e9e9',
    barColor: '#3b587b'
  });
  
  // iPhone Specific Code
  /* Not needed after conference.
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('live.update', {prune: true});
    });
    instance.rightNavButton = refresh;
  }
  */
  
  var liveImage = Ti.UI.createImageView({
    image: "/data/livestream.png",
    top: 5,
    width: 142,
    height: 142
  });
  instance.add(liveImage);
  var liveButton = Ti.UI.createButton({
    title: "Watch Live",
    font: {fontWeight: "bold"},
    width: 200,
    height: 40,
    top: 140,
    backgroundImage: "/data/watchlive.png",
    color: "#ffffff"
  });
  liveButton.addEventListener('click', function(f) {
    Ti.App.fireEvent('live.click');
  });
  instance.add(liveButton);
  
  var lsTitle = Ti.UI.createLabel({
    text: 'Upcoming Live Stream Events',
    color: "#313131",
    font: {fontFamily:"Georgia", fontSize: 16, fontWeight: 'bold'},
    width: 'auto',
    top: 185
  });
  instance.add(lsTitle);
  
  var lsServicesView = Ti.UI.createView({
    width: 'auto',
    top: 215,
    height: 'auto',
    layout: 'vertical'
  });
  var lsSunAM = Ti.UI.createLabel({
    text: 'Sunday Morning @ 11 am',
    font: {fontSize: '14', fontWeight: 'bold'},
    color: "#313131",
    height: 'auto',
    width: 'auto'
  });
  var lsSunPM = Ti.UI.createLabel({
    text: 'Sunday Evening @ 5:30 pm',
    font: {fontSize: '14', fontWeight: 'bold'},
    color: "#313131",
    height: 'auto',
    width: 'auto'
  });
  var lsWed = Ti.UI.createLabel({
    text: 'Wednesday Evening @ 7 pm',
    font: {fontSize: '14', fontWeight: 'bold'},
    color: "#313131",
    height: 'auto',
    width: 'auto'
  });
  lsServicesView.add(lsSunAM);
  lsServicesView.add(lsSunPM);
  lsServicesView.add(lsWed);
  instance.add(lsServicesView);
  /*
  tableView.setData(data, {animated: false});
  instance.add(tableView);
  
  instance.addEventListener('focus', function(f) {
    Ti.App.fireEvent('live.update');
  });
  */
  return instance;
};

function updateLiveData() {
  //Ti.API.info(globals.liveData());
  parseData = JSON.parse(globals.liveData());
  var i = 0;
  data = [];
  for (var i = 0, nodes; nodes = parseData.nodes[i]; i++) {
    node = nodes.node; // annoying but needed    
    var row = Ti.UI.createTableViewRow({
      height: 40, 
      selectionStyle: "none"
    });
    content = Ti.UI.createView({
      height: 'auto',
      width: 'auto',
      layout: 'vertical',
      bottom: 0,
      left: 10,
      right: 10
    });
    
    sessionFirst = Ti.UI.createLabel({
      text: globals.html_decode(node.title),
      font: {fontSize: '14', fontWeight: 'bold'},
      color: "#313131",
      height: 'auto',
      width: 'auto'
    });
    content.add(sessionFirst);
    
    sessionSecond = Ti.UI.createLabel({
      text: (node.day + " @ " + node.datefrom),
      font: {fontSize: '12'},
      color: "#313131",
      height: 'auto',
      width: 'auto'
    });
    content.add(sessionSecond);
    
    row.add(content);
    
    var paddingRow = Ti.UI.createTableViewRow({
      height: 10,
      selectionStyle: "none"
    });
        
    data.push(row);
    data.push(paddingRow);
  }
  //Ti.API.info(data);
  tableView.setData(data, {animated: false});
}

Ti.App.addEventListener('live.updateTableView', function(f) {
  updateLiveData();
});
