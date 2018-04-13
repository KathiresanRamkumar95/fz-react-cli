import path from 'path';
import { getOptions, requireOptions, getServerURL } from '../utils';
import defaultOptions from '../defaultOptions';
import { getAlias } from '../common';
import { getDocsPlugins } from '../pluginUtils';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { docsServer, cssUniqueness, componentFolder } = options;
let appPath = process.cwd();
let serverUrl = getServerURL('htt' + 'ps', docsServer);

let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

module.exports = {
  entry: {
    main: path.join(appPath, componentFolder, 'index.js'),
    vendor: ['react', 'react-dom', 'redux', 'react-redux']
  },
  devtool: 'eval',
  mode: 'none',
  output: {
    path: path.join(appPath, 'build'),
    filename: '[name].js',
    publicPath: `${serverUrl}/docs/js`,
    library: 'Component',
    libraryTarget: 'umd'
  },
  plugins: getDocsPlugins(),
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
        include: path.join(appPath, componentFolder)
      },
      {
        test: /\.docs\.js$/,
        use: require.resolve('../loaders/docsLoader.js'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: className
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/,
        use: ['url-loader?limit=1000&name=./images/[name].[ext]']
      },
      {
        test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
        use: ['url-loader?limit=1000&name=./fonts/[name].[ext]']
      },
      {
        test: /\.svg$/,
        use: ['url-loader?limit=1&name=./fonts/[name].[ext]']
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
  externals: {
    ZC: '$ZC'
  },
  resolve: {
    alias: Object.assign(getAlias(options), {
      'prop-types$': path.resolve(
        __dirname,
        '..',
        'hooks',
        'docsProptypeHook.js'
      )
    }),
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
