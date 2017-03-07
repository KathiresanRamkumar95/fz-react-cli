'use strict';

//$Id$//
var path = require('path');
var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var host = process.env.npm_config_server_host || "localhost";
var port = process.env.npm_config_server_port || "9090";
var appName = process.env.npm_config_server_appName || "app";
var url = "htt" + "p://" + host + ":" + port;
var srcPath = path.resolve(__dirname, 'app');
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
		main: path.join(appPath, "src", "index.js")
	},
	devtool: 'eval',
	output: {
		path: path.resolve(appPath, "build"),
		filename: '[name].js',
		publicPath: [url, appName, 'js'].join('/')
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
		__CLIENT__: true,
		__TEST__: false,
		__SERVER__: true,
		__DEVELOPMENT__: true,
		__DEVTOOLS__: true
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
					cacheDirectory: true
				}
			}],
			include: path.join(appPath, "src")
		}, {
			test: /\.css$/,
			use: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]']
		}, {
			test: /\.jpe?g$|\.gif$|\.png$/,
			use: ["url-loader?limit=1000&name=./images/[name].[ext]"]
		}, {
			test: /\.svg$|\.woff$|\.ttf$/,
			use: ["url-loader?limit=1000&name=./fonts/[name].[ext]"]
		}]
	}
};