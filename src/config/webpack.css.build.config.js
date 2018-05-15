var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');
console.log(process.env.npm_package_umdVar);

var folder = process.env.npm_config_output_folder || 'dist';
var watchMode = process.env.npm_config_watch_mode || false;
var cssUnique = process.env.npm_config_css_unique == '' ? false : true;
var className = cssUnique ? 'fz__[hash:base64:5]' : '[name]__[local]';
var preact = process.env.npm_config_preact_switch || false;

var publicPath =
  (process.env.npm_config__public_path ||
    '//js.zohostatic.com/zohodeskcomponent' +
      '@' +
      process.env.npm_package_version) + '/dist/';
var alias = {};
if (preact) {
  alias.react = 'preact-compat';
  alias['react-dom'] = 'preact-compat';
}
var appPath = fs.realpathSync(process.cwd());
module.exports = {
  watch: watchMode === 'true',
  entry: {
    main: path.join(appPath, 'src', 'css.js')
    // vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(appPath, folder),
    filename: '[name].js',
    library: process.argv[4] || process.env.npm_package_umdVar || 'Component',
    libraryTarget: 'umd',
    publicPath: publicPath
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin({
      __TEST__: false,
      __DEVELOPMENT__: false,
      __DOCS__: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      __SERVER__: false
    }),
    new ExtractTextPlugin('styles.css'),
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
        use: [
          {
            loader: 'json-loader'
          }
        ]
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
          }
        ],
        include: path.join(appPath, 'src')
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules&localIdentName=' + className
        })
        //['style-loader', 'css-loader?modules&localIdentName=' + className]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/,
        use: ['url-loader?limit=10000&name=images/[name].[ext]']
      },
      {
        test: /\.woff$|\.ttf$|\.eot$/,
        use: ['url-loader?limit=10000&name=fonts/[name].[ext]']
      },
      {
        test: /\.svg$/,
        use: ['url-loader?limit=1&name=fonts/[name].[ext]']
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src'],
            interpolate: 'require'
          }
        }
      }
    ]
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
