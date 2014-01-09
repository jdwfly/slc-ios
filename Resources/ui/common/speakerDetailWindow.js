var globals = require('lib/globals');

exports.speakerDetailWindow = function(opts) {
  instance = Ti.UI.createWindow({
    title: opts.title,
    backgroundColor: "#313131"
  });
  var sdata = [];
  var headerRow = Ti.UI.createTableViewRow({
    height: 120,
    borderWidth: 0,
    layout: "vertical",
    borderColor: "#313131",
    selectionStyle: "none"
  });
  // Create the speaker image
  var fname = opts.fname.toLowerCase();
  var lname = opts.lname.replace(" ", "-");
  lname = lname.toLowerCase();
  var imagePath = (opts.img) ? opts.img.replace(/\\/gi, ""): '';
  var speakerImage = Ti.UI.createImageView({
    image: imagePath,
    top:20,
    left:20,
    width:80,
    height:90,
    borderWidth: 5,
    borderColor: "#c6c6c6"
  });
  headerRow.add(speakerImage);
  // Add the name of the speaker
  var speakerTitle = Ti.UI.createLabel({
    text: opts.title,
    top: -65,
    left: 115,
    width: "auto",
    height: "auto",
    color: "#a1b1c4",
    font: {fontWeight: "bold", fontSize: 18, fontFamily: "Georgia"}
  });
  
  var speakerLocation = Ti.UI.createLabel({
    text: opts.slcLocation,
    top: 0,
    left: 115,
    width: "auto",
    height: "auto",
    color: "#a1b1c4",
    font: {fontSize: 14, fontFamily: "Georgia"}
  });
  headerRow.add(speakerTitle);
  headerRow.add(speakerLocation);
  sdata.push(headerRow);
  
  // Add a bio is the speaker has one
  var bio = opts.bio;
  if (bio != null) {
    var bioRow = Ti.UI.createTableViewRow({
      height: "auto",
      selectionStyle: "none"
    });
    var bioLabel = Ti.UI.createLabel({
      text: bio,
      top: 0,
      left: 20,
      right: 20,
      height: "auto",
      color: "#7f7f7f"
    });
    bioRow.add(bioLabel);
    sdata.push(bioRow);
  }
  
  // Now add the sessions if the speaker has any
  var sessions = globals.slcdbGetSessionsSpeaker(opts.title);
  //Ti.API.info("Total sessions for "+opts.title+": "+sessions.length);
  if (sessions.length > 0) {
    var sessionHeader = Ti.UI.createTableViewRow({selectionStyle: "none"});
    var sessionHeaderTitle = Ti.UI.createLabel({
      text: "Workshop Sessions",
      font: {fontSize:14, fontFamily: "Georgia", fontWeight: "bold"},
      color: "#a1b1c4",
      left: 20,
      right: 20
    });
    sessionHeader.add(sessionHeaderTitle);
    sdata.push(sessionHeader);
    for  (var i = 0, node; node = sessions[i]; i++) {
      Ti.API.info(node);
      var sessionRow = Ti.UI.createTableViewRow({
        height: "auto",
        layout: "vertical",
        selectionStyle: "none"
      });
      var sessionTitle = Ti.UI.createLabel({
        text: globals.html_decode(node.title),
        top: 0,
        left: 20,
        font: {fontSize:14},
        width: "auto",
        height: "auto",
        color: "#b0b0b0"
      });
      var dayofweek = globals.DayofWeek(node.day);
      var sessionTime = globals.secondsToTime(node.datefrom);
      var sessionRoom = (node.room != null) ? " | " + node.room : '';
      var sessionExtra = Ti.UI.createLabel({
        text: dayofweek + " | " + sessionTime + sessionRoom,
        width: "auto",
        height: "auto",
        font: {fontSize: 12},
        color: "#7c7c7c",
        top: 0,
        left: 20
      });
      
      sessionRow.add(sessionTitle);
      sessionRow.add(sessionExtra);
      
      if (node.notes != 'None') {
        notesImage = Ti.UI.createImageView({
          image: '/data/179-notepad.png',
          right: 15,
          top: -30
        });
        notesImage.addEventListener('click', function(g) {
          Ti.API.info(g);
          Ti.Platform.openURL(this.notes);
        });
        sessionRow.add(notesImage);
      }
      
      sdata.push(sessionRow);
      
      var paddingRow = Ti.UI.createTableViewRow({
        height: 10,
        selectionStyle: "none"
      });
      sdata.push(paddingRow);
    }
  }
  
  var speakerTable = Ti.UI.createTableView({
    data: sdata,
    backgroundColor: "#313131",
    separatorColor: "#313131"
  });
  instance.add(speakerTable);
  
  return instance;
};
