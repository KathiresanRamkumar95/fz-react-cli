'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var _common = require('../common');

var _pluginUtils = require('../pluginUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _utils.getOptions)();

var _options$app = options.app,
    context = _options$app.context,
    folder = _options$app.folder,
    styleTarget = _options$app.styleTarget,
    useInsertInto = _options$app.useInsertInto,
    useInsertAt = _options$app.useInsertAt,
    staticDomainKeys = _options$app.staticDomainKeys,
    cssUniqueness = _options$app.cssUniqueness,
    enableChunkHash = _options$app.enableChunkHash,
    outputFolder = _options$app.outputFolder;


var appPath = process.cwd();
var images = staticDomainKeys.images,
    fonts = staticDomainKeys.fonts;

var className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

var _process = process,
    _process$isDevelopmen = _process.isDevelopment,
    isDevelopment = _process$isDevelopmen === undefined ? false : _process$isDevelopmen;

enableChunkHash = !isDevelopment && enableChunkHash;

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

module.exports = {
  entry: (0, _common.getEntries)(options, 'production'),
  devtool: isDevelopment ? 'eval' : 'hidden-source-map',
  mode: 'none',
  output: {
    path: _path2.default.resolve(appPath, outputFolder),
    filename: enableChunkHash ? 'js/[name].[chunkhash:20].js' : 'js/[name].js',
    chunkFilename: enableChunkHash ? 'js/[name].[chunkhash:20].js' : 'js/[name].js',
    jsonpFunction: context + 'Jsonp',
    sourceMapFilename: enableChunkHash ? 'smap/[name].[chunkhash:20].map' : 'smap/[name].map'
  },
  optimization: {
    splitChunks: _common.splitChunks,
    minimize: true
  },
  plugins: (0, _pluginUtils.getProdPlugins)(options),
  module: {
    /* strictExportPresence for break the build when imported module not present in respective file */
    strictExportPresence: true,
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [[require.resolve('babel-preset-env'), { modules: false }], require.resolve('babel-preset-react')],
          plugins: [require.resolve('../utils/removeTestIds'), [require.resolve('babel-plugin-transform-runtime'), {
            helpers: true,
            polyfill: true,
            regenerator: false,
            moduleName: 'babel-runtime'
          }]],
          cacheDirectory: true
        }
      }],
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
          localIdentName: '' + className,
          minimize: true
        }
      }]
    }, {
      test: /\.jpe?g$|\.gif$|\.png$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: enableChunkHash ? './images/[name].[hash:20].[ext]' : './images/[name].[ext]',
          publicPath: function publicPath(url) {
            return 'staticDomain[' + JSON.stringify(images) + '] + ' + JSON.stringify(url);
          },
          publicPathStringify: false,
          fallback: _path2.default.join(__dirname, '..', 'loaders', 'fileLoader.js')
        }
      }]
    }, {
      test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: enableChunkHash ? './fonts/[name].[hash:20].[ext]' : './fonts/[name].[ext]',
          publicPath: function publicPath(url) {
            return 'staticDomain[' + JSON.stringify(fonts) + '] + ' + JSON.stringify(url);
          },
          publicPathStringify: false,
          fallback: _path2.default.join(__dirname, '..', 'loaders', 'fileLoader.js')
        }
      }]
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 1,
          name: enableChunkHash ? './fonts/[name].[hash:20].[ext]' : './fonts/[name].[ext]',
          publicPath: function publicPath(url) {
            return 'staticDomain[' + JSON.stringify(fonts) + '] + ' + JSON.stringify(url);
          },
          publicPathStringify: false,
          fallback: _path2.default.join(__dirname, '..', 'loaders', 'fileLoader.js')
        }
      }]
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