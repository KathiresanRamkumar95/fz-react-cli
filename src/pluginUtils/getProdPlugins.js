import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import {
	RuntimePublicPathPlgin,
	ChunkManifestReplacePlugin,
	SourceMapHookPlugin
} from '../plugins';

let getProdPlugins = options => {
	let {
		needChunkHash,
		manifestReplacer,
		manifestFileName,
		bundleAnalyze
	} = options;

	let plugins = [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new CaseSensitivePathsPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.DefinePlugin({
			__TEST__: false,
			__DEVELOPMENT__: false,
			__LOCAL_PRODUCTION__: process.isDevelopment,
			__DOCS__: false,
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			},
			__SERVER__: false,
			__DOCS__: false
		}),
		new RuntimePublicPathPlgin({
			publicPathCallback: 'window.setPublicPath'
		})
	];

	if (!process.isDevelopment) {
		plugins.push(
			new SourceMapHookPlugin({
				optimize: options.optimize
			})
		);

		plugins.push(
			new ChunkManifestReplacePlugin({
				replacer: manifestReplacer,
				fileName: manifestFileName,
				needChunkHash
			})
		);

		if (bundleAnalyze) {
			plugins.push(
				new BundleAnalyzerPlugin({
					analyzerMode: 'static'
				})
			);
		}
	}

	return plugins;
};

export default getProdPlugins;
