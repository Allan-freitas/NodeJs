var express = require('express');
var cors = require('cors');
var app = express();
var db = require('./common/db.js');
global.__root   = __dirname + '/'; 
app.use(cors());

app.get('/api', function (req, res) {
  res.status(200).send('API node.js funcionamento corretamente.');
});

var UserController = require(__root + 'controllers/usuario/UsuarioController');
app.use('/api/users', UserController);

var AuthController = require(__root + 'controllers/auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;