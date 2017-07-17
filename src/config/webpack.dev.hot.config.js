//$Id$//
var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var getIP = require('../utils/ipaddress');
var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || '9090';
var url = 'htt' + 'ps://' + host + ':' + port;
var context = process.env.npm_config_server_context || 'app';
var appFolder = process.env.npm_config_app_folder || 'src';
var mig = process.env.npm_config_react_mig || false;

//var srcPath=path.resolve(__dirname, 'app');
var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());
var isVendor = function isVendor(_ref) {
  var userRequest = _ref.userRequest;
  return userRequest && userRequest.indexOf('node_modules') >= 0;
};
var isReact = function isReact(_ref) {
  var userRequest = _ref.userRequest;
  return userRequest && userRequest.indexOf('node_modules/react') >= 0;
};
module.exports = {
  entry: {
    main: [
      require.resolve('../hmrClient'),
      'babel-polyfill',
      require.resolve('../wmsClient'),
      require.resolve('react-error-overlay'),
      path.join(appPath, appFolder, mig ? 'migration.js' : 'index.js')
    ]
  },
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(appPath, 'build'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath),
    publicPath: [url, context, 'js'].join('/')
  },
  plugins: [
    //write hot module plugin like webpack-dev-server  server.js    new webpack.HotModuleReplacementPlugin(),

    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['main'],
      minChunks: isVendor
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'react.vendor',
      chunks: ['vendor'],
      minChunks: isReact
    }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __TEST__: false,
      __SERVER__: true,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true,
      __DOCS__: false
    })
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
        include: path.join(appPath, appFolder)
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
        use: ['url-loader?limit=1000&name=./images/[name].[ext]']
      },
      {
        test: /\.woff$|\.ttf$|\.eot$/,
        use: ['url-loader?limit=1000&name=./fonts/[name].[ext]']
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
    modules: [
      path.resolve(__dirname, '..', '..', 'node_modules'),
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, '..', '..', 'node_modules'),
      'node_modules'
    ]
  }
};
