var _db_version = 1;
var _db_name = 'slcdb';

// Initializes the Database
exports.init = function() {
  var db = Ti.Database.open(_db_name);
  
  // Check Database Version
  if (Ti.App.Properties.getInt(_db_name) != _db_version) {
    // Delete DB and create new
    // TODO
    
    Ti.App.Properties.setInt(_db_name, _db_version);
  }
  
  // Database is probably installed but these won't hurt
  // Create events table
  db.execute('CREATE TABLE IF NOT EXISTS events (nid INTEGER, title TEXT, ' +
    'eventtype TEXT, day TEXT, datefrom TEXT, dateto TEXT, speaker TEXT, room TEXT, ' +
    'track TEXT, weight TEXT, download TEXT, notes TEXT)');
  // Create speakers table
  db.execute('CREATE TABLE IF NOT EXISTS speakers (nid INTEGER, title TEXT, ' +
    'prefix TEXT, fname TEXT, lname TEXT, smallimage TEXT, speakerimage TEXT, ' +
    'largeimage TEXT, shortbio TEXT, location TEXT, guest TEXT, bio TEXT, ministry TEXT)');
  // Create posts table
  db.execute();
  
  db.close();
};

