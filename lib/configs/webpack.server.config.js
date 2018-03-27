'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _common = require('../common');

var _pluginUtils = require('../pluginUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var app = options.app,
    cssUniqueness = options.cssUniqueness,
    needChunkHash = options.needChunkHash,
    outputFolder = options.outputFolder,
    watchMode = options.watchMode;
var folder = app.folder,
    context = app.context;

var appPath = process.cwd();
var className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

module.exports = {
	entry: {
		main: _path2.default.join(appPath, folder, 'server.js')
	},
	devtool: 'source-map',
	mode: 'none',
	target: 'node',
	output: {
		path: _path2.default.resolve(appPath, outputFolder, 'js'),
		filename: needChunkHash ? '[name].[chunkhash].js' : '[name].js',
		chunkFilename: needChunkHash ? '[name].[chunkhash].js' : '[name].js',
		jsonpFunction: context + 'Jsonp',
		sourceMapFilename: 'smap/[name].map'
	},
	watch: watchMode,
	optimization: {
		minimize: true
	},
	plugins: (0, _pluginUtils.getServerPlugins)(),
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [[require.resolve('babel-preset-env'), { modules: false }], require.resolve('babel-preset-react')],
					plugins: [require.resolve('../utils/removeTestIds'), [require.resolve('babel-plugin-transform-runtime'), {
						helpers: true,
						polyfill: true,
						regenerator: false,
						moduleName: 'babel-runtime'
					}]],
					cacheDirectory: true
				}
			}],
			include: _path2.default.join(appPath, folder)
		}, {
			test: /\.css$/,
			use: [{
				loader: 'isomorphic-style-loader'
			}, {
				loader: 'css-loader',
				options: {
					modules: true,
					localIdentName: className,
					minimize: true
				}
			}]
		}, {
			test: /\.jpe?g$|\.gif$|\.png$/,
			use: ['url-loader?limit=1000&name=' + (needChunkHash ? './images/[name].[hash].[ext]' : './images/[name].[ext]')]
		}, {
			test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
			use: ['url-loader?limit=1000&name=./fonts/[name].[ext]']
		}, {
			test: /\.svg$/,
			use: ['url-loader?limit=1&name=./fonts/[name].[ext]']
		}]
	},
	externals: {
		ZC: '$ZC'
	},
	resolve: {
		alias: (0, _common.getAlias)(options),
		modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
	},
	resolveLoader: {
		modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
	}
};