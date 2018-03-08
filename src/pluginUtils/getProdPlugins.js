import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { RuntimePublicPathPlgin, ChunkManifestReplacePlugin } from '../plugins';

let getProdPlugins = options => {
	let plugins = [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new CaseSensitivePathsPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.DefinePlugin({
			__TEST__: false,
			__DEVELOPMENT__: false,
			__DOCS__: false,
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			},
			__SERVER__: false,
			__DOCS__: false
		}),
		new RuntimePublicPathPlgin({
			publicPathCallback: options.publicPathCallback
		})
	];
	if (options.bundleAnalyze) {
		plugins.push(
			new BundleAnalyzerPlugin({
				analyzerMode: 'static'
			})
		);
	}
	if (options.manifestReplacer) {
		plugins.push(
			new ChunkManifestReplacePlugin({
				replacer: options.manifestReplacer
			})
		);
	}
	return plugins;
};

export default getProdPlugins;
