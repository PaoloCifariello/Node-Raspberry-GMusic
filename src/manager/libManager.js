
function LibraryManager(config) {
  this.config = config;
  
  if(config.refresh_on_startup) {
    this.__refreshLibrary();
    this.__refreshed = true;
  }
  
  this.__lookupDB(config.db_location + 'library.db');
}


LibraryManager.prototype.get = function(what, options, callback) {

    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }

    var result = [];
    
    if (what === "albums")
        result = this.library.albums.results;
    else if (what === "artists")
        result = this.library.artists.results;
    else if (what === "tracks")
        result = this.library.tracks.results;


    if (options)
        result = this.__find(result, options);     

    if (typeof callback === "function")
        callback(result);
    
    return result;
}

/** Private */
LibraryManager.prototype.__find = function(data, opt) {
    var result = [],
        that = this;
    
    data.forEach(function(el) {
       if (that.__test(el, opt))
            result.push(el);
    });
    
    return result;
};

LibraryManager.prototype.__test = function(el, opt) {
    for (o in opt)
        if (el[o] != opt[o])
            return false;
    
    return true;
}

LibraryManager.prototype.__lookupDB = function(path) {
    this.library = {
        tracks: require(__dirname + this.config.db_location + 'tracks.json'),
        artists: require(__dirname + this.config.db_location + 'artists.json'),
        albums: require(__dirname + this.config.db_location + 'albums.json')
    };
}

LibraryManager.prototype.__refreshLibrary = function(callback) {
  if (this.__refreshed)
    return;
  
  this.__fetchMusic(callback);
  this.refreshed = true;
}

LibraryManager.prototype.__fetchMusic = function(callback) {
  var python = require('child_process').spawn(
  'python',
  // second argument is array of parameters, e.g.:
  [ __dirname + "/../py_modules/library_manager.py",
   __dirname + this.config.db_location,
   this.config.username,
   this.config.password ]
  );

  python.stdout.on('data', function (data) {
    console.log('' + data);
  });

  python.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  
  python.on('close', function(code){ 
    if (code !== 0)
      console.error('Error ' + code + ': Python script library_manager.py'); 
    else {
      console.log("Library refreshed.");
      if (typeof callback === 'function')
        callback();
    }
  });
}

module.exports = function(config) {
  return new LibraryManager(config);
};