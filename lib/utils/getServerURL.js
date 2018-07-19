"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getServerURL = function getServerURL(protocol, serverInfo) {
  var host = serverInfo.host,
      domain = serverInfo.domain,
      port = serverInfo.port;


  if (domain) {
    return protocol + "://" + host + "." + domain + ".zohocorpin.com:" + port;
  } else if (process.env.npm_config_server_domain) {
    return protocol + "://" + host + "." + process.env.npm_config_server_domain + ".zohocorpin.com:" + port;
  }
  return protocol + "://" + host + ":" + port;
};

exports.default = getServerURL;