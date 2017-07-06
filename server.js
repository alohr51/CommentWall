// Startup Express App
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
console.log('App started on ' + appEnv.bind + ':' + appEnv.port);

// Configure views
var path = require('path');
app.use(express.static(path.join(__dirname, 'views')));
// To be able to parse json
app.use(bodyParser.urlencoded({ extended: true }));
require("./routes/routes.js")(app);

http.listen(appEnv.port, appEnv.bind);