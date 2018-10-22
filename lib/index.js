'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (projectFolder, reactCliPath, script) {
	switch (script) {
		case "start":
			console.log("Not yet implemented");
		case "docs":
			(0, _docsServer2.default)(projectFolder, reactCliPath);
	}
};

var _webpackDev = require('./config/webpack.dev.config');

var _webpackDev2 = _interopRequireDefault(_webpackDev);

var _webpackDocs = require('./config/webpack.docs.config');

var _webpackDocs2 = _interopRequireDefault(_webpackDocs);

var _webpackProd = require('./config/webpack.prod.config');

var _webpackProd2 = _interopRequireDefault(_webpackProd);

var _docsServer = require('./server/docsServer');

var _docsServer2 = _interopRequireDefault(_docsServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spawn = require('cross-spawn');