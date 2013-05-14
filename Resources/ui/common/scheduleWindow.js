var globals = require('lib/globals');
var scheduleTableView = '';

exports.scheduleWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Schedule',
    backgroundColor: '#eeeeee',
    barColor: '#3b587b'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  
  // Android Specific Code
  if (globals.osname === 'android') {
    instance.backgroundColor = "#111111";
    instance.activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      var menuItem = menu.add({title:"Refresh"});
      menuItem.addEventListener("click", function(e) {
        Ti.App.fireEvent('events.update');
      });
    };
  }
  
  // iPhone Specific Code
  if (globals.osname === 'iphone' || globals.osname === 'ipad') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('events.update', {prune: true});
    });
    instance.rightNavButton = refresh;
  }

  var scheduleData = getEventData();
  scheduleTableView = Ti.UI.createTableView({
    data:scheduleData,
    separatorColor: '#eeeeee',
    backgroundColor: '#eeeeee'
  });
  scheduleTableView.addEventListener('click', function(x) {
    Ti.API.info("x = "+x.row.hasChild);
    if (x.row.hasChild) {
      Ti.App.fireEvent('schedule.click', {nid: x.row.nid});
    }
  });
  instance.add(scheduleTableView);

  return instance;
}

Ti.App.addEventListener('schedule.updateTableView', function(x) {
  var scheduleData = getEventData();
  scheduleTableView.setData(scheduleData);
});

// Will return an array for use in a TableView
function getEventData() {
  var events = globals.dbGetEvents();
  var x;
  var data = [];
  var header = '';
  var currentDay = '';
  var currentSection = '';
  var row = '';
  var time, room, title, topView, bottomView, timeLabel, roomLabel, titleLabel;
  for (x in events) {
    //Ti.API.info(x);
    currentDay = events[x].day;
    time = globals.secondsToTime(events[x].datefrom) + "-" + 
           globals.secondsToTime(events[x].dateto);
    room = events[x].room;
    title = globals.html_decode(events[x].title);
    row = Ti.UI.createTableViewRow({
      height: 50,
      backgroundColor: '#eeeeee',
      layout: 'absolute'
    });
    if (events[x].eventtype == 'Workshop') {
      row.hasChild = true;
    }
    timeLabel = Ti.UI.createLabel({
      text: time,
      color: '#273a51',
      top: 5,
      left: 25,
      font: {fontWeight: 'bold'},
      height: 'auto',
      width: 'auto'
    });
    roomLabel = Ti.UI.createLabel({
      text: room,
      color: '#4d73a0',
      top: 5,
      width: 'auto',
      height: 'auto',
      right: 25,
      font: {fontWeight: 'bold'}
    });
    titleLabel = Ti.UI.createLabel({
      text: title,
      color: '#515151',
      top: 25,
      left: 25,
      width: "80%",
      height: 'auto',
      font: {fontFamily: 'Times New Roman', fontSize: 18}
    });
    row.add(Ti.UI.createView({
      top: 0,
      left: 25,
      height: 1,
      backgroundColor: '#e0e0e0',
      width: (row.hasChild) ? "90%" : "85%"
    }));
    row.add(timeLabel);
    row.add(roomLabel);
    row.add(titleLabel);
    if (title.length > 30) {
      row.setHeight(70);
    }
    row.nid = events[x].nid;
    
    if (header == currentDay) {
      currentSection.add(row);
    } else {
      if (currentSection != '') {
        data.push(currentSection);
      }
      var timestamp = globals.strtotime(currentDay) + 25212;
      var formattedDay = globals.date('l, F j', timestamp);
      var headerView = Ti.UI.createView({
        backgroundColor: '#eeeeee',
        height: 30,
        width: 'auto'
      });
      var headerLabel = Ti.UI.createLabel({
        text: formattedDay,
        color: '#44658e',
        font: {fontSize: 20, fontWeight: 'bold'},
        left: 25
      });
      headerView.add(headerLabel);
      var footerView = Ti.UI.createView({
        height: 16,
        backgroundColor: '#eeeeee'
      });
      if (globals.osname === "android") {
        currentSection = Ti.UI.createTableViewSection({
          headerTitle: formattedDay,
          footerView: footerView
        });
      } else {
        currentSection = Ti.UI.createTableViewSection({
          headerView: headerView,
          footerView: footerView
        });
      }
      currentSection.add(row);
    }
    header = currentDay;
  }
  // Push the last section into the data array
  data.push(currentSection);
  return data;
}

exports.getMainScheduleData = function() {
  return getEventData();
}
