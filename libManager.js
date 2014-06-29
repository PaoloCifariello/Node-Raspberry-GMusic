var Datastore = require('nedb');
//var models = require('./models');

function LibraryManager(config) {
  this.config = config;
  this.lookupDB(config.db_location); 
}

LibraryManager.prototype.refreshLibrary = function(callback) {
  this.tracksDB.remove({ }, { multi: true });
  this.artistsDB.remove({ }, { multi: true });
  this.albumDB.remove({ }, { multi: true });
  this.playlistDB.remove({ }, { multi: true });
}

LibraryManager.prototype.lookupDB = function(path) {
  this.tracksDB = new Datastore({ filename: path + 'track.db', autoload: true });
  this.artistsDB = new Datastore({ filename: path + 'artist.db', autoload: true });
  this.albumDB = new Datastore({ filename: path + 'album.db', autoload: true });
  this.playlistDB = new Datastore({filename: path + 'playlist.db', autoload: true });
}


module.exports = function(config) {
  return new LibraryManager(config);
};