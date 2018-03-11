'use strict';

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = function log() {
	var print = console;
	print.log.apply(print, arguments);
};

var options = _querystring2.default.parse(__resourceQuery.slice(1));
window.WebSocket = window.WebSocket || window.MozWebSocket;
var connection = new WebSocket(options.wmsPath);

connection.onopen = function () {
	// connection is opened and ready to use
	log('open');
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
		log("This doesn't look like a valid JSON: ", message.data);
		return;
	}
	// handle incoming message
};