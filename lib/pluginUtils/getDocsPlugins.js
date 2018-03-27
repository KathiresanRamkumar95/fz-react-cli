'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _ModuleStatsPlugin = require('../plugins/ModuleStatsPlugin');

var _ModuleStatsPlugin2 = _interopRequireDefault(_ModuleStatsPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDocsPlugins = function getDocsPlugins() {
	var plugins = [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.ProvidePlugin({
		React: 'react'
	}), new _webpack2.default.DefinePlugin({
		__TEST__: false,
		__DEVELOPMENT__: true,
		__DOCS__: true
	}), new _ModuleStatsPlugin2.default({ filename: 'moduleStats.js' })];
	return plugins;
};

exports.default = getDocsPlugins;