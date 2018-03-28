import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';

import ModuleStatsPlugin from '../plugins/ModuleStatsPlugin';

let getDocsPlugins = () => {
	let plugins = [
		new CaseSensitivePathsPlugin(),
		new webpack.ProvidePlugin({
			React: 'react'
		}),
		new webpack.DefinePlugin({
			__TEST__: false,
			__DEVELOPMENT__: true,
			__DOCS__: true
		}),
		new ModuleStatsPlugin({ filename: 'moduleStats.js' })
	];
	return plugins;
};

export default getDocsPlugins;
