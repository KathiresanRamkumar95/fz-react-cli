//$Id$//
/*eslint no-console: "error"*/
'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var getIP = require('../utils/ipaddress');
var prodFlag = process.env.npm_config_server_prod || false;
var hotReload = process.env.npm_config_dev_hot || false;
var context = process.env.npm_config_server_context || 'app';
var https = require('https');
var app = express();
var config;
if (prodFlag) {
  config = require('../config/webpack.prod.config');
  config.output.publicPath = '/' + context;
  var compression = require('compression');
  app.use(compression());
} else if (hotReload) {
  config = require('../config/webpack.dev.hot.config');
} else {
  config = require('../config/webpack.dev.config');
}

var compiler = webpack(config);
var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || '9090';
var mockFlag = process.env.npm_config_server_mock || true;

var appPath = fs.realpathSync(process.cwd());
var url = 'htt' + 'ps://' + host + ':' + port;
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: prodFlag ? url + '/' + context : config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
}));

//app.use(require('webpack-hot-middleware')(compiler));
if (hotReload) {
  app.use(require('react-error-overlay/middleware')());
}
app.use(require('../hmrMiddleware')(compiler, { path: '/sockjs-node/info' }));
if (mockFlag) {
  try {
    var mockServer = require(path.resolve(appPath, 'mockapi', 'index.js'));
    mockServer(app);
  } catch (e) {
    // custom console
    console.log('create mockapi folder and index.js should export fn and express app as input');
  }
}
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}).use('/' + context + '/fonts', express.static(context + '/fonts'));

app.use('/' + context, express.static(context));
app.use('/' + context + '/*', express.static(context));

//app.use('/app', express.static('app'));
//app.use('/app/i18n', express.static('app/i18n'));

https.createServer({
  key: fs.readFileSync(path.join(__dirname, '../../cert/key1.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../../cert/cert1.pem')),
  passphrase: 'AbcAbc$2017'
}, app).listen(port, function (err) {
  if (err) {
    // custom console
    console.log(err);
    return;
  }

  if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
    // custom console
    console.log('you can change hostname and port using following command');
    // custom console
    console.log('npm start --server:host={hostname} --server:port={port} --app:folder={app} --server:prod={true} --server:mock={false} --server:context={app} --react:mig={true} --dev:hot={true}');
  }
  // custom console
  console.log('Listening at ' + url);
});