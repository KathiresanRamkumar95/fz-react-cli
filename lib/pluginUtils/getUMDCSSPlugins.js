'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUMDCSSPlugins = function getUMDCSSPlugins() {
  var plugins = [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.DefinePlugin({
    __TEST__: false,
    __DEVELOPMENT__: false,
    __DOCS__: false,
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    },
    __SERVER__: false
  }), new _extractTextWebpackPlugin2.default()];
  return plugins;
};

exports.default = getUMDCSSPlugins;