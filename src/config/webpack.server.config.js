var path = require('path');
var webpack = require('webpack');
var cp = require('child_process');
var WebpackMd5Hash = require('webpack-md5-hash');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var ChunkManifestPlugin = require('../ChunkManifestPlugin');
var i18nPlugin = require('../i18nPlugin');
var folder = process.env.npm_config_output_folder || 'lib';
var appFolder = process.env.npm_config_app_folder || 'src';
var context = process.env.npm_config_server_context || 'app';
var cssUnique = process.env.npm_config_css_unique == '' ? false : true;
// var mig = process.env.npm_config_react_mig || false;
var hash = process.env.npm_config_hash_enable || false;
var className = cssUnique ? 'fz__[hash:base64:5]' : '[name]__[local]';
var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());
var preact = process.env.npm_config_preact_switch || false;
var alias = {};
if (preact) {
  alias.react = 'preact-compat';
  alias['react-dom'] = 'preact-compat';
}

// var isVendor = function isVendor(_ref) {
//   var userRequest = _ref.userRequest;
//   return userRequest && userRequest.indexOf('node_modules') >= 0;
// };
// var isReact = function isReact(_ref) {
//   var userRequest = _ref.userRequest;
//   return (
//     userRequest && userRequest.indexOf('node_modules' + path.sep + 'react') >= 0
//   );
// };
module.exports = {
  target: 'node',
  entry: {
    main: path.join(appPath, appFolder, 'server.js')
  },
  output: {
    path: path.resolve(appPath, folder),
    filename: hash ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    chunkFilename: hash ? 'js/[name].[chunkhash].js' : 'js/[name].js'
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    /*new i18nPlugin({
      appPath: appPath,
      context: context
    }),*/
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   chunks: ['main'],
    //   minChunks: isVendor
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'react.vendor',
    //   chunks: ['vendor'],
    //   minChunks: isReact
    // }),
    new webpack.DefinePlugin({
      __TEST__: false,
      __DEVELOPMENT__: true,
      __DOCS__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      __SERVER__: true
    }),
    new WebpackMd5Hash(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
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
              plugins: [
                require.resolve('../removeProperties'),
                [
                  require.resolve('babel-plugin-transform-runtime'),
                  {
                    helpers: true,
                    polyfill: true,
                    regenerator: false,
                    moduleName: 'babel-runtime'
                  }
                ]
              ],
              cacheDirectory: true
            }
          } /*,
          {
            loader: require.resolve('../i18nFilterLoader.js')
          }*/
        ],
        include: path.join(appPath, appFolder)
      },
      {
        test: /\.css$/,
        use: [
          'isomorphic-style-loader',
          `css-loader?modules&localIdentName=${className}`
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/,
        use: [
          `url-loader?limit=1000&name=${hash
            ? './images/[name].[hash].[ext]'
            : './images/[name].[ext]'}`
        ]
      },
      {
        test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
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
    alias: alias,
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
