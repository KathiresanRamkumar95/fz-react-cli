//$Id$//
'use strict';

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
var mockServer = require('./mockapi');
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
mockServer(app);
app.use('/dp/js', express.static('portal/js'));
app.use('/dp/css', express.static('portal/css'));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}).use('/dp/fonts', express.static('portal/fonts'));
app.use('/dp/images', express.static('portal/images'));
app.use('/dp/i18n', express.static('portal/i18n'));
app.get('/dp/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'portal', 'index.html'));
});

app.listen(9090, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
    console.log("you can change hostname and port using following command");
    console.log("npm start --server:host=vimal-zt58.tsi.zohocorpin.com --server:port=8080");
  }
  console.log('Listening at ' + url);
});