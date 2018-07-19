'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _common = require('../common');

var _pluginUtils = require('../pluginUtils');

var _loaderUtils = require('../loaderUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var server = options.server,
    app = options.app,
    disableContextURL = options.disableContextURL,
    styleTarget = options.styleTarget,
    needEslinting = options.needEslinting,
    useInsertInto = options.useInsertInto,
    useInsertAt = options.useInsertAt;
var folder = app.folder,
    context = app.context;
var hotReload = server.hotReload;

var appPath = process.cwd();
var contextURL = disableContextURL ? '' : context;
var serverUrl = (0, _utils.getServerURL)('htt' + 'ps', server);

if (useInsertInto && useInsertAt) {
  throw new Error('You can\'t use style loader\'s insertInto and insertAt at a same time; Please refer this PR to get more info - https://github.com/webpack-contrib/style-loader/pull/325');
}

var styleLoaderOption = {};

if (useInsertInto) {
  styleLoaderOption.insertInto = (0, _common.getInsertIntoFunction)(styleTarget);
} else if (useInsertAt) {
  var getInsertAt = require('../common/getInsertAt');
  var insertAt = getInsertAt();
  styleLoaderOption.insertAt = insertAt;
}

var output = {
  path: _path2.default.join(appPath, 'build'),
  filename: 'js/[name].js',
  chunkFilename: 'js/[name].js',
  publicPath: [serverUrl, contextURL].filter(function (a) {
    return a;
  }).join('/') + '/',
  jsonpFunction: context + 'Jsonp'
};

if (hotReload) {
  output.devtoolModuleFilenameTemplate = function (info) {
    return _path2.default.resolve(info.absoluteResourcePath);
  };
}

module.exports = {
  entry: (0, _common.getEntries)(options, 'development'),
  devtool: hotReload ? 'cheap-module-source-map' : 'eval',
  mode: 'none',
  output: output,
  optimization: { splitChunks: _common.splitChunks },
  plugins: (0, _pluginUtils.getDevPlugins)(options),
  module: {
    rules: [{
      test: /\.js$/,
      use: (0, _loaderUtils.getDevJsLoaders)(needEslinting),
      include: _path2.default.join(appPath, folder)
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
        options: styleLoaderOption
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]__[hash:base64:5]'
        }
      }]
    }, {
      test: /\.jpe?g$|\.gif$|\.png$/,
      use: ['url-loader?limit=1000&name=./images/[name].[ext]']
    }, {
      test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
      use: ['url-loader?limit=1000&name=./fonts/[name].[ext]']
    }, {
      test: /\.svg$/,
      use: ['url-loader?limit=1&name=./fonts/[name].[ext]']
    }]
  },
  externals: {
    ZC: '$ZC'
  },
  resolve: {
    alias: (0, _common.getAlias)(options),
    modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  },
  resolveLoader: {
    modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  }
};