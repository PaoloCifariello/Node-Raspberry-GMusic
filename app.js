/* Librerie utilizzate */
var player = require('player'),
    express = require('express');

/* Configurazione */
var config = require('./config.json');

/* Moduli aggiuntivi */
var libraryManager = require('./libManager.js')(config),
    playerManager = require('./playManager.js')(config);

var app = express();

/* Eventuale refresh della libreria */
if (config.refresh_on_startup)
  libraryManager.refreshLibrary();

//app.engine('jade', require('jade').__express);
app.set('title', 'Google Music on Raspberry Pi');

app.use(express.Router());
//app.use(express.static());
//console.log(__dirname);
//app.use();
