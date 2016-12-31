//$Id$//
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var host=process.env.npm_config_server_host || process.env.npm_package_serverconfig_host;
var port=process.env.npm_config_server_port || process.env.npm_package_serverconfig_port;
var url="htt"+"p://"+host+":"+port;
var srcPath=path.resolve(__dirname, 'app');
console.log(srcPath);
module.exports = {
	entry : ["webpack-hot-middleware/client?path="+url+"/__webpack_hmr","./app/app" ],
	devtool: 'eval',
	output : {
		path : require("path").resolve("./fzdesk"),
		filename : 'main.js',
		publicPath : url+'/fzdesk/'
	},
	plugins : [ 
		new webpack.DefinePlugin({
	        __CLIENT__: true,
	        __TEST__: false,
	        __SERVER__: true,
	        __DEVELOPMENT__: true,
	        __DEVTOOLS__: true
      	}),
		new webpack.HotModuleReplacementPlugin()
	],
	module : {
		loaders : [
			{
				test : /\.js$/,
				loader : 'babel',
        		exclude : /node_modules\/(?!(fz-react-component)\/).*/
			},{
				test : /\.css$/,
				loader : 'style-loader!css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]-discardDuplicates',
        		exclude : /node_modules\/(?!(fz-react-component)\/).*/
			},{ 
				test: /\.jpe?g$|\.gif$|\.png$/, 
				loader: require.resolve("file-loader") + "?name=images/[name].[ext]",
				exclude : /node_modules\/(?!(fz-react-component)\/).*/
			},
			{ 
				test: /\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$|\.eot$|\.svg$|\.ttf$/, 
				loader: require.resolve("file-loader") + "?name=fonts/[name].[ext]",
				exclude : /node_modules\/(?!(fz-react-component)\/).*/
			}
								
		]
	}
};
