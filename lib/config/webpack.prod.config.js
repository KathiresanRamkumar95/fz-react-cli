'use strict';

var path = require('path');
var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var folder = process.env.npm_config_output_folder || "build";
var appFolder = process.env.npm_config_app_folder || "src";

var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());

var isVendor = function isVendor(_ref) {
	var userRequest = _ref.userRequest;
	return userRequest && userRequest.indexOf('node_modules') >= 0;
};
var isReact = function isReact(_ref) {
	var userRequest = _ref.userRequest;
	return userRequest && userRequest.indexOf('node_modules/react') >= 0;
};

module.exports = {
	entry: {
		main: path.join(appPath, appFolder, "index.js")
	},
	output: {
		path: path.resolve(appPath, folder),
		filename: 'js/[name].js'
	},
	plugins: [new ForceCaseSensitivityPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		chunks: ['main'],
		minChunks: isVendor
	}), new webpack.optimize.CommonsChunkPlugin({
		name: 'react.vendor',
		chunks: ['vendor'],
		minChunks: isReact
	}), new webpack.DefinePlugin({
		__TEST__: false,
		__DEVELOPMENT__: false,
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		}
	}), new webpack.optimize.UglifyJsPlugin({
		compressor: {
			warnings: false
		}
	})],
	module: {
		rules: [{
			include: /\.json$/,
			use: ['json-loader']
		}, {
			test: /\.jsx|\.js$/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-react')],
					plugins: [require.resolve('../removeProperties')],
					cacheDirectory: true
				}
			}],
			include: path.join(appPath, appFolder)
		}, {
			test: /\.css$/,
			use: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]']
		}, {
			test: /\.jpe?g$|\.gif$|\.png$/,
			use: ["url-loader?limit=1000&name=./images/[name].[ext]"]
		}, {
			test: /\.svg$|\.woff$|\.ttf$|\.eot$/,
			use: ["url-loader?limit=1000&name=./fonts/[name].[ext]"]
		}]
	}
};