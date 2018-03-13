'use strict';

//$Id$//
var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var UnusedWebpackPlugin = require('unused-webpack-plugin');
var getIP = require('../utils/ipaddress');
var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || '9090';
var url = 'htt' + 'ps://' + host + ':' + port;
var context = process.env.npm_config_server_context || 'app';
var appFolder = process.env.npm_config_app_folder || 'src';
var mig = process.env.npm_config_react_mig || false;
var preact = process.env.npm_config_preact_switch || false;
var widgetEnable = process.env.npm_config_widget_enable || false;
var isDisableContextURL = process.env.npm_config_disable_contexturl || false;
var contextURL = context;
if (isDisableContextURL) {
  contextURL = '';
}

var i18nPlugin = require('../i18nPlugin');
var alias = {};
if (preact) {
  alias.react = 'preact-compat';
  alias['react-dom'] = 'preact-compat';
  // alias['fz-i18n'] = require.resolve('../../../fz-i18n');
}
//var srcPath=path.resolve(__dirname, 'app');
var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());
var isVendor = function isVendor(_ref) {
  var userRequest = _ref.userRequest;
  return userRequest && userRequest.indexOf('node_modules') >= 0;
};
var isReact = function isReact(_ref) {
  var userRequest = _ref.userRequest;
  return userRequest && userRequest.indexOf('node_modules' + path.sep + 'react') >= 0;
};
var hookEntries = ['babel-polyfill'];
if (preact) {
  hookEntries.push('preact/devtools');
}
var entry = {
  main: [].concat(hookEntries, [require.resolve('../wmsClient') + ('?wmsPath=wss://' + host + ':' + port), path.join(appPath, appFolder, mig ? 'migration.js' : 'index.js')])
};
if (widgetEnable) {
  entry.widget = path.join(appPath, appFolder, 'widget.js');
}
entry.docs = path.join(appPath, appFolder, 'components', 'index.js');
module.exports = {
  entry: entry,
  devtool: 'eval',
  output: {
    path: path.resolve(appPath, 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: [url, contextURL, 'js'].filter(function (a) {
      return a;
    }).join('/'),
    jsonpFunction: 'jsonp' + context
  },
  plugins: [new CaseSensitivePathsPlugin(),
  // new webpack.optimize.ModuleConcatenationPlugin(),
  /*  new i18nPlugin({
    appPath: appPath,
    context: context
  }),*/
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    chunks: ['main'],
    minChunks: isVendor
  }), new webpack.optimize.CommonsChunkPlugin({
    name: 'react.vendor',
    chunks: ['vendor'],
    minChunks: isReact
  }), new webpack.DefinePlugin({
    __CLIENT__: true,
    __TEST__: false,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true,
    __DOCS__: false
  }), new UnusedWebpackPlugin({
    // Source directories
    directories: [path.join(appPath, 'src')],
    // Exclude patterns
    exclude: ['*.docs.js', '*.spec.js', '*.test.js'],
    // Root directory (optional)
    root: __dirname
  })],
  module: {
    rules: [{
      include: /\.json$/,
      use: ['json-loader']
    }, {
      test: /\.jsx|\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [[require.resolve('babel-preset-es2015'), { modules: false }], require.resolve('babel-preset-react')],
          cacheDirectory: true
        } /*,
                  {
                      loader: require.resolve('../i18nFilterLoader.js')
                  }*/
      }],
      include: path.join(appPath, appFolder)
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
        options: {
          insertInto: function insertInto() {
            if (window.styleTarget) {
              var element = document.getElementById(window.styleTarget);
              return element.shadowRoot ? element.shadowRoot : element;
            }
            return document.head;
          }
        }
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
    alias: alias,
    modules: [path.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  }
};