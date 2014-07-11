var net = require('net'),
    Player = require('player');

function PlayerManager(config) {
  this.config = config, this.python = null, this.socket = new net.Socket(), this.player = undefined;
};

PlayerManager.prototype.initPy = function() {
	
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
};

PlayerManager.prototype.getStreamUrl = function(id, callback) {
    var socket = this.socket = new net.Socket(),
        that = this;
  
    socket.connect(__dirname + this.config.socket_location);
    socket.write(id);
    console.log('waiting for url');
    socket.on('error', function(data) {
        socket.end();
        console.log('PlayerManager: socket error: ' + data);
    });
    
    socket.on('data', function(data) {
      callback(data.toLocaleString());
      socket.end();
    });
};

PlayerManager.prototype.exit = function() {
    this.python.kill();
};

PlayerManager.prototype.play = function(id) {
  var that = this;

  this.getStreamUrl(id, function(url) {
    if (typeof that.player === 'undefined') {
      that.player = new Player(url);
      that.player.play();
    } else {
      that.player.add(url);
      that.player.next();
    }
  });
};

module.exports = function(config) {
  return new PlayerManager(config);
};