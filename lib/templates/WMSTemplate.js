'use strict';

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = _querystring2.default.parse(__resourceQuery.slice(1));
window.WebSocket = window.WebSocket || window.MozWebSocket;
var connection = new WebSocket(options.wmsPath);

connection.onopen = function () {
	// connection is opened and ready to use
	console.log('open');
};

connection.onerror = function (error) {
	// an error occurred when sending/receiving data
};

connection.onmessage = function (message) {
	// try to decode json (I assume that each message
	// from server is json)
	try {
		var json = JSON.parse(message.data);
		Collaboration.handleCustomMessage(json);
	} catch (e) {
		(0, _utils.log)("This doesn't look like a valid JSON: ", message.data);
		return;
	}
	// handle incoming message
};