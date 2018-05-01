'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _child_process = require('child_process');

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _fzScreenshotTest = require('fz-screenshot-test');

var _fzScreenshotTest2 = _interopRequireDefault(_fzScreenshotTest);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _webpackDocs = require('../configs/webpack.docs.config');

var _webpackDocs2 = _interopRequireDefault(_webpackDocs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import https from 'https';
var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var server = options.ssServer;
var host = server.host,
    port = server.port,
    locale = server.locale,
    seleniumHub = server.seleniumHub,
    remoteBranch = server.remoteBranch,
    referBranch = server.referBranch;


var appPath = process.cwd();
var serverUrl = (0, _utils.getServerURL)('htt' + 'ps', server);

var app = (0, _express2.default)();

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({
  extended: true
}));

var compiler = (0, _webpack2.default)(_webpackDocs2.default);
var wMid = (0, _webpackDevMiddleware2.default)(compiler, {
  logLevel: 'error',
  publicPath: _webpackDocs2.default.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
});
app.use(wMid);

app.use(require('webpack-hot-middleware')(compiler));

app.use('/docs', _express2.default.static(_path2.default.join(appPath, 'docs')));

app.use('/docs/*', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, '..', '..', 'docs', 'index.html'));
});

if (remoteBranch) {
  app.post('/repo/merge', function (req, res) {
    var ref = req.body.ref;

    if (ref && ref.endsWith(remoteBranch)) {
      (0, _child_process.spawnSync)('git', ['pull', 'origin', remoteBranch], {
        stdio: 'inherit'
      });
    }
    res.send('done');
  });
}

// let httpsServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, '../../cert/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, '../../cert/cert.pem')),
//     passphrase: 'zddqa1585f82'
//   },
//   app
// );
//
// httpsServer.listen(port, err => {
//   if (err) {
//     throw err;
//   }
//   log(`Listening at ${serverUrl}`);
// });

// let httpPort = Number(port) + 1;
var httpPort = Number(port);

app.listen(httpPort, function (err) {
  if (err) {
    throw err;
  }
  (0, _utils.log)('Listening at ' + (0, _utils.getServerURL)('ht' + 'tp', {
    host: host,
    locale: locale,
    port: httpPort
  }) + '/docs/');
});

_fzScreenshotTest2.default.run({
  seleniumHub: seleniumHub,
  url: 'http://' + host + ':' + port + '/docs/component.html',
  browserList: ['chrome'],
  mode: 'test',
  script: 'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
}, function (status) {
  if (status !== false) {
    (0, _utils.log)('Current Mode call back server kill function called..!');
    // httpsServer.close();
    server.close();
    wMid.close();
    referenceMode();
  } else {
    //  httpsServer.close();
    server.close();
    wMid.close();
    (0, _utils.log)('Component list undefined.');
  }
});

var referenceMode = function referenceMode() {
  (0, _child_process.spawnSync)('git', ['checkout', referBranch], { encoding: 'utf8' });
  var results = spawn.sync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8'
  });
  var currentBranch = results.output.filter(function (d) {
    return d;
  })[0];
  currentBranch = currentBranch.replace(/(\r\n|\n|\r)/gm, '');
  console.log(currentBranch);
  (0, _utils.log)('Reference Branch test mode test called..!');
  var wMid = require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
  app.use(wMid);

  app.use(require('webpack-hot-middleware')(compiler));

  app.get('/docs/component.html', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '..', '..', 'docs', 'component.html'));
  });
  app.get('/docs/js/babel.min.js', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '..', '..', 'docs', 'js', 'babel.min.js'));
  });
  app.get('/docs/*', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '..', '..', 'docs', 'index.html'));
  });

  var server = app.listen(port, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
      console.log('you can change hostname and port using following command');
      console.log('npm start --server:host=vimal-zt58.tsi.zohocorpin.com --server:port=8080');
    }
    console.log('Listening at ' + url + '/docs/');
  });

  _fzScreenshotTest2.default.run({
    seleniumHub: seleniumHub,
    url: 'http://' + host + ':' + port + '/docs/component.html',
    browserList: ['chrome'],
    mode: 'reference',
    script: 'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
  }, function () {
    server.close();
    wMid.close();
    (0, _child_process.spawnSync)('cp', ['-r', _path2.default.join(__dirname, '..', '..', 'templates', 'screenShotReport'), _path2.default.join(appPath, 'screenShots')], { stdio: 'inherit' });
    (0, _utils.log)('Screenshot test succesfully completed.');
  });
};