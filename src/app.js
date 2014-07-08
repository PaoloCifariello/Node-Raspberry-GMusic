/* Librerie utilizzate */
var Player = require('player'),
    express = require('express');

/* Configurazione */
var config = require('./config.json');

/* Moduli aggiuntivi */
var libraryManager = require('./manager/libManager.js')(config),
    playerManager = require('./manager/playManager.js')(config);

var app = express();

/* Qui parte l'applicazione */
setProcessHandler();
initApp();

function initApp() {
    //app.engine('jade', require('jade').__express);
    app.set('title', 'Google Music on Raspberry Pi');
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    
    /* Setting up routes */
    app.get('/', function(req, res){
      res.render('artistList', { artists: libraryManager.get('artists') });
    });
    app.get('/artist/:id', function(req, res){
        res.render('artistTracks', { 
            artist: libraryManager.get('artists', { gid: req.params.id })[0],
            tracks: libraryManager.get('tracks', { artistId: req.params.id})
        });
    });
    
    app.get('/tracks/:id', function(req, res){
        playerManager.getStreamUrl(req.params.id, function(url) {
            player = new Player(url);
            player.play();
            res.render('play', { 
                track: libraryManager.get('tracks', { gid: req.params.id})
            });  
        });
    });
    
    app.listen(8000);
}

function setProcessHandler() {
    process.on(['SIGINT', 'SIGTERM'] , function(code) {
        console.log('asd ' + code);
        playerManager.exit();
        process.exit();
    });
}