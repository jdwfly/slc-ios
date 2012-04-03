var globals = require('lib/globals');
var tableView = Titanium.UI.createTableView();
var table = [];
var index = [];
function updateSpeakerData() {
  Ti.API.info(globals.speakerData());
  parseView = JSON.parse(globals.speakerData());
  var i=0;
  table = [];
  index = [];
  var curhead = '';
  var firstLetter = '';
  for (i in parseView.nodes) {
    firstLetter = parseView.nodes[i].node.lname.substr(0,1);
    if (curhead == firstLetter) {
      table.push({
        title:parseView.nodes[i].node.name,
        nid: parseView.nodes[i].node.nid,
        bio: parseView.nodes[i].node.bio,
        fname: parseView.nodes[i].node.fname,
        lname: parseView.nodes[i].node.lname,
        slcLocation: parseView.nodes[i].node.location,
        sessions: parseView.nodes[i].node.sessions,
        img: parseView.nodes[i].node.img,
        hasChild: true
      });
    } else {
      index.push({title:firstLetter, index:(table.length)});
      table.push({
        title:parseView.nodes[i].node.name,
        nid: parseView.nodes[i].node.nid,
        bio: parseView.nodes[i].node.bio,
        sessions: parseView.nodes[i].node.sessions,
        fname: parseView.nodes[i].node.fname,
        lname: parseView.nodes[i].node.lname,
        slcLocation: parseView.nodes[i].node.location,
        img: parseView.nodes[i].node.img,
        hasChild: true,
        header: firstLetter
      });
    }
    curhead = firstLetter;
  }
  tableView.setData(table, {animated: false});
  tableView.setIndex(index);
}

exports.speakersWindow = function() {
  var instance = Ti.UI.createWindow({
    title: 'Speakers',
    backgroundColor: '#fff'
  });
  instance.orientationModes = [Ti.UI.PORTRAIT];
  
  // Android Specific Code
  if (globals.osname === 'android') {
    instance.backgroundColor = "#111111";
    instance.activity.onCreateOptionsMenu = function(e) {
      var menu = e.menu;
      var menuItem = menu.add({title:"Refresh"});
      menuItem.addEventListener("click", function(e) {
        Ti.App.fireEvent('speakers.update', updateSpeakerData);
      });
    };
  }
  
  // iPhone Specific Code
  if (globals.osname === 'iphone') {
    var refresh = Ti.UI.createButton({
      systemButton:Ti.UI.iPhone.SystemButton.REFRESH
    });
    refresh.addEventListener('click', function(e) {
      Ti.App.fireEvent('speakers.update', updateSpeakerData);
    });
    instance.rightNavButton = refresh;
  }
  
  var search = Titanium.UI.createSearchBar();
  tableView.data = table;
  tableView.search = search;
  tableView.index = index;
  instance.add(tableView);
  
  instance.addEventListener('focus', function(f) {
    Ti.App.fireEvent('speakers.update');
  });
  instance.addEventListener('click', function(f) {
    Ti.App.fireEvent('speakers.click', {
      winClass: 'ui/common/speakerDetailWindow',
      title: f.rowData.title,
      nid: f.rowData.nid,
      bio: f.rowData.bio,
      sessions: f.rowData.sessions,
      fname: f.rowData.fname,
      lname: f.rowData.lname,
      slcLocation: f.rowData.slcLocation,
      img: f.rowData.img
    });
  });
  
  return instance;
}

Ti.App.addEventListener('speakers.updateTableView', function(f){
  updateSpeakerData();
});
