//$Id$//
/*eslint no-console: "error"*/
'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var WebSocket = require('ws');
var bodyParser = require('body-parser');
var getIP = require('../utils/ipaddress');
var prodFlag = process.env.npm_config_server_prod || false;
var hotReload = process.env.npm_config_dev_hot || false;
var context = process.env.npm_config_server_context || 'app';
var isDisableContextURL = process.env.npm_config_disable_contexturl || false;
var contextURL = '/' + context;
if (isDisableContextURL) {
  contextURL = '';
}
var https = require('https');
var app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  // to support URL-encoded bodies
  extended: true
}));
var config;
if (prodFlag) {
  config = require('../config/webpack.prod.config');
  //config.output.publicPath = '/' + context;
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
  publicPath: prodFlag ? contextURL == '' ? url + '/' + contextURL : url + contextURL : config.output.publicPath,
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
}).use(contextURL + '/fonts', express.static(context + '/fonts'));

//app.use('/' + context, express.static(context));

app.use('/wms/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'wms', 'index.html'));
});
//app.use('/app', express.static('app'));
//app.use('/app/i18n', express.static('app/i18n'));

var server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, '../../cert/key2.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../../cert/cert2.pem')),
  passphrase: 'zddqa1585f82' //cert1 - AbcAbc$2017
}, app);
var wss = new WebSocket.Server({ server: server });
var wsPool = [];
wss.on('connection', function connection(ws, req) {
  wsPool.push(ws);
  //const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('close', function close() {
    wsPool = wsPool.filter(function (ws1) {
      return ws1 != ws;
    });
  });
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
app.post('/wmsmockapi', function (req, res) {
  wsPool.forEach(function (ws) {
    try {
      ws.send(JSON.stringify(req.body));
    } catch (e) {
      console.log(e, req.body);
    }
  });

  res.send('success');
});
if (contextURL) {
  app.use(contextURL, express.static(context));
  app.use(contextURL + '/*', express.static(context));
} else {
  app.use(express.static(context));
  app.use('/*', express.static(context));
}
server.listen(port, function (err) {
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
  console.log('Listening at ' + url + contextURL + '/');
});
var httpPort = parseInt(port) + 1;
app.listen(httpPort, function (err) {
  if (err) {
    // custom console
    console.log(err);
    return;
  }

  if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
    // custom console
    console.log('you can change hostname and port using following command');
    // custom console
    console.log('npm start --server:host={hostname} --server:port={port} --app:folder={app} --server:prod={true} --server:mock={false} --server:context={app} --disable:contexturl=true --react:mig={true} --dev:hot={true}');
  }
  // custom console
  console.log('Listening at ' + 'htt' + 'p://' + host + ':' + httpPort + contextURL + '/');
});