'use strict';

//$Id$//

var path = require('path');
var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var host = process.env.npm_config_server_host || process.env.npm_package_serverconfig_host;
var port = process.env.npm_config_server_port || process.env.npm_package_serverconfig_port;
var url = "htt" + "p://" + host + ":9292";
var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());
module.exports = {
	entry: {
		main: path.join(appPath, "src", "index.js"),
		vendors: ['react', 'react-dom']
	},
	devtool: 'eval',
	output: {
		path: require("path").resolve("./portal"),
		filename: '[name].js',
		publicPath: url + '/docs/js',
		library: 'Component',
		libraryTarget: 'umd'
	},
	plugins: [new ForceCaseSensitivityPlugin(), new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.js'), new webpack.DefinePlugin({
		__TEST__: false,
		__DEVELOPMENT__: false
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
		}, { test: /\.css$/, loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local] [hash:base64:5]&sourceMap' }, { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.eot$|\.svg$|\.ttf$/, loader: "url-loader?limit=100000" }]
	},
	resolve: {
		fallback: path.join(__dirname, '..', '..', 'node_modules')
	},
	resolveLoader: {
		fallback: path.join(__dirname, '..', '..', 'node_modules')
	}
};