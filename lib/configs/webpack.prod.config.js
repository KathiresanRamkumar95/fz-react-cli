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
    staticDomain = options.staticDomain;
var folder = app.folder,
    context = app.context;

var appPath = process.cwd();
var images = staticDomain.images,
    fonts = staticDomain.fonts;

var className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';
var _process = process,
    _process$isDevelopmen = _process.isDevelopment,
    isDevelopment = _process$isDevelopmen === undefined ? false : _process$isDevelopmen;


needChunkHash = !isDevelopment && needChunkHash;

module.exports = {
	entry: (0, _common.getEntries)(options, 'production'),
	devtool: isDevelopment ? 'source-map' : 'hidden-source-map',
	mode: 'none',
	output: {
		path: _path2.default.resolve(appPath, outputFolder),
		filename: needChunkHash ? 'js/[name].[chunkhash:20].js' : 'js/[name].js',
		chunkFilename: needChunkHash ? 'js/[name].[chunkhash:20].js' : 'js/[name].js',
		jsonpFunction: context + 'Jsonp',
		sourceMapFilename: needChunkHash ? 'smap/[name].[chunkhash:20].map' : 'smap/[name].map'
	},
	optimization: {
		splitChunks: _common.splitChunks,
		minimize: true
	},
	plugins: (0, _pluginUtils.getProdPlugins)(options),
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
				loader: 'style-loader',
				options: {
					insertInto: (0, _common.getInsertIntoFunction)(options.styleTarget)
				}
			}, {
				loader: 'css-loader',
				options: {
					modules: true,
					localIdentName: '' + className,
					minimize: true
				}
			}]
		}, {
			test: /\.jpe?g$|\.gif$|\.png$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 1000,
					name: needChunkHash ? './images/[name].[hash:20].[ext]' : './images/[name].[ext]',
					publicPath: function publicPath(url) {
						return 'staticDomain[' + JSON.stringify(images) + '] + ' + JSON.stringify(url);
					},
					publicPathStringify: false,
					fallback: _path2.default.join(__dirname, '..', 'loaders', 'fileLoader.js')
				}
			}]
		}, {
			test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 1000,
					name: needChunkHash ? './fonts/[name].[hash:20].[ext]' : './fonts/[name].[ext]',
					publicPath: function publicPath(url) {
						return 'staticDomain[' + JSON.stringify(fonts) + '] + ' + JSON.stringify(url);
					},
					publicPathStringify: false,
					fallback: _path2.default.join(__dirname, '..', 'loaders', 'fileLoader.js')
				}
			}]
		}, {
			test: /\.svg$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 1,
					name: needChunkHash ? './fonts/[name].[hash:20].[ext]' : './fonts/[name].[ext]',
					publicPath: function publicPath(url) {
						return 'staticDomain[' + JSON.stringify(fonts) + '] + ' + JSON.stringify(url);
					},
					publicPathStringify: false,
					fallback: _path2.default.join(__dirname, '..', 'loaders', 'fileLoader.js')
				}
			}]
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