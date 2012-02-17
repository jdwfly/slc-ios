// placeholder db.js
exports.init = function() {
  // Determine if this is the first run
  // If so, then try to pull JSON data from site 
  // If not online then use local JSON data
  
  // If it is not the first run then try to get new json data based upon lastUpdate property
  
  
  // Create the taffydb for the app to use
  
  Ti.API.info('db.js: Initializing database')
  
  // This will return the taffy db so it can be assigned to a global variable.
  return Ti.taffy([
    {"id": 1, "name": "First test"},
    {"id": 2, "name": "Second test"},
    {"id": 3, "name": "Third test"}
  ]);
}
