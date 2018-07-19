'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _common = require('../common');

var _pluginUtils = require('../pluginUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var cssUniqueness = options.cssUniqueness,
    app = options.app,
    isHtml = options.isHtml,
    outputFolder = options.outputFolder,
    watchUMDComponent = options.watchUMDComponent,
    umdVar = options.umdVar,
    isDocs = options.isDocs,
    useInsertInto = options.useInsertInto,
    useInsertAt = options.useInsertAt,
    styleTarget = options.styleTarget;
var folder = app.folder;


var appPath = process.cwd();
var className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

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

// let publicPath =
//   `${process.env.npm_config_public_path ||
//     `${'//js.zohostatic.com/support/zohodeskcomponent' +
//       '@'}${
//       process.env.npm_package_version}`  }/dist/`;

module.exports = {
  watch: watchUMDComponent,
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
    minimize: false
  },
  plugins: (0, _pluginUtils.getUMDComponentPlugins)(options),
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