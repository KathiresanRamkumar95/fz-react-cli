import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { getOptions, requireOptions } from '../utils';
import defaultOptions from '../defaultOptions';
import { getAlias } from '../common';
import { getUMDCSSPlugins } from '../pluginUtils';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let {
  cssUniqueness,
  app,
  outputFolder,
  watchUMDComponent,
  umdVar,
  cssUMDPublicPath,
  packageVersion
} = options;
let { folder } = app;

let appPath = process.cwd();
let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

let publicPath = `${cssUMDPublicPath ||
  `${'//js.zohostatic.com/support/zohodeskcomponent@'}${packageVersion}`}/${outputFolder}/`;

module.exports = {
  watch: watchUMDComponent,
  entry: {
    main: path.join(appPath, folder, 'css.js')
  },
  output: {
    path: path.resolve(appPath, outputFolder),
    filename: '[name].js',
    library: umdVar,
    libraryTarget: 'umd',
    publicPath
  },
  optimization: {
    minimize: true
  },
  plugins: getUMDCSSPlugins(options),
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
        include: path.join(appPath, 'src')
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `css-loader?modules&localIdentName=${className}`
        })
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
