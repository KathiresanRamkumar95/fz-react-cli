'use strict';

var os = require('os');
module.exports = function getIP() {
  var ifaces = os.networkInterfaces();
  var ips = [];
  Object.keys(ifaces).forEach(function (ifname) {
    var a = ifaces[ifname].map(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return;
      }
      return iface.address;
    }).filter(function (a) {
      return a;
    });
    ips = ips.concat(a);
  });
  ips.push("127.0.0.1");
  return ips[0];
};