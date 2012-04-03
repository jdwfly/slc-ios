var _osname = Ti.Platform.osname;
var _debug = false;
var _baseUrl = "http://www.lancasterbaptist.org/slc/json";
var _eventsUrl = "/events";

exports.osname = _osname;
exports.baseUrl = _baseUrl;
exports.eventsUrl = _eventsUrl;

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

