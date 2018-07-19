import path from 'path';
import { getOptions, requireOptions } from '../utils';
import defaultOptions from '../defaultOptions';
import { getAlias, getInsertIntoFunction } from '../common';
import { getUMDComponentPlugins } from '../pluginUtils';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let {
  cssUniqueness,
  app,
  isHtml,
  outputFolder,
  watchUMDComponent,
  umdVar,
  isDocs,
  useInsertInto,
  useInsertAt,
  styleTarget
} = options;
let { folder } = app;

let appPath = process.cwd();
let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

if (useInsertInto && useInsertAt) {
  throw new Error(
    'You can\'t use style loader\'s insertInto and insertAt at a same time; Please refer this PR to get more info - https://github.com/webpack-contrib/style-loader/pull/325'
  );
}

let styleLoaderOption = {};

if (useInsertInto) {
  styleLoaderOption.insertInto = getInsertIntoFunction(styleTarget);
} else if (useInsertAt) {
  let getInsertAt = require('../common/getInsertAt');
  let insertAt = getInsertAt();
  styleLoaderOption.insertAt = insertAt;
}

// let publicPath =
//   `${process.env.npm_config_public_path ||
//     `${'//js.zohostatic.com/support/zohodeskcomponent' +
//       '@'}${
//       process.env.npm_package_version}`  }/dist/`;

module.exports = {
  watch: watchUMDComponent,
  entry: {
    main: path.join(appPath, folder, isHtml ? 'html.js' : 'index.js')
  },
  output: {
    path: path.join(appPath, outputFolder),
    filename: '[name].js',
    library: umdVar,
    libraryTarget: 'umd'
  },
  mode: 'production',
  optimization: {
    minimize: true
  },
  plugins: getUMDComponentPlugins(options),
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
        use: [
          { loader: 'style-loader', options: styleLoaderOption },
          `css-loader?modules&localIdentName=${className}`
        ]
      },
      isDocs
        ? {
          test: /\.docs\.js$/,
          use: require.resolve('../docsLoader.js'),
          exclude: /node_modules/
        }
        : {},
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
