var _osname = Ti.Platform.osname;
var _debug = false;
var _baseUrl = "http://www.lancasterbaptist.org/slc/json";
var _eventsUrl = "/events";
var _speakersUrl = "/speakers";
var _livestreamUrl = "/livestream";
var _slcDB = Ti.Database.open('slcdb');
var _speakerData = "";

exports.osname = _osname;
exports.baseUrl = _baseUrl;
exports.eventsUrl = _eventsUrl;
exports.speakersUrl = _speakersUrl;
exports.livestreamUrl = _livestreamUrl;

// Sets whether we are in debug or not
// value = Boolean
exports.setDebug = function(value) {
  if (value) {
    _debug = true;
    return _debug;
  }
  _debug = false;
  return _debug;
}

exports.debug = function() {
  return _debug;
}

exports.setSpeakerData = function(value) {
  if (value) {
    _speakerData = value;
    return _speakerData;
  }
  return false;
}

exports.speakerData = function() {
  return _speakerData;
}

exports.slcdbSaveEvents = function(events) {
  _slcDB.execute('DROP TABLE IF EXISTS events');
  _slcDB.execute('CREATE TABLE IF NOT EXISTS events (nid INTEGER, title TEXT, eventtype TEXT, day TEXT, datefrom TEXT, dateto TEXT, speaker TEXT, room TEXT, track TEXT, weight TEXT)');
  // Remove all data first
  _slcDB.execute('DELETE FROM events');
  
  var parseEvents = JSON.parse(events), i = 0;
  for (i in parseEvents.nodes) {
    _slcDB.execute('INSERT INTO events (nid, title, eventtype, day, datefrom, dateto, speaker, room, track, weight) VALUES(?,?,?,?,?,?,?,?,?,?)', 
      parseEvents.nodes[i].node.nid,
      parseEvents.nodes[i].node.title,
      parseEvents.nodes[i].node.type,
      parseEvents.nodes[i].node.day,
      parseEvents.nodes[i].node.from,
      parseEvents.nodes[i].node.to,
      parseEvents.nodes[i].node.speaker,
      parseEvents.nodes[i].node.room,
      parseEvents.nodes[i].node.track,
      parseEvents.nodes[i].node.weight
    );
  }
  Ti.API.info('DB:LAST ROW INSERTED, lastInsertRowId = ' + _slcDB.lastInsertRowId);
}

exports.slcdbGetEvents = function(dateString) {
  var result = _slcDB.execute('SELECT * FROM events WHERE eventtype<>"Session" AND day="'+dateString+'" ORDER BY datefrom ASC');
  Ti.API.info('ROWS FETCHED = ' + result.getRowCount());
  return result;
}

/**
 * This will sessions from a certain time and day.
 *  dateFrom = time value in seconds
 *  day      = date string formatted like 2011-07-11
 * Returns a result set of session events only.
 */
exports.slcdbGetSessions = function(dateFrom, day) {
  var result = _slcDB.execute('SELECT DISTINCT * FROM events WHERE eventtype="Session" AND datefrom="'+dateFrom+'" AND day="'+day+'" ORDER BY weight ASC');
  Ti.API.info('ROWS FETCHED = ' + result.getRowCount());
  return result;
}

/**
 * This will get sessions by speaker
 * snid = Speaker Node ID
 */
exports.slcdbGetSessionsSpeaker = function(snid) {
  var result = _slcDB.execute('SELECT * FROM events WHERE eventtype="Session" AND speaker="'+snid+'"');
  Ti.API.info('ROWS FETCHED = ' + result.getRowCount());
  return result;
}

// Helper function that converts seconds into a readable time string
exports.secondsToTime = function(seconds) {
  var hours = parseInt(seconds / 3600);
  var minutes = (seconds % 3600) / 60;
  var meridiem = '';
  
  if (hours > 12) {
    hours = hours - 12;
    meridiem = 'pm';
  } else if (hours == 12) {
    meridiem = 'pm';
  } else if (hours == 24) {
    hours = 12;
    meridiem = 'am';
  } else if (hours == 0) {
    hours = 12;
    meridiem = 'am';
  } else {
    meridiem = 'am';
  }
  
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  
  time = hours + ':' + minutes + ' ' + meridiem;
  
  return time;
}

// Helper function to replace certain encoded characters
exports.html_decode = function(string) {
  string = string.replace(/&#039;/gi, "'");
  string = string.replace(/&amp;/gi, "&");
  return string;
}

// Helper function to give the textual representation of the day of the week
// BOO on you javascript for only giving me a number
// daynum = a date string formatted 2011-07-11
exports.DayofWeek = function(daynum) {
  if (daynum == null) {
    return;
  }
  var d = new Date();
  var e = daynum.split("-");
  d.setFullYear(parseInt(e[0]), (parseInt(e[1])-1), parseInt(e[2]));
  switch (d.getDay()) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}
