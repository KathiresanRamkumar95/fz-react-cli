'use strict';

var path = require('path');
var express = require('express');
var app = express();
var host = 'localhost';
var port = process.env.npm_config_server_port || '3000';
var url = 'htt' + 'p://' + host + ':' + port;

app.use('/help', express.static(path.join(__dirname, '..', '..', 'help')));

var server = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + url + '/help/');
});