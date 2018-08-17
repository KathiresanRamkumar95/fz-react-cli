'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getServerURL = function getServerURL(serverInfo, protocol) {
  var host = serverInfo.host,
      domain = serverInfo.domain,
      port = serverInfo.port;


  if (domain) {
    return (protocol ? protocol + ':' : '') + '//' + host + '.' + domain + '.zohocorpin.com:' + port;
  }
  return (protocol ? protocol + ':' : '') + '//' + host + ':' + port;
};

exports.default = getServerURL;