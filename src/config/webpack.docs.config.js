'use strict';

var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var getIP = require('../utils/ipaddress');
var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || '9292';
var componentPath = process.env.npm_config_server_componentPath || null;
var url = 'htt' + 'p://' + host + ':' + port;
var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());
var moduleStatsPlugin = require('../moduleStatsPlugin');
var preact = process.env.npm_config_preact_switch || false;
var alias = {};
if (preact) {
  alias.react = 'preact-compat';
  alias['react-dom'] = 'preact-compat';
}
module.exports = {
  entry: {
    main: [
      'babel-polyfill',
      path.join(appPath, componentPath || 'src', 'index.js')
    ],
    vendor: ['react', 'react-dom', 'redux', 'react-redux']
  },
  devtool: 'eval',
  output: {
    path: path.resolve(appPath, 'build'),
    filename: '[name].js',
    publicPath: url + '/docs/js',
    library: 'Component',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.DefinePlugin({
      __TEST__: false,
      __DEVELOPMENT__: true,
      __DOCS__: true
    }),
    new moduleStatsPlugin({ filename: 'moduleStats.js' })
  ],
  module: {
    rules: [
      {
        include: /\.json$/,
        use: ['json-loader']
      },
      {
        test: /\.jsx|\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [require.resolve('babel-preset-es2015'), { modules: false }],
                require.resolve('babel-preset-react')
              ],
              cacheDirectory: true
            }
          }
        ],
        include: path.join(appPath, componentPath || 'src')
      },
      {
        test: /\.docs\.jsx$|\.docs\.js$/,
        use: require.resolve('../docsLoader.js'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]'
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/,
        use: ['url-loader?limit=10000&name=./images/[name].[ext]']
      },
      {
        test: /\.woff$|\.ttf$|\.eot$/,
        use: ['url-loader?limit=10000&name=./fonts/[name].[ext]']
      },
      {
        test: /\.svg$/,
        use: ['url-loader?limit=1&name=./fonts/[name].[ext]']
      }
    ]
  },
  externals: {
    ZC: '$ZC'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      react$: path.resolve(__dirname, '..', 'hook', 'proptypes.js'),
      'prop-types$': path.resolve(__dirname, '..', 'hook', 'proptypes1.js')
    },
    modules: [
      path.resolve(__dirname, '..', '..', 'node_modules'),
      'node_modules'
    ]
  },
  resolveLoader: {
    alias: alias,
    modules: [
      path.resolve(__dirname, '..', '..', 'node_modules'),
      'node_modules'
    ]
  }
};
