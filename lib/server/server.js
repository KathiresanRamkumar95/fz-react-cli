//$Id$//
'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var prodFlag = process.env.npm_config_server_prod || false;
var app = express();
var config;
if (prodFlag) {
  config = require('../config/webpack.prod.config');

  var compression = require('compression');
  app.use(compression());
} else {
  config = require('../config/webpack.dev.config');
}

var compiler = webpack(config);
var host = process.env.npm_config_server_host || "localhost";
var port = process.env.npm_config_server_port || "9090";
var appName = process.env.npm_config_server_appName || "app";
var mockFlag = process.env.npm_config_server_mock || true;
var appPath = fs.realpathSync(process.cwd());
var url = "htt" + "p://" + host + ":" + port;
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
if (mockFlag) {
  try {
    var mockServer = require(path.resolve(appPath, 'mockapi', 'index.js'));
    mockServer(app);
  } catch (e) {
    console.log("create mockapi folder and index.js should export fn and express app as input");
  }
}
/*app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}).use('/'+appName+'/fonts', express.static(appName+"/fonts"));
*/
app.use('/' + appName, express.static(appName));
app.use('/' + appName + "/*", express.static(appName));

//app.use('/app', express.static('app'));
//app.use('/app/i18n', express.static('app/i18n'));


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