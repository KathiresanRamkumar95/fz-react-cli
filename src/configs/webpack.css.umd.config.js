import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { getOptions } from '../utils';
import { getAlias } from '../common';
import { getUMDCSSPlugins } from '../pluginUtils';

let options = getOptions();
let {
  umd: {
    css: { umdVar, watch, outputFolder, cssUniqueness, folder, publicPath }
  },
  packageVersion
} = options;

let appPath = process.cwd();
let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

let publicPathStr = `${publicPath ||
  `${'//js.zohostatic.com/support/zohodeskcomponent@'}${packageVersion}`}/${outputFolder}/`;

module.exports = {
  watch: watch,
  entry: {
    main: path.join(appPath, folder, 'css.js')
  },
  output: {
    path: path.resolve(appPath, outputFolder),
    filename: '[name].js',
    library: umdVar,
    libraryTarget: 'umd',
    publicPath: publicPathStr
  },
  mode: 'production',
  optimization: {
    minimize: true
  },
  plugins: getUMDCSSPlugins(),
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
