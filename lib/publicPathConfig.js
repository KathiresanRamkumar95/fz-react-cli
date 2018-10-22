'use strict';

var querystring = require('querystring');
var options = querystring.parse(__resourceQuery.slice(1));

if (!__DEVELOPMENT__) {
  global.publicPath = function (chunkId) {
    __webpack_public_path__ = '' + global.staticDomain[options.jsSubdomain];
  };
  __webpack_public_path__ = '' + global.staticDomain[options.jsSubdomain];
  // __webpack_public_path__ = '//js.' + global.staticDomain;
}