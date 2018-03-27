import path from 'path';
import { getOptions, requireOptions } from '../utils';
import defaultOptions from '../defaultOptions';
import {
	splitChunks,
	getEntries,
	getAlias,
	getInsertIntoFunction
} from '../common';
import { getProdPlugins } from '../pluginUtils';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { app, cssUniqueness, needChunkHash, outputFolder, staticDomain } = options;
let { folder, context } = app;
let appPath = process.cwd();
let { images, fonts } = staticDomain;
let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';
let { isDevelopment = false } = process;

needChunkHash = !isDevelopment && needChunkHash;

module.exports = {
	entry: getEntries(options, 'production'),
	devtool: isDevelopment ? 'source-map' : 'hidden-source-map',
	mode: 'none',
	output: {
		path: path.resolve(appPath, outputFolder),
		filename: needChunkHash
			? 'js/[name].[chunkhash:20].js'
			: 'js/[name].js',
		chunkFilename: needChunkHash
			? 'js/[name].[chunkhash:20].js'
			: 'js/[name].js',
		jsonpFunction: context + 'Jsonp',
		sourceMapFilename: needChunkHash
			? 'smap/[name].[chunkhash:20].map'
			: 'smap/[name].map'
	},
	optimization: {
		splitChunks,
		minimize: true
	},
	plugins: getProdPlugins(options),
	module: {
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
									{ modules: false }
								],
								require.resolve('babel-preset-react')
							],
							plugins: [
								require.resolve('../utils/removeTestIds'),
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
							insertInto: getInsertIntoFunction(
								options.styleTarget
							)
						}
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
							name: needChunkHash
								? './images/[name].[hash:20].[ext]'
								: './images/[name].[ext]',
							publicPath: url => {
								return `staticDomain[${JSON.stringify(
									images
								)}] + ${JSON.stringify(url)}`;
							},
							publicPathStringify: false,
							fallback: path.join(
								__dirname,
								'..',
								'loaders',
								'fileLoader.js'
							)
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
							name: needChunkHash
								? './fonts/[name].[hash:20].[ext]'
								: './fonts/[name].[ext]',
							publicPath: url => {
								return `staticDomain[${JSON.stringify(
									fonts
								)}] + ${JSON.stringify(url)}`;
							},
							publicPathStringify: false,
							fallback: path.join(
								__dirname,
								'..',
								'loaders',
								'fileLoader.js'
							)
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
							name: needChunkHash
								? './fonts/[name].[hash:20].[ext]'
								: './fonts/[name].[ext]',
							publicPath: url => {
								return `staticDomain[${JSON.stringify(
									fonts
								)}] + ${JSON.stringify(url)}`;
							},
							publicPathStringify: false,
							fallback: path.join(
								__dirname,
								'..',
								'loaders',
								'fileLoader.js'
							)
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
