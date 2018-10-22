'use strict';

//$Id$//
let path = require('path');
let webpack = require('webpack');
let CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
let scriptLoader = require('../scriptLoader');
let getIP = require('../utils/ipaddress');
let i18nPlugin = require('../i18nPlugin');
let host = process.env.npm_config_server_host || getIP();
let port = process.env.npm_config_server_port || '9090';
let url = `${'htt' + 'ps://'}${host}:${port}`;
let context = process.env.npm_config_server_context || 'app';
let appFolder = process.env.npm_config_app_folder || 'src';
let mig = process.env.npm_config_react_mig || false;
let preact = process.env.npm_config_preact_switch || false;
let widgetEnable = process.env.npm_config_widget_enable || false;
let isDisableContextURL = process.env.npm_config_disable_contexturl || false;

let useInsertInto = process.env.npm_config_use_insertInto || false;
let useInsertAt = process.env.npm_config_use_insertAt || false;

if (useInsertInto && useInsertAt) {
  throw new Error('You can\'t use style loader\'s insertInto and insertAt at a same time; Please refer this PR to get more info - https://github.com/webpack-contrib/style-loader/pull/325');
}

let styleLoaderOption = {};

if (useInsertInto) {
  styleLoaderOption.insertInto = function () {
    if (window.styleTarget) {
      let element = document.getElementById(window.styleTarget);
      return element.shadowRoot ? element.shadowRoot : element;
    }
    return document.head;
  };
} else if (useInsertAt) {
  let getInsertAt = require('../utils/getInsertAt');
  let insertAt = getInsertAt();
  styleLoaderOption.insertAt = insertAt;
}

let contextURL = context;
if (isDisableContextURL) {
  contextURL = '';
}
let alias = {};
if (preact) {
  alias.react = 'preact-compat';
  alias[ 'react-dom' ] = 'preact-compat';
}
let fs = require('fs');
let appPath = fs.realpathSync(process.cwd());
let isVendor = function isVendor(_ref) {
  let userRequest = _ref.userRequest;
  return userRequest && userRequest.indexOf('node_modules') >= 0;
};
let isReact = function isReact(_ref) {
  let userRequest = _ref.userRequest;
  return userRequest && userRequest.indexOf(`node_modules${path.sep}react`) >= 0;
};
let hookEntries = [ 'babel-polyfill' ];
if (preact) {
  hookEntries.push('preact/devtools');
}
let entry = {
  main: [ `${require.resolve('../hmrClient')}?hmrPath=${url}` ].concat(hookEntries, [ `${require.resolve('../wmsClient')}?wmsPath=wss://${host}:${port}`, require.resolve('react-error-overlay'), path.join(appPath, appFolder, mig ? 'migration.js' : 'index.js') ])
};
if (widgetEnable) {
  entry.widget = path.join(appPath, appFolder, 'widget.js');
}
module.exports = {
  entry,
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(appPath, 'build'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: function devtoolModuleFilenameTemplate(info) {
      return path.resolve(info.absoluteResourcePath);
    },
    publicPath: [ url, contextURL, 'js' ].filter(a => a).join('/'),
    jsonpFunction: `jsonp${context}`
  },
  plugins: [ new scriptLoader(),
    new CaseSensitivePathsPlugin(),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: [ 'main' ],
      minChunks: isVendor
    }), new webpack.optimize.CommonsChunkPlugin({
      name: 'react.vendor',
      chunks: [ 'vendor' ],
      minChunks: isReact
    }), new webpack.DefinePlugin({
      __CLIENT__: true,
      __TEST__: false,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true,
      __DOCS__: false
    }) ],
  module: {
    rules: [ {
      include: /\.json$/,
      use: [ 'json-loader' ]
    }, {
      test: /\.jsx|\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [ [ require.resolve('babel-preset-es2015'), { modules: false } ], require.resolve('babel-preset-react') ],
          cacheDirectory: true
        } 
      } ],
      include: path.join(appPath, appFolder)
    }, {
      test: /\.css$/,
      use: [ {
        loader: 'style-loader',
        options: styleLoaderOption
      }, 'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]' ]
    }, {
      test: /\.jpe?g$|\.gif$|\.png$/,
      use: [ 'url-loader?limit=1000&name=./images/[name].[ext]' ]
    }, {
      test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
      use: [ 'url-loader?limit=1000&name=./fonts/[name].[ext]' ]
    }, {
      test: /\.svg$/,
      use: [ 'url-loader?limit=1&name=./fonts/[name].[ext]' ]
    } ]
  },
  externals: {
    ZC: '$ZC'
  },
  resolve: {
    alias,
    modules: [ path.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules' ]
  },
  resolveLoader: {
    modules: [ path.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules' ]
  }
};