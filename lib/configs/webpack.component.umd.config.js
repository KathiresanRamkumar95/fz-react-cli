'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var _common = require('../common');

var _pluginUtils = require('../pluginUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _utils.getOptions)();

var _options$umd$componen = options.umd.component,
    umdVar = _options$umd$componen.umdVar,
    isHtml = _options$umd$componen.isHtml,
    isDocs = _options$umd$componen.isDocs,
    watch = _options$umd$componen.watch,
    outputFolder = _options$umd$componen.outputFolder,
    cssUniqueness = _options$umd$componen.cssUniqueness,
    folder = _options$umd$componen.folder;


var appPath = process.cwd();
var className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

var styleLoaderOption = {};

// let publicPath =
//   `${process.env.npm_config_public_path ||
//     `${'//js.zohostatic.com/support/zohodeskcomponent' +
//       '@'}${
//       process.env.npm_package_version}`  }/dist/`;

module.exports = {
  watch: watch,
  entry: {
    main: _path2.default.join(appPath, folder, isHtml ? 'html.js' : 'index.js')
  },
  output: {
    path: _path2.default.join(appPath, outputFolder),
    filename: '[name].js',
    library: umdVar,
    libraryTarget: 'umd'
  },
  mode: 'production',
  optimization: {
    minimize: true
  },
  plugins: (0, _pluginUtils.getUMDComponentPlugins)(isDocs),
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
      use: [{ loader: 'style-loader', options: styleLoaderOption }, 'css-loader?modules&localIdentName=' + className]
    }, isDocs ? {
      test: /\.docs\.js$/,
      use: require.resolve('../docsLoader.js'),
      exclude: /node_modules/
    } : {}, {
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