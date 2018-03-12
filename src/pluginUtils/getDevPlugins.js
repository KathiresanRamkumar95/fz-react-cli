import path from 'path';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import webpack from 'webpack';
import { UnusedFilesFindPlugin } from '../plugins';

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

	let { app, findUnusedFiles } = options;

	if (findUnusedFiles.active) {
		plugins.push(
			new UnusedFilesFindPlugin(
				Object.assign(findUnusedFiles, {
					origin: path.join(process.cwd(), app.folder)
				})
			)
		);
	}

	return plugins;
};

export default getDevPlugins;
