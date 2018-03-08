import path from 'path';
import { getOptions, requireOptions, getServerURL } from '../utils';
import defaultOptions from '../defaultOptions';
import {
	splitChunks,
	getEntries,
	getAlias,
	getInsertIntoFunction
} from '../common';
import { getDevPlugins } from '../pluginUtils';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { server, app, disableContextURL, styleTarget } = options;
let { folder, context } = app;
let { hotReload } = server;
let appPath = process.cwd();
let contextURL = disableContextURL ? '' : context;
let serverUrl = getServerURL('htt' + 'ps', server);

let output = {
	path: path.join(appPath, 'build'),
	filename: '[name].js',
	chunkFilename: '[name].js',
	publicPath: [serverUrl, contextURL, 'js'].filter(a => a).join('/'),
	jsonpFunction: context + 'Jsonp'
};

if (hotReload) {
	output.devtoolModuleFilenameTemplate = info =>
		path.resolve(info.absoluteResourcePath);
}

module.exports = {
	entry: getEntries(options, 'development'),
	devtool: hotReload ? 'cheap-module-source-map' : 'source-map',
	mode: 'none',
	output,
	optimization: { splitChunks },
	plugins: getDevPlugins(options),
	module: {
		rules: [
			{
				test: /\.json$/,
				use: ['json-loader']
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								['babel-preset-env', { modules: false }],
								'babel-preset-react'
							],
							plugins: [
								[
									require.resolve(
										'babel-plugin-transform-runtime'
									),
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
						options: {
							insertInto: getInsertIntoFunction(styleTarget)
						}
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
