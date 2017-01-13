'use strict';

var path = require('path');
var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var host = process.env.npm_config_server_host || "localhost";
var port = process.env.npm_config_server_port || "9292";
var url = "htt" + "p://" + host + ":" + port;
var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());
module.exports = {
	entry: {
		main: path.join(appPath, "src", "index.js"),
		vendors: ['react', 'react-dom']
	},
	output: {
		path: path.resolve(appPath, "lib"),
		filename: '[name].js',
		library: 'Component',
		libraryTarget: 'umd'
	},
	plugins: [new ForceCaseSensitivityPlugin(), new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.js'), new webpack.DefinePlugin({
		__TEST__: false,
		__DEVELOPMENT__: true
	})],
	module: {
		loaders: [{
			test: /\.jsx|\.js$/,
			loader: 'babel',
			include: path.join(appPath, "src"),
			babelrc: false,
			query: {
				presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-react')],
				cacheDirectory: true
			}
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local__[hash:base64:5]&sourceMap'
		}, {
			test: /\.jpe?g$|\.gif$|\.png$/,
			loader: "url-loader?limit=10000&name=./images/[name].[ext]"
		}, {
			test: /\.svg$|\.woff$|\.ttf$/,
			loader: "url-loader?limit=10000&name=./fonts/[name].[ext]"
		}]
	},
	resolve: {
		fallback: path.join(__dirname, '..', '..', 'node_modules')
	},
	resolveLoader: {
		fallback: path.join(__dirname, '..', '..', 'node_modules')
	}
};