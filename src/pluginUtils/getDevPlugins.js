import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';

let getDevPlugins = options => {
	let plugins = [
		new CaseSensitivePathsPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__TEST__: false,
			__SERVER__: false,
			__DEVELOPMENT__: true,
			__DEVTOOLS__: true,
			__DOCS__: false
		})
	];
	return plugins;
};

export default getDevPlugins;
