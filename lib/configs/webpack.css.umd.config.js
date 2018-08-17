'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _utils = require('../utils');

var _common = require('../common');

var _pluginUtils = require('../pluginUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _utils.getOptions)();
var _options$umd$css = options.umd.css,
    umdVar = _options$umd$css.umdVar,
    watch = _options$umd$css.watch,
    outputFolder = _options$umd$css.outputFolder,
    cssUniqueness = _options$umd$css.cssUniqueness,
    folder = _options$umd$css.folder,
    publicPath = _options$umd$css.publicPath,
    packageVersion = options.packageVersion;


var appPath = process.cwd();
var className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

var publicPathStr = (publicPath || '//js.zohostatic.com/support/zohodeskcomponent@' + packageVersion) + '/' + outputFolder + '/';

module.exports = {
  watch: watch,
  entry: {
    main: _path2.default.join(appPath, folder, 'css.js')
  },
  output: {
    path: _path2.default.resolve(appPath, outputFolder),
    filename: '[name].js',
    library: umdVar,
    libraryTarget: 'umd',
    publicPath: publicPathStr
  },
  mode: 'production',
  optimization: {
    minimize: true
  },
  plugins: (0, _pluginUtils.getUMDCSSPlugins)(),
  module: {
    rules: [{
      include: /\.json$/,
      use: [{
        loader: 'json-loader'
      }]
    }, {
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [[require.resolve('babel-preset-env'), { modules: false }], require.resolve('babel-preset-react')],
          plugins: [[require.resolve('babel-plugin-transform-runtime'), {
            helpers: true,
            polyfill: true,
            regenerator: false,
            moduleName: 'babel-runtime'
          }]],
          cacheDirectory: true
        }
      }],
      include: _path2.default.join(appPath, 'src')
    }, {
      test: /\.css$/,
      use: _extractTextWebpackPlugin2.default.extract({
        fallback: 'style-loader',
        use: 'css-loader?modules&localIdentName=' + className
      })
    }, {
      test: /\.jpe?g$|\.gif$|\.png$/,
      use: ['url-loader?limit=10000&name=./images/[name].[ext]']
    }, {
      test: /\.woff$|\.ttf$|\.eot$/,
      use: ['url-loader?limit=10000&name=./fonts/[name].[ext]']
    }, {
      test: /\.svg$/,
      use: ['url-loader?limit=1&name=./fonts/[name].[ext]']
    }, {
      test: /\.html$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: [':data-src'],
          interpolate: 'require'
        }
      }
    }]
  },
  resolve: {
    alias: (0, _common.getAlias)(options),
    modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  },
  resolveLoader: {
    modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  }
};