'use strict';

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = _querystring2.default.parse(__resourceQuery.slice(1));

if (!__DEVELOPMENT__) {
	global[options.publicPathCallback] = function (webpackRequireFun) {
		webpackRequireFun.p = '' + global.staticDomain[options.js];
	};
	webpackRequireFun.p = '' + global.staticDomain[options.js];
}