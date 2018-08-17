import path from 'path';
import { getOptions, getServerURL } from '../utils';
import {
  splitChunks,
  getEntries,
  getAlias,
  getInsertIntoFunction
} from '../common';
import { getDevPlugins } from '../pluginUtils';
import { getDevJsLoaders } from '../loaderUtils';

let options = getOptions();
let {
  app: {
    context,
    folder,
    server,
    styleTarget,
    useInsertInto,
    useInsertAt,
    outputFolder
  },
  esLint: { enable: enableEslint }
} = options;

let { hotReload, disableContextURL } = server;

let appPath = process.cwd();
let contextURL = disableContextURL ? '' : context;
let serverUrl = getServerURL(server);

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

let output = {
  path: path.join(appPath, outputFolder),
  filename: 'js/[name].js',
  chunkFilename: 'js/[name].js',
  publicPath: `${[serverUrl, contextURL].filter(a => a).join('/')}/`,
  jsonpFunction: `${context}Jsonp`
};

if (hotReload) {
  output.devtoolModuleFilenameTemplate = info =>
    path.resolve(info.absoluteResourcePath);
}

module.exports = {
  entry: getEntries(options, 'development'),
  devtool: hotReload ? 'cheap-module-source-map' : 'eval',
  mode: 'none',
  output,
  optimization: { splitChunks },
  plugins: getDevPlugins(options),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: getDevJsLoaders(enableEslint),
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
              localIdentName: '[name]__[local]__[hash:base64:5]'
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
