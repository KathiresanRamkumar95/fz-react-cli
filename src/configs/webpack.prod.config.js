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
let { app, cssUniqueness, needChunkHash, outputFolder } = options;
let { folder, context } = app;
let appPath = process.cwd();
let { js, images, fonts } = staticDomain;
let className = cssUniqueness ? 'fz__[hash:base64:5]' : '[name]__[local]';

module.exports = {
	entry: getEntries(options, 'production'),
	devtool: options.needSourceMap ? 'source-map' : 'hidden-source-map',
	mode: 'none',
	output: {
		path: path.resolve(appPath, outputFolder, 'js'),
		filename: needChunkHash ? '[name].[chunkhash].js' : '[name].js',
		chunkFilename: needChunkHash ? '[name].[chunkhash].js' : '[name].js',
		jsonpFunction: context + 'Jsonp',
		sourceMapFilename: 'smap/[name].map'
	},
	optimization: {
		splitChunks,
		minimize: true
	},
	plugins: getProdPlugins(options),
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
								? './images/[name].[hash].[ext]'
								: './images/[name].[ext]',
							publicPath: url => {
								return `staticDomain[${JSON.stringify(
									images
								)}] + ${JSON.stringify(url)}`;
							},
							fallback: path.resolve(
								__dirname,
								'..',
								'loaders',
								'fileLoader.js'
							),
							publicPathStringify: false
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
								? './fonts/[name].[hash].[ext]'
								: './fonts/[name].[ext]',
							publicPath: url => {
								return `staticDomain[${JSON.stringify(
									fonts
								)}] + ${JSON.stringify(url)}`;
							},
							fallback: path.resolve(
								__dirname,
								'..',
								'loaders',
								'fileLoader.js'
							),
							publicPathStringify: false
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
								? './fonts/[name].[hash].[ext]'
								: './fonts/[name].[ext]',
							publicPath: url => {
								return `staticDomain[${JSON.stringify(
									fonts
								)}] + ${JSON.stringify(url)}`;
							},
							fallback: path.resolve(
								__dirname,
								'..',
								'loaders',
								'fileLoader.js'
							),
							publicPathStringify: false
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
