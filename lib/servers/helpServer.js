'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var server = options.helpServer;

var serverUrl = (0, _utils.getServerURL)('ht' + 'tp', server);
var port = server.port;


var app = (0, _express2.default)();

app.use('/help', _express2.default.static(_path2.default.join(__dirname, '..', '..', 'templates', 'help')));

app.listen(port, function (err) {
	if (err) {
		throw err;
	}
	(0, _utils.log)('Listening at ' + serverUrl + '/help/');
});