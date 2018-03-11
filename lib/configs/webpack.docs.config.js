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
var docsServer = options.docsServer,
    cssUniqueness = options.cssUniqueness,
    componentFolder = options.componentFolder;

var appPath = process.cwd();
var serverUrl = (0, _utils.getServerURL)('htt' + 'ps', docsServer);

var className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

module.exports = {
	entry: {
		main: _path2.default.join(appPath, componentFolder, 'index.js'),
		vendor: ['react', 'react-dom', 'redux', 'react-redux']
	},
	devtool: 'eval',
	mode: 'none',
	output: {
		path: _path2.default.join(appPath, 'build'),
		filename: '[name].js',
		publicPath: serverUrl + '/docs/js',
		library: 'Component',
		libraryTarget: 'umd'
	},
	plugins: (0, _pluginUtils.getDocsPlugins)(),
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [[require.resolve('babel-preset-env'), { modules: false }], require.resolve('babel-preset-react')],
					plugins: [[require.resolve('babel-plugin-transform-runtime'), {
						helpers: true,
						polyfill: true,
						regenerator: false,
						moduleName: 'babel-runtime'
					}]],
					cacheDirectory: true
				}
			}],
			include: _path2.default.join(appPath, componentFolder)
		}, {
			test: /\.docs\.js$/,
			use: require.resolve('../loaders/docsLoader.js'),
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader',
				options: {
					modules: true,
					localIdentName: className
				}
			}]
		}, {
			test: /\.jpe?g$|\.gif$|\.png$/,
			use: ['url-loader?limit=1000&name=./images/[name].[ext]']
		}, {
			test: /\.woff2|\.woff$|\.ttf$|\.eot$/,
			use: ['url-loader?limit=1000&name=./fonts/[name].[ext]']
		}, {
			test: /\.svg$/,
			use: ['url-loader?limit=1&name=./fonts/[name].[ext]']
		}, {
			test: /\.html$/,
			use: {
				loader: 'html-loader',
				options: {
					attrs: [':data-src'],
					interpolate: 'require'
				}
			}
		}]
	},
	externals: {
		ZC: '$ZC'
	},
	resolve: {
		alias: Object.assign((0, _common.getAlias)(options), {
			'prop-types$': _path2.default.resolve(__dirname, '..', 'hooks', 'docsProptypeHook.js')
		}),
		modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
	},
	resolveLoader: {
		modules: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
	}
};