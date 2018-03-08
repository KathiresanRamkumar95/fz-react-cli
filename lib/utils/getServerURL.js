"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var getServerURL = function getServerURL(protocol, serverInfo) {
	var host = serverInfo.host,
	    locale = serverInfo.locale,
	    port = serverInfo.port;


	if (locale) {
		return protocol + "://" + host + "." + locale + ".zohocorpin.com";
	} else {
		return protocol + "://" + host + ":" + port;
	}
};

exports.default = getServerURL;