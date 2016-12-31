//$Id$//
'use strict';

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./config/webpack.dev.config');

var app = express();
var compiler = webpack(config);
var host = process.env.npm_config_server_host || process.env.npm_package_serverconfig_host;
var port = process.env.npm_config_server_port || process.env.npm_package_serverconfig_port;
var url = "htt" + "p://" + host + ":" + port;
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use('/fzdesk', express.static('fzdesk'));
app.get('/fzdesk/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'fzdesk', 'index.html'));
});

app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
    console.log("you can change hostname and port using following command");
    console.log("npm start --server:host={hostname} --server:port={port}");
  }
  console.log('Listening at ' + url);
});