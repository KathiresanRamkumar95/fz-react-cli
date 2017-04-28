//$Id$//
/*eslint no-console: "error"*/
'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var getIP = require('../utils/ipaddress');
var prodFlag = process.env.npm_config_server_prod || false;
var https = require('https');
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
var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || "9090";
var context = process.env.npm_config_server_context || "app";
var mockFlag = process.env.npm_config_server_mock || true;
var appPath = fs.realpathSync(process.cwd());
var url = "htt" + "ps://" + host + ":" + port;
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: prodFlag ? url + "/" + context : config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
if (mockFlag) {
  try {
    var mockServer = require(path.resolve(appPath, 'mockapi', 'index.js'));
    mockServer(app);
  } catch (e) {
    // custom console
    console.log("create mockapi folder and index.js should export fn and express app as input");
  }
}
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}).use('/' + context + '/fonts', express.static(context + "/fonts"));

app.use('/' + context, express.static(context));
app.use('/' + context + "/*", express.static(context));

//app.use('/app', express.static('app'));
//app.use('/app/i18n', express.static('app/i18n'));


https.createServer({
  key: fs.readFileSync(path.join(__dirname, '../../cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../../cert/cert.pem'))
}, app).listen(port, function (err) {
  if (err) {
    // custom console
    console.log(err);
    return;
  }

  if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
    // custom console
    console.log("you can change hostname and port using following command");
    // custom console
    console.log("npm start --server:host={hostname} --server:port={port} --app:folder={app} --server:prod={true} --server:mock={false} --server:context={app}");
  }
  // custom console
  console.log('Listening at ' + url);
});