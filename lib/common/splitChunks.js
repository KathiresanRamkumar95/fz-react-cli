'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isVendor = function isVendor(module) {
	var userRequest = module.userRequest;

	return userRequest && userRequest.indexOf('node_modules') >= 0 && userRequest.indexOf('node_modules' + _path2.default.sep + 'react') === -1 && userRequest.indexOf('.css') === -1 && userRequest.indexOf('publicPathConfig.js') === -1;
};

var isReact = function isReact(module) {
	var userRequest = module.userRequest;

	return userRequest && userRequest.indexOf('node_modules' + _path2.default.sep + 'react') >= 0;
};

exports.default = {
	cacheGroups: {
		default: false,
		'react.vendor': {
			name: 'react.vendor',
			chunks: 'all',
			minChunks: 1,
			test: isReact
		},
		vendor: {
			name: 'vendor',
			chunks: 'all',
			minChunks: 1,
			test: isVendor
		}
	}
};