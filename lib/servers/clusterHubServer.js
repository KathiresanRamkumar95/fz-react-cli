'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _utils.getOptions)();
var server = options.cluster.server;


var app = (0, _express2.default)();
var appPath = process.cwd();

var clusterConfigPath = _path2.default.join(appPath, 'clusterConfig.js');
var config = void 0;

if (_fs2.default.existsSync(clusterConfigPath)) {
  config = require(clusterConfigPath);
} else {
  throw new Error('clusterConfig.js doen\'t exist under following path - ' + clusterConfigPath);
}

app.get('/clusterhub/nodes', function (req, res) {
  res.send(JSON.stringify(config.cluster));
});

app.use('/clusterhub', _express2.default.static(_path2.default.join(__dirname, '..', '..', 'templates', 'clusterhub')));

app.listen(server.port, function (err) {
  if (err) {
    throw err;
  }
  (0, _utils.log)('Listening at ' + (0, _utils.getServerURL)(server, 'ht' + 'tp') + '/clusterhub/');
});