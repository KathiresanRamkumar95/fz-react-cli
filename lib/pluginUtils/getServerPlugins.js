'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var _plugins = require('../plugins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getProdPlugins = function getProdPlugins(options) {
	var plugins = [new _webpack2.default.optimize.ModuleConcatenationPlugin(), new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /moment$/), new _webpack2.default.DefinePlugin({
		__TEST__: false,
		__DEVELOPMENT__: true,
		__DOCS__: false,
		__SERVER__: true
	})];

	return plugins;
};

exports.default = getProdPlugins;