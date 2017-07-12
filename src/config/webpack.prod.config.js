var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var folder = process.env.npm_config_output_folder || 'build';
var appFolder = process.env.npm_config_app_folder || 'src';
var mig = process.env.npm_config_react_mig || false;

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
      'babel-polyfill',
      path.join(appPath, appFolder, mig ? 'migration.js' : 'index.js')
    ]
  },
  output: {
    path: path.resolve(appPath, folder),
    filename: 'js/[name].js'
  },
  plugins: [
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
      __TEST__: false,
      __DEVELOPMENT__: false,
      __DOCS__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
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
              plugins: [require.resolve('../removeProperties')],
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
  }
};

/*


function RuntimePublicPath(options) {
  this.options = options;
}
RuntimePublicPath.prototype.apply = function(compiler) {
  var runtimePublicPathStr = this.options && this.options.runtimePublicPath;
  if (!runtimePublicPathStr) {
    console.error(
      'RuntimePublicPath: no option.runtimePublicPath is specified. This plugin will do nothing.'
    );
    return;
  }
  compiler.plugin('this-compilation', function(compilation) {
    compilation.mainTemplate.plugin('require-extensions', function(
      source,
      chunk,
      hash
    ) {
      console.log(this.requireFn);
      var buf = [];
      buf.push(source);
      buf.push('');
      buf.push('// Dynamic assets path override ');
      buf.push('var e=' + this.requireFn + '.e;');
      buf.push(
        this.requireFn +
          '.e = function requireEnsure(chunkId) {' +
          runtimePublicPathStr +
          ';return e(chunkId);} '
      );
      return this.asString(buf);
    });
  });
};

new RuntimePublicPath({ runtimePublicPath: 'publicPath(chunkId)' })
*/
