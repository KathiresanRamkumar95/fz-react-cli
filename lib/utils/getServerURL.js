"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getServerURL = function getServerURL(protocol, serverInfo) {
  var host = serverInfo.host,
      locale = serverInfo.locale,
      port = serverInfo.port;


  if (locale) {
    return protocol + "://" + host + "." + locale + ".zohocorpin.com:" + port;
  } else if (process.env.npm_config_server_locale) {
    return protocol + "://" + host + "." + process.env.npm_config_server_locale + ".zohocorpin.com:" + port;
  }
  return protocol + "://" + host + ":" + port;
};

exports.default = getServerURL;