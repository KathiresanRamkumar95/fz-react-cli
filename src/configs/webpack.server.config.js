import path from 'path';
import { getOptions, requireOptions } from '../utils';
import defaultOptions from '../defaultOptions';
import { getAlias } from '../common';
import { getServerPlugins } from '../pluginUtils';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { app, cssUniqueness, needChunkHash, outputFolder, watchMode } = options;
let { folder, context } = app;
let appPath = process.cwd();
let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

module.exports = {
  entry: {
    main: path.join(appPath, folder, 'server.js')
  },
  devtool: 'source-map',
  mode: 'none',
  target: 'node',
  output: {
    path: path.resolve(appPath, outputFolder, 'js'),
    filename: needChunkHash ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: needChunkHash ? '[name].[chunkhash].js' : '[name].js',
    jsonpFunction: `${context}Jsonp`,
    sourceMapFilename: 'smap/[name].map'
  },
  watch: watchMode,
  optimization: {
    minimize: true
  },
  plugins: getServerPlugins(),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [require.resolve('babel-preset-env'), { modules: false }],
                require.resolve('babel-preset-react')
              ],
              plugins: [
                require.resolve('../utils/removeTestIds'),
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
        include: path.join(appPath, folder)
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'isomorphic-style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: className,
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/,
        use: [
          `url-loader?limit=1000&name=${
            needChunkHash
              ? './images/[name].[hash].[ext]'
              : './images/[name].[ext]'
          }`
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
    alias: getAlias(options),
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
