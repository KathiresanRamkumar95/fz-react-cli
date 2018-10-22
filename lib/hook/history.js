'use strict';

var history = require('../../node_modules/history');
console.log("history hook", history);
var createHistory = history.createHistory;
function jsonToQueryString(json) {
	return '?' + Object.keys(json).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
	}).join('&');
}
function proxyCreateHistory() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var history = createHistory.apply(history, args);
	var push = history.push;
	var replace = history.replace;
	history.push = function (nextLocation) {
		var query = Object.assign({}, nextLocation.query, { "devURL": global.devURLParam || global.appId });
		var search = jsonToQueryString(query);
		//var search=Object.assign({},nextLocation.query,{"devURL":global.devURLParam || global.appId});
		return push(Object.assign({}, nextLocation, { search: search }));
	};
	history.replace = function (nextLocation) {
		var query = Object.assign({}, nextLocation.query, { "devURL": global.devURLParam || global.appId });
		var search = jsonToQueryString(query);
		return replace(Object.assign({}, nextLocation, { search: search }));
	};
	return history;
}
history.createHistory = proxyCreateHistory;
module.exports = history;