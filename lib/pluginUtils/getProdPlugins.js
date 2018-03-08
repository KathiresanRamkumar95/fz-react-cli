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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getProdPlugins = function getProdPlugins(options) {
	var plugins = [new _webpack2.default.optimize.ModuleConcatenationPlugin(), new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /moment$/), new _webpack2.default.DefinePlugin(_defineProperty({
		__TEST__: false,
		__DEVELOPMENT__: false,
		__DOCS__: false,
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		},
		__SERVER__: false
	}, '__DOCS__', false)), new _plugins.RuntimePublicPathPlgin({
		publicPathCallback: options.publicPathCallback
	})];
	if (options.bundleAnalyze) {
		plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({
			analyzerMode: 'static'
		}));
	}
	if (options.manifestReplacer) {
		plugins.push(new _plugins.ChunkManifestReplacePlugin({
			replacer: options.manifestReplacer
		}));
	}
	return plugins;
};

exports.default = getProdPlugins;