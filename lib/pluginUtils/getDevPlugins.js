'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDevPlugins = function getDevPlugins(options) {
	var plugins = [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /moment$/), new _webpack2.default.DefinePlugin({
		__CLIENT__: true,
		__TEST__: false,
		__SERVER__: false,
		__DEVELOPMENT__: true,
		__DEVTOOLS__: true,
		__DOCS__: false
	})];
	return plugins;
};

exports.default = getDevPlugins;