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
  var _options$app = options.app,
      enableChunkHash = _options$app.enableChunkHash,
      manifestReplacer = _options$app.manifestReplacer,
      manifestFileName = _options$app.manifestFileName,
      bundleAnalyze = _options$app.bundleAnalyze,
      optimize = _options$app.optimize;


  var plugins = [new _webpack2.default.optimize.ModuleConcatenationPlugin(), new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /moment$/), new _webpack2.default.DefinePlugin({
    __TEST__: false,
    __DEVELOPMENT__: false,
    __LOCAL_PRODUCTION__: process.isDevelopment,
    __DOCS__: false,
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    },
    __SERVER__: false
  }), new _plugins.RuntimePublicPathPlgin({
    publicPathCallback: 'window.setPublicPath'
  })];

  if (!process.isDevelopment) {
    plugins.push(new _plugins.SourceMapHookPlugin({
      optimize: optimize
    }));

    plugins.push(new _plugins.ChunkManifestReplacePlugin({
      replacer: manifestReplacer,
      fileName: manifestFileName,
      enableChunkHash: enableChunkHash
    }));

    if (bundleAnalyze) {
      plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin({
        analyzerMode: 'static'
      }));
    }
  }

  return plugins;
};

exports.default = getProdPlugins;