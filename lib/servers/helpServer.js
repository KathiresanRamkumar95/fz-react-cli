'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _utils.getOptions)();
var server = options.help.server;

var serverUrl = (0, _utils.getServerURL)(server, 'htt' + 'p');
var port = server.port;


var app = (0, _express2.default)();

app.use('/help', _express2.default.static(_path2.default.join(__dirname, '..', '..', 'templates', 'help')));

app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  (0, _utils.log)('Listening at ' + serverUrl + '/help/');
});