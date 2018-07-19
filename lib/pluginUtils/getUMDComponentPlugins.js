'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUMDComponentPlugins = function getUMDComponentPlugins(options) {
  var isDocs = options.isDocs;

  var plugins = [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.DefinePlugin({
    __TEST__: false,
    __DEVELOPMENT__: false,
    __DOCS__: isDocs ? true : false,
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    },
    __SERVER__: false
  })];
  return plugins;
};

exports.default = getUMDComponentPlugins;