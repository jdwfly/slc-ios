var _osname = Ti.Platform.osname;
var _debug = false;
var _baseUrl = "http://slconference.com/slc/json";
var _eventsUrl = "/events";
var _speakersUrl = "/speakers";
var _liveUrl = "/liveevents";
var _slcDB = Ti.Database.open('slcdb');
_slcDB.execute('CREATE TABLE IF NOT EXISTS events (nid INTEGER, title TEXT, eventtype TEXT, day TEXT, datefrom TEXT, dateto TEXT, speaker TEXT, room TEXT, track TEXT, weight TEXT, download TEXT, notes TEXT)');
_slcDB.close();
var _speakerData = "";
var _liveData = "";
var _nowPlaying = "";

exports.osname = _osname;
exports.baseUrl = _baseUrl;
exports.eventsUrl = _eventsUrl;
exports.speakersUrl = _speakersUrl;
exports.liveUrl = _liveUrl;

// Sets whether we are in debug or not
// value = Boolean
exports.setDebug = function(value) {
  if (value) {
    _debug = true;
    return _debug;
  }
  _debug = false;
  return _debug;
};

exports.debug = function() {
  return _debug;
};

exports.setSpeakerData = function(value) {
  if (value) {
    _speakerData = value;
    return _speakerData;
  }
  return false;
};

exports.speakerData = function() {
  return _speakerData;
};

exports.setLiveData = function(value) {
  if (value) {
    _liveData = value;
    return _liveData;
  }
  return false;
};
exports.liveData = function() {
  return _liveData;
};

exports.nowPlaying = function() {
  return _nowPlaying;
};
exports.setNowPlaying = function(value) {
  if (value) {
    _nowPlaying = value;
    return _nowPlaying;
  }
  return false;
};

exports.slcdbSaveEvents = function(events) {
  _slcDB = Ti.Database.open('slcdb');
  _slcDB.execute('DROP TABLE IF EXISTS events');
  _slcDB.execute('CREATE TABLE IF NOT EXISTS events (nid INTEGER, title TEXT, eventtype TEXT, day TEXT, datefrom TEXT, dateto TEXT, speaker TEXT, room TEXT, track TEXT, weight TEXT, download TEXT, notes TEXT)');
  // Remove all data first
  _slcDB.execute('DELETE FROM events');
  
  var parseEvents = JSON.parse(events), i = 0;
  for (i in parseEvents.nodes) {
    _slcDB.execute('INSERT INTO events (nid, title, eventtype, day, datefrom, dateto, speaker, room, track, weight, download, notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', 
      parseEvents.nodes[i].node.nid,
      parseEvents.nodes[i].node.title,
      parseEvents.nodes[i].node.type,
      parseEvents.nodes[i].node.day,
      parseEvents.nodes[i].node.from,
      parseEvents.nodes[i].node.to,
      parseEvents.nodes[i].node.speaker,
      parseEvents.nodes[i].node.room,
      parseEvents.nodes[i].node.track,
      parseEvents.nodes[i].node.weight,
      parseEvents.nodes[i].node.download,
      parseEvents.nodes[i].node.notes
    );
  }
  Ti.API.info('DB:LAST ROW INSERTED, lastInsertRowId = ' + _slcDB.lastInsertRowId);
  Ti.App.fireEvent('sessions.updateTableView');
  _slcDB.close();
};

exports.slcdbGetEvents = function(dateString) {
  var results = [];
  _slcDB = Ti.Database.open('slcdb');
  var resultSet = _slcDB.execute('SELECT * FROM events WHERE eventtype<>"Session" AND day="'+dateString+'" ORDER BY datefrom ASC');
  //Ti.API.info('slcdbGetEvents ROWS FETCHED = ' + resultSet.getRowCount());
  while (resultSet.isValidRow()) {
    results.push({
      nid: resultSet.fieldByName('nid'),
      title: resultSet.fieldByName('title'),
      eventtype: resultSet.fieldByName('eventtype'),
      day: resultSet.fieldByName('day'),
      datefrom: resultSet.fieldByName('datefrom'),
      dateto: resultSet.fieldByName('dateto'),
      speaker: resultSet.fieldByName('speaker'),
      room: resultSet.fieldByName('room'),
      track: resultSet.fieldByName('track'),
      weight: resultSet.fieldByName('weight'),
      download: resultSet.fieldByName('download'),
      notes: resultSet.fieldByName('notes')
    });
    resultSet.next();
  }
  _slcDB.close();
  return results;
};

exports.dbGetEvents = function() {
  var results = [];
  _slcDB = Ti.Database.open('slcdb');
  var resultSet = _slcDB.execute('SELECT * FROM events WHERE eventtype<>"Session" ORDER BY day ASC, datefrom ASC');
  //Ti.API.info('dbGetEvents ROWS FETCHED = ' + resultSet.getRowCount());
  while (resultSet.isValidRow()) {
    results.push({
      nid: resultSet.fieldByName('nid'),
      title: resultSet.fieldByName('title'),
      eventtype: resultSet.fieldByName('eventtype'),
      day: resultSet.fieldByName('day'),
      datefrom: resultSet.fieldByName('datefrom'),
      dateto: resultSet.fieldByName('dateto'),
      speaker: resultSet.fieldByName('speaker'),
      room: resultSet.fieldByName('room'),
      track: resultSet.fieldByName('track'),
      weight: resultSet.fieldByName('weight'),
      download: resultSet.fieldByName('download'),
      notes: resultSet.fieldByName('notes')
    });
    resultSet.next();
  }
  _slcDB.close();
  return results;
};

// nid = Node ID of event requesting
// returns node data of certain node ID
exports.dbGetSingleEvent = function(nid) {
  var results = [];
  _slcDB = Ti.Database.open('slcdb');
  var resultSet = _slcDB.execute('SELECT * FROM events WHERE nid='+nid);
  //Ti.API.info('ROWS FETCHED = ' + resultSet.getRowCount());
  while (resultSet.isValidRow()) {
    results.push({
      nid: resultSet.fieldByName('nid'),
      title: resultSet.fieldByName('title'),
      eventtype: resultSet.fieldByName('eventtype'),
      day: resultSet.fieldByName('day'),
      datefrom: resultSet.fieldByName('datefrom'),
      dateto: resultSet.fieldByName('dateto'),
      speaker: resultSet.fieldByName('speaker'),
      room: resultSet.fieldByName('room'),
      track: resultSet.fieldByName('track'),
      weight: resultSet.fieldByName('weight'),
      download: resultSet.fieldByName('download'),
      notes: resultSet.fieldByName('notes')
    });
    resultSet.next();
  }
  _slcDB.close();
  return results;
};

// nid = Node of Parent Workshop
// returns result array of children sessions during parent workshop time
exports.dbGetWorkshopEvents = function(nid) {
  var results = [];
  _slcDB = Ti.Database.open('slcdb');
  var parentNode = _slcDB.execute('SELECT * FROM events WHERE nid='+nid);
  var resultSet = _slcDB.execute('SELECT * FROM events WHERE eventtype="Session" AND day="'+parentNode.fieldByName('day')+'" AND datefrom='+parentNode.fieldByName('datefrom')+' ORDER BY weight ASC');
  //Ti.API.info('ROWS FETCHED = ' + resultSet.getRowCount());
  while (resultSet.isValidRow()) {
    results.push({
      nid: resultSet.fieldByName('nid'),
      title: resultSet.fieldByName('title'),
      eventtype: resultSet.fieldByName('eventtype'),
      day: resultSet.fieldByName('day'),
      datefrom: resultSet.fieldByName('datefrom'),
      dateto: resultSet.fieldByName('dateto'),
      speaker: resultSet.fieldByName('speaker'),
      room: resultSet.fieldByName('room'),
      track: resultSet.fieldByName('track'),
      weight: resultSet.fieldByName('weight'),
      download: resultSet.fieldByName('download'),
      notes: resultSet.fieldByName('notes')
    });
    resultSet.next();
  }
  _slcDB.close();
  return results;
};

/**
 * This will sessions from a certain time and day.
 *  dateFrom = time value in seconds
 *  day      = date string formatted like 2011-07-11
 * Returns a result set of session events only.
 */
exports.slcdbGetSessions = function(dateFrom, day) {
  var results = [];
  _slcDB = Ti.Database.open('slcdb');
  if (dateFrom == undefined && day == undefined) {
    var resultSet = _slcDB.execute('SELECT DISTINCT * FROM events WHERE eventtype="Session" ORDER BY weight ASC');
  } else {
    var resultSet = _slcDB.execute('SELECT DISTINCT * FROM events WHERE eventtype="Session" AND datefrom="'+dateFrom+'" AND day="'+day+'" ORDER BY weight ASC');
  }
  
  //Ti.API.info('slcdbGetSessions ROWS FETCHED = ' + resultSet.getRowCount());
  while (resultSet.isValidRow()) {
    results.push({
      nid: resultSet.fieldByName('nid'),
      title: resultSet.fieldByName('title'),
      eventtype: resultSet.fieldByName('eventtype'),
      day: resultSet.fieldByName('day'),
      datefrom: resultSet.fieldByName('datefrom'),
      dateto: resultSet.fieldByName('dateto'),
      speaker: resultSet.fieldByName('speaker'),
      room: resultSet.fieldByName('room'),
      track: resultSet.fieldByName('track'),
      weight: resultSet.fieldByName('weight'),
      download: resultSet.fieldByName('download'),
      notes: resultSet.fieldByName('notes')
    });
    resultSet.next();
  }
  _slcDB.close();
  return results;
};

/**
 * This will get sessions by speaker
 * snid = Speaker Node ID
 */
exports.slcdbGetSessionsSpeaker = function(snid) {
  var results = [];
  _slcDB = Ti.Database.open('slcdb');
  var resultSet = _slcDB.execute('SELECT * FROM events WHERE eventtype="Session" AND speaker="'+snid+'" ORDER BY day ASC, datefrom ASC');
  //Ti.API.info('ROWS FETCHED = ' + resultSet.getRowCount());
  while (resultSet.isValidRow()) {
    results.push({
      nid: resultSet.fieldByName('nid'),
      title: resultSet.fieldByName('title'),
      eventtype: resultSet.fieldByName('eventtype'),
      day: resultSet.fieldByName('day'),
      datefrom: resultSet.fieldByName('datefrom'),
      dateto: resultSet.fieldByName('dateto'),
      speaker: resultSet.fieldByName('speaker'),
      room: resultSet.fieldByName('room'),
      track: resultSet.fieldByName('track'),
      weight: resultSet.fieldByName('weight'),
      download: resultSet.fieldByName('download'),
      notes: resultSet.fieldByName('notes')
    });
    resultSet.next();
  }
  _slcDB.close();
  return results;
};

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
};

// Helper function to replace certain encoded characters
exports.html_decode = function(string) {
  if (string == undefined) {
    return;
  }
  string = string.replace(/&#039;/gi, "'");
  string = string.replace(/&amp;/gi, "&");
  return string;
};

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
};

// PHPjs strtotime function
exports.strtotime = function(str, now) {
    // http://kevin.vanzonneveld.net
    // +   original by: Caio Ariede (http://caioariede.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: David
    // +   improved by: Caio Ariede (http://caioariede.com)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Wagner B. Soares
    // +   bugfixed by: Artur Tchernychev
    // %        note 1: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    // *     example 1: strtotime('+1 day', 1129633200);
    // *     returns 1: 1129719600
    // *     example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    // *     returns 2: 1130425202
    // *     example 3: strtotime('last month', 1129633200);
    // *     returns 3: 1127041200
    // *     example 4: strtotime('2009-05-04 08:30:00');
    // *     returns 4: 1241418600
    var i, l, match, s, parse = '';

    str = str.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
    str = str.replace(/[\t\r\n]/g, ''); // unecessary chars
    if (str === 'now') {
        return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
    } else if (!isNaN(parse = Date.parse(str))) {
        return parse / 1000 | 0;
    } else if (now) {
        now = new Date(now * 1000); // Accept PHP-style seconds
    } else {
        now = new Date();
    }

    str = str.toLowerCase();

    var __is = {
        day: {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        },
        mon: [
            'jan',
            'feb',
            'mar',
            'apr',
            'may',
            'jun',
            'jul',
            'aug',
            'sep',
            'oct',
            'nov',
            'dec'
        ]
    };

    var process = function (m) {
        var ago = (m[2] && m[2] === 'ago');
        var num = (num = m[0] === 'last' ? -1 : 1) * (ago ? -1 : 1);
        
        switch (m[0]) {
        case 'last':
        case 'next':
            switch (m[1].substring(0, 3)) {
            case 'yea':
                now.setFullYear(now.getFullYear() + num);
                break;
            case 'wee':
                now.setDate(now.getDate() + (num * 7));
                break;
            case 'day':
                now.setDate(now.getDate() + num);
                break;
            case 'hou':
                now.setHours(now.getHours() + num);
                break;
            case 'min':
                now.setMinutes(now.getMinutes() + num);
                break;
            case 'sec':
                now.setSeconds(now.getSeconds() + num);
                break;
            case 'mon':
                if (m[1] === "month") {
                    now.setMonth(now.getMonth() + num);
                    break;
                }
                // fall through
            default:
                var day = __is.day[m[1].substring(0, 3)];
                if (typeof day !== 'undefined') {
                    var diff = day - now.getDay();
                    if (diff === 0) {
                        diff = 7 * num;
                    } else if (diff > 0) {
                        if (m[0] === 'last') {
                            diff -= 7;
                        }
                    } else {
                        if (m[0] === 'next') {
                            diff += 7;
                        }
                    }
                    now.setDate(now.getDate() + diff);
                    now.setHours(0, 0, 0, 0); // when jumping to a specific last/previous day of week, PHP sets the time to 00:00:00
                }
            }
            break;

        default:
            if (/\d+/.test(m[0])) {
                num *= parseInt(m[0], 10);

                switch (m[1].substring(0, 3)) {
                case 'yea':
                    now.setFullYear(now.getFullYear() + num);
                    break;
                case 'mon':
                    now.setMonth(now.getMonth() + num);
                    break;
                case 'wee':
                    now.setDate(now.getDate() + (num * 7));
                    break;
                case 'day':
                    now.setDate(now.getDate() + num);
                    break;
                case 'hou':
                    now.setHours(now.getHours() + num);
                    break;
                case 'min':
                    now.setMinutes(now.getMinutes() + num);
                    break;
                case 'sec':
                    now.setSeconds(now.getSeconds() + num);
                    break;
                }
            } else {
                return false;
            }
            break;
        }
        return true;
    };

    match = str.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
    if (match !== null) {
        if (!match[2]) {
            match[2] = '00:00:00';
        } else if (!match[3]) {
            match[2] += ':00';
        }

        s = match[1].split(/-/g);

        s[1] = __is.mon[s[1] - 1] || s[1];
        s[0] = +s[0];

        s[0] = (s[0] >= 0 && s[0] <= 69) ? '20' + (s[0] < 10 ? '0' + s[0] : s[0] + '') : (s[0] >= 70 && s[0] <= 99) ? '19' + s[0] : s[0] + '';
        return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2]) + (match[4] ? match[4] / 1000 : ''), 10);
    }

    var regex = '([+-]?\\d+\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)' + '|(last|next)\\s' + '(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?' + '|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday' + '|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))' + '(\\sago)?';

    match = str.match(new RegExp(regex, 'gi')); // Brett: seems should be case insensitive per docs, so added 'i'
    if (match === null) {
        return false;
    }

    for (i = 0, l = match.length; i < l; i++) {
        if (!process(match[i].split(' '))) {
            return false;
        }
    }

    return now.getTime() / 1000 | 0;
};

exports.date = function date (format, timestamp) {
    var that = this,
        jsdate, f, formatChr = /\\?([a-z])/gi,
        formatChrCb,
        // Keep this here (works, but for code commented-out
        // below for file size reasons)
        //, tal= [],
        _pad = function (n, c) {
            if ((n = n + '').length < c) {
                return new Array((++c) - n.length).join('0') + n;
            }
            return n;
        },
        txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    f = {
        // Day
        d: function () { // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () { // Shorthand day name; Mon...Sun
            return f.l().slice(0, 3);
        },
        j: function () { // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () { // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () { // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () { // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            return j < 4 | j > 20 && ['st', 'nd', 'rd'][j%10 - 1] || 'th'; 
        },
        w: function () { // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () { // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j()),
                b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5) + 1;
        },

        // Week
        W: function () { // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3),
                b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F: function () { // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () { // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () { // Shorthand month name; Jan...Dec
            return f.F().slice(0, 3);
        },
        n: function () { // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () { // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0)).getDate();
        },

        // Year
        L: function () { // Is leap year?; 0 or 1
            var j = f.Y();
            return j%4==0 & j%100!=0 | j%400==0;
        },
        o: function () { // ISO-8601 year
            var n = f.n(),
                W = f.W(),
                Y = f.Y();
            return Y + (n === 12 && W < 9 ? -1 : n === 1 && W > 9);
        },
        Y: function () { // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () { // Last two digits of year; 00...99
            return (f.Y() + "").slice(-2);
        },

        // Time
        a: function () { // am or pm
            return jsdate.getHours() > 11 ? "pm" : "am";
        },
        A: function () { // AM or PM
            return f.a().toUpperCase();
        },
        B: function () { // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2,
                // Hours
                i = jsdate.getUTCMinutes() * 60,
                // Minutes
                s = jsdate.getUTCSeconds(); // Seconds
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () { // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () { // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () { // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () { // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () { // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () { // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () { // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function () {
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () { // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0),
                // Jan 1
                c = Date.UTC(f.Y(), 0),
                // Jan 1 UTC
                b = new Date(f.Y(), 6),
                // Jul 1
                d = Date.UTC(f.Y(), 6); // Jul 1 UTC
            return 0 + ((a - c) !== (b - d));
        },
        O: function () { // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset(),
                a = Math.abs(tzo);
            return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () { // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ":" + O.substr(3, 2));
        },
        T: function () {
            return 'UTC';
        },
        Z: function () { // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function () { // ISO-8601 date.
            return 'Y-m-d\\Th:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () { // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () { // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = (timestamp == null ? new Date() : // Not provided
        (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
        new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
};

exports.prettyDate = function(time) {
  var monthname = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var date = new Date(time*1000),
  diff = (((new Date()).getTime() - date.getTime()) / 1000),
  day_diff = Math.floor(diff / 86400);
  if ( isNaN(day_diff) || day_diff < 0 ){
    return '';
  }
  if(day_diff >= 31){
    var date_year = date.getFullYear();
    var month_name = monthname[date.getMonth()];
    var date_month = date.getMonth() + 1;
    if(date_month < 10){
      date_month = "0"+date_month;
    }
    var date_monthday = date.getDate();
    if(date_monthday < 10){
      date_monthday = "0"+date_monthday;
    }
    return date_monthday + " " + month_name + " " + date_year;
  }
  return day_diff == 0 && (
    diff < 60 && "just now" ||
    diff < 120 && "1 minute ago" ||
    diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
    diff < 7200 && "1 hour ago" ||
    diff < 86400 && "about " + Math.floor( diff / 3600 ) + " hours ago") ||
  day_diff == 1 && "Yesterday" ||
  day_diff < 7 && day_diff + " days ago" ||
  day_diff < 31 && Math.ceil( day_diff / 7 ) + " week" + ((Math.ceil( day_diff / 7 )) == 1 ? "" : "s") + " ago";
};

exports.in_array = function (needle, haystack, argStrict) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: vlado houba
    // +   input by: Billy
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true
    // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    // *     returns 2: false
    // *     example 3: in_array(1, ['1', '2', '3']);
    // *     returns 3: true
    // *     example 3: in_array(1, ['1', '2', '3'], false);
    // *     returns 3: true
    // *     example 4: in_array(1, ['1', '2', '3'], true);
    // *     returns 4: false
    var key = '',
        strict = !! argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
    return false;
};

exports.array_search = function(needle, haystack, argStrict) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
    // *     returns 1: 'surname'
    // *     example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
    // *     example 2: var ordered_arr = array({3:'value'}, {2:'value'}, {'a':'value'}, {'b':'value'});
    // *     example 2: var key = array_search(/val/g, ordered_arr); // or var key = ordered_arr.search(/val/g);
    // *     returns 2: '3'

    var strict = !!argStrict,
        key = '';
    
    if (haystack && typeof haystack === 'object' && haystack.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
        return haystack.search(needle, argStrict);
    }
    if (typeof needle === 'object' && needle.exec) { // Duck-type for RegExp
        if (!strict) { // Let's consider case sensitive searches as strict
            var flags = 'i' + (needle.global ? 'g' : '') +
                        (needle.multiline ? 'm' : '') +
                        (needle.sticky ? 'y' : ''); // sticky is FF only
            needle = new RegExp(needle.source, flags);
        }
        for (key in haystack) {
            if (needle.test(haystack[key])) {
                return key;
            }
        }
        return false;
    }

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            return key;
        }
    }

    return false;
};