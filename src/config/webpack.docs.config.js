'use strict';

var path = require('path');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var host = process.env.npm_config_server_host || "localhost";
var port = process.env.npm_config_server_port || "9292" ;
var componentPath = process.env.npm_config_server_componentPath || null ;
var url = "htt" + "p://" + host + ":9292";
var fs = require('fs');
var appPath =fs.realpathSync(process.cwd());
module.exports = {
	entry: {
		main: path.join(appPath,componentPath || "src", "index.js"),
		vendor: ['react', 'react-dom', 'redux', 'react-redux']
	},
	devtool: 'eval',
	output: {
		path: path.resolve(appPath,"build"),
		filename: '[name].js',
		publicPath: url + '/docs/js',
		library: 'Component',
		libraryTarget: 'umd'
	},
	plugins: [
		new CaseSensitivePathsPlugin(), 
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }), 
		new webpack.DefinePlugin({
			__TEST__: false,
			__DEVELOPMENT__: true
		})
	],
	module: {
		rules : [{
			    include: /\.json$/,
			    use: ['json-loader']
			},{
			test : /\.jsx|\.js$/,
			use:[{
				loader:'babel-loader',
				options:{
					 presets: [
			        require.resolve('babel-preset-es2015'),
			        require.resolve('babel-preset-react')
			    ],
			    cacheDirectory:true
				}
			}],
        	include:path.join(appPath,"src")
		}, {
        test : /\.docs\.jsx$|\.docs\.js$/,
        use :require.resolve('../docsLoader.js'),
        exclude : /node_modules/

      },  {
			test : /\.css$/,
			use : ['style-loader','css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]']
		}, { 
			test: /\.jpe?g$|\.gif$|\.png$/, 
			use: ["url-loader?limit=10000&name=./images/[name].[ext]" ]
		},
		{ 
			test: /\.svg$|\.woff$|\.ttf$|\.eot$/, 
			use: [ "url-loader?limit=10000&name=./fonts/[name].[ext]" ]
		}]
	}
};