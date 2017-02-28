var path = require('path');
var webpack = require('webpack');
var ForceCaseSensitivityPlugin = require('force-case-sensitivity-webpack-plugin');
var folder = process.env.npm_config_output_folder || "build" 
var fs = require('fs');
var appPath =fs.realpathSync(process.cwd());
module.exports = {
	entry: {
		main: path.join(appPath,"src", "index.js"),
		vendor: ['react', 'react-dom', 'redux', 'react-redux']
	},
	output: {
		path: path.resolve(appPath,folder),
		filename: 'js/[name].js'
		
	},
	plugins: [
		new ForceCaseSensitivityPlugin(), 
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'js/vendor.js' }), 
		new webpack.DefinePlugin({
			__TEST__: false,
			__DEVELOPMENT__: false,
			'process.env': {
			    NODE_ENV: JSON.stringify('production')
			  }
		}),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
	],
	module: {
		rules: [{
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
			test: /\.css$/, 
			use: ['style-loader','css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]' ]
		}, 
		{ 
			test: /\.jpe?g$|\.gif$|\.png$/, 
			use: ["url-loader?limit=10000&name=./images/[name].[ext]" ]
		},
		{ 
			test: /\.svg$|\.woff$|\.ttf$/, 
			use: [ "url-loader?limit=10000&name=./fonts/[name].[ext]" ]
		}]
	}
};