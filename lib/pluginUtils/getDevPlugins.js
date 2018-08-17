'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _plugins = require('../plugins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDevPlugins = function getDevPlugins(options) {
  var plugins = [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.IgnorePlugin(/^\.\/domain$/, /moment$/), new _webpack2.default.DefinePlugin({
    __CLIENT__: true,
    __TEST__: false,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __LOCAL_PRODUCTION__: false,
    __DEVTOOLS__: true,
    __DOCS__: false
  })];

  var folder = options.app.folder,
      unusedFiles = options.unusedFiles;


  if (unusedFiles.enable) {
    plugins.push(new _plugins.UnusedFilesFindPlugin(Object.assign(unusedFiles, {
      origin: _path2.default.join(process.cwd(), folder)
    })));
  }

  return plugins;
};

exports.default = getDevPlugins;