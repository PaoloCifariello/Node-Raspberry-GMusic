var net = require('net');

function PlayerManager(config) {
  
  this.config = config;
  this.python = null;

  this._initPy();
  this.socket = new net.Socket();
  
}

PlayerManager.prototype._initPy = function() {
	
    var python = this.python = require('child_process').spawn(
    'python',
    // second argument is array of parameters, e.g.:
    [ __dirname + "/../py_modules/url_getter.py",
     __dirname + this.config.socket_location,
     this.config.username,
     this.config.password ]
    );
  
    python.stdout.on('data', function (data) {
    console.log('' + data);
    });

    python.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
    });
    
    python.on('close', function(code) {
        console.log('Python exited :( ' + code);
    });
}

PlayerManager.prototype.getStreamUrl = function(id, callback, ntry) {
    var socket = this.socket,
        that = this;
    
    console.log(__dirname + this.config.socket_location);
    
    socket.connect(__dirname + this.config.socket_location);
    socket.write(id);
    
    socket.on('error', function(data) {
        socket.end();
        console.log('PlayerManager: socket error: ' + data);
    });
    
    socket.on('data', function(data) {
        socket.end();
        callback(data.toLocaleString());
    });
}

PlayerManager.prototype.exit = function() {
    this.python.kill();
}

module.exports = function(config) { 
  return new PlayerManager(config);
}