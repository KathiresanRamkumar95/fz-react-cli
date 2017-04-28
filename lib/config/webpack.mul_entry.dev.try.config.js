'use strict';

//$Id$//
var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var getIP = require('../utils/ipaddress');
var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || "9090";
var appName = process.env.npm_config_server_appName || "app";
var url = "htt" + "p://" + host + ":" + port;
var srcPath = path.resolve(__dirname, 'app');
var fs = require('fs');
var appPath = fs.realpathSync(process.cwd());
var isVendor = function isVendor(_ref) {
	var userRequest = _ref.userRequest;
	return userRequest && userRequest.indexOf('node_modules') >= 0 && userRequest.match(/\.js$/);
};
function extractBundles(bundles) {
	var entry = {
		main: path.join(appPath, "src", "index.js"),
		B: path.join(appPath, "src", "B.js")
	};
	var plugins = [new CaseSensitivePathsPlugin(), new webpack.DefinePlugin({
		__CLIENT__: true,
		__TEST__: false,
		__SERVER__: true,
		__DEVELOPMENT__: true,
		__DEVTOOLS__: true
	})];

	bundles.forEach(function (bundle) {
		var name = bundle.name,
		    entries = bundle.entries;


		if (entries) {
			entry[name] = entries;
		}

		plugins.push(new webpack.optimize.CommonsChunkPlugin(bundle));
	});

	return { entry: entry, plugins: plugins };
};
module.exports = Object.assign({
	/*entry : {
 	main: path.join(appPath, "src", "index.js"),
 	vendors: ['react', 'react-dom', 'redux', 'react-redux']
 },
 devtool: 'eval',*/
	output: {
		path: path.resolve(appPath, "build"),
		filename: '[name].js',
		publicPath: [url, appName, 'js'].join('/')
	},
	/*plugins : [ 
 	new ForceCaseSensitivityPlugin(), 
 	new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }), 
 	new webpack.DefinePlugin({
         __CLIENT__: true,
         __TEST__: false,
         __SERVER__: true,
         __DEVELOPMENT__: true,
         __DEVTOOLS__: true
      	})
 ],*/
	module: {
		rules: [{
			include: /\.json$/,
			use: ['json-loader']
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
			use: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]']
		}, {
			test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.eot$|\.svg$|\.ttf$/,
			use: ["url-loader?limit=100&name=[name].[ext]"]
		}]
	}
}, extractBundles([{
	name: 'vendor',
	chunks: ['main'],
	//entries: ['react', 'react-dom', 'redux', 'react-redux','fz-i18n','fz-permission','history','redux-router-middleware','redux-thunk','reselect'],
	minChunks: isVendor
}, {
	name: 'bvendor',
	chunks: ['B'],
	//entries: ['react', 'react-dom', 'redux', 'react-redux','fz-i18n','fz-permission','history','redux-router-middleware','redux-thunk','reselect'],
	minChunks: isVendor
}, {
	name: 'vendor.common',
	chunks: ['bvendor', 'vendor'],
	//entries: ['react', 'react-dom', 'redux', 'react-redux','fz-i18n','fz-permission','history','redux-router-middleware','redux-thunk','reselect'],
	minChunks: function minChunks(module, count) {
		return count >= 2 && isVendor(module);
	}
}, {
	name: 'app.common',
	chunks: ['main', 'B']
}]));