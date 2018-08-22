import path from 'path';
import { getOptions } from '../utils';
import {
  splitChunks,
  getEntries,
  getAlias,
  getInsertIntoFunction
} from '../common';
import { getProdPlugins } from '../pluginUtils';

let options = getOptions();

let {
  app: {
    context,
    folder,
    styleTarget,
    useInsertInto,
    useInsertAt,
    staticDomainKeys,
    cssUniqueness,
    enableChunkHash,
    outputFolder,
    disableES5Transpile
  }
} = options;

let appPath = process.cwd();
let { images, fonts } = staticDomainKeys;
let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

let { isDevelopment = false } = process;
enableChunkHash = !isDevelopment && enableChunkHash;

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

module.exports = {
  entry: getEntries(options, 'production'),
  devtool: isDevelopment ? 'source-map' : 'hidden-source-map',
  mode: 'none',
  output: {
    path: path.resolve(appPath, outputFolder),
    filename: enableChunkHash ? 'js/[name].[chunkhash:20].js' : 'js/[name].js',
    chunkFilename: enableChunkHash
      ? 'js/[name].[chunkhash:20].js'
      : 'js/[name].js',
    jsonpFunction: `${context}Jsonp`,
    sourceMapFilename: enableChunkHash
      ? 'smap/[name].[chunkhash:20].map'
      : 'smap/[name].map'
  },
  optimization: {
    splitChunks,
    minimize: true
  },
  plugins: getProdPlugins(options),
  module: {
    /* strictExportPresence for break the build when imported module not present in respective file */
    strictExportPresence: true,
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  require.resolve('babel-preset-env'),
                  disableES5Transpile
                    ? {
                      modules: false,
                      useBuiltIns: true,
                      targets: {
                        browsers: [
                          'Chrome >= 60',
                          'Safari >= 10.1',
                          'iOS >= 10.3',
                          'Firefox >= 54',
                          'Edge >= 15'
                        ]
                      }
                    }
                    : { modules: false }
                ],
                require.resolve('babel-preset-react')
              ],
              plugins: disableES5Transpile
                ? [require.resolve('../utils/removeTestIds')]
                : [
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
            loader: 'style-loader',
            options: styleLoaderOption
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: `${className}`,
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: enableChunkHash
                ? './images/[name].[hash:20].[ext]'
                : './images/[name].[ext]',
              publicPath: url =>
                `staticDomain[${JSON.stringify(images)}] + ${JSON.stringify(
                  url
                )}`,
              publicPathStringify: false,
              fallback: path.join(__dirname, '..', 'loaders', 'fileLoader.js')
            }
          }
        ]
      },
      {
        test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: enableChunkHash
                ? './fonts/[name].[hash:20].[ext]'
                : './fonts/[name].[ext]',
              publicPath: url =>
                `staticDomain[${JSON.stringify(fonts)}] + ${JSON.stringify(
                  url
                )}`,
              publicPathStringify: false,
              fallback: path.join(__dirname, '..', 'loaders', 'fileLoader.js')
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1,
              name: enableChunkHash
                ? './fonts/[name].[hash:20].[ext]'
                : './fonts/[name].[ext]',
              publicPath: url =>
                `staticDomain[${JSON.stringify(fonts)}] + ${JSON.stringify(
                  url
                )}`,
              publicPathStringify: false,
              fallback: path.join(__dirname, '..', 'loaders', 'fileLoader.js')
            }
          }
        ]
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
