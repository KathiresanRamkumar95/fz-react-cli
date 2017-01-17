//$Id$//
var path = require('path');
var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var host= process.env.npm_config_server_host || "localhost";
var port= process.env.npm_config_server_port || "9090";
var appName = process.env.npm_config_server_appName || "app" 
var url="htt"+"p://"+host+":"+port;
var srcPath=path.resolve(__dirname, 'app');
var fs = require('fs');
var appPath =fs.realpathSync(process.cwd());

module.exports = {
	entry : path.join(appPath,"src", "index.js"),
	devtool: 'eval',
	output : {
		path : path.resolve(appPath,"build"),
		filename : 'main.js',
		publicPath : [url,appName,'js'].join('/')
	},
	plugins : [ 
		new ForceCaseSensitivityPlugin(), 
		new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.js'), 
		new webpack.DefinePlugin({
	        __CLIENT__: true,
	        __TEST__: false,
	        __SERVER__: true,
	        __DEVELOPMENT__: true,
	        __DEVTOOLS__: true
      	})
	],
	module : {
		loaders : [{
			test : /\.jsx|\.js$/,
			loader : 'babel',
        	include:path.join(appPath,"src"),
			babelrc: false,
			query: {
			    presets: [
			        require.resolve('babel-preset-es2015'),
			        require.resolve('babel-preset-react')
			    ],
			    cacheDirectory:true
		    }
		}, {
			test : /\.css$/,
			loader : 'style-loader!css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]'
		}, { 
			test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.eot$|\.svg$|\.ttf$/, 
			loader: "url-loader?limit=100&name=[name].[ext]" 
		}]
	},
	resolve: {
		alias:{
			"history":path.join(__dirname,"..","hook","history.js")
		},
		fallback: path.join(__dirname,'..','..','node_modules')
	},
	resolveLoader: {
	    fallback: path.join(__dirname,'..','..','node_modules')
	}
};
