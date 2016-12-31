//$Id$//
'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../config/webpack.dev.config');

var app = express();
var compiler = webpack(config);
var host = process.env.npm_package_serverconfig_host || "localhost";
var port = process.env.npm_package_serverconfig_port || "9090";
var appName = process.env.npm_package_serverconfig_appName || "app" 

var url = "htt" + "p://" + host + ":" + port;
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
/*app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}).use('/'+appName+'/fonts', express.static(appName+"/fonts"));
*/
app.use('/'+appName, express.static(appName));

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