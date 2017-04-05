'use strict';

var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var fs = require('fs');
//var host = process.env.npm_config_server_host || "localhost";
//var port = process.env.npm_config_server_port || "9292" ;
//var url = "htt" + "p://" + host + ":"+port;

var appPath = fs.realpathSync(process.cwd());
module.exports = {
	entry: {
		main: path.join(appPath, "src", "index.js"),
		vendor: ['react', 'react-dom']
	},
	output: {
		path: path.resolve(appPath, "dir"),
		filename: '[name].js',
		library: 'Component',
		libraryTarget: 'umd'
	},
	plugins: [new CaseSensitivePathsPlugin(), new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }), new webpack.DefinePlugin({
		__TEST__: false,
		__DEVELOPMENT__: true
	}), new webpack.optimize.UglifyJsPlugin({
		compressor: {
			warnings: false
		}
	})],
	module: {
		rules: [{
			include: /\.json$/,
			use: [{
				loader: 'json-loader'
			}]
		}, {
			test: /\.jsx|\.js$/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: [[require.resolve('babel-preset-es2015'), { modules: false }], require.resolve('babel-preset-react')],
					cacheDirectory: true
				}
			}],
			include: path.join(appPath, "src")

		}, {
			test: /\.css$/,
			use: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]&sourceMap']

		}, {
			test: /\.jpe?g$|\.gif$|\.png$/,
			use: ["url-loader?limit=10000&name=./images/[name].[ext]"]
		}, {
			test: /\.svg$|\.woff$|\.ttf$|\.eot$/,
			use: ["url-loader?limit=10000&name=./fonts/[name].[ext]"]
		}]
	}
};