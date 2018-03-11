import { RawSource } from 'webpack-sources';

class ChunkManifestReplacePlugin {
	constructor(options) {
		this.options = options;
	}

	apply(compiler) {
		let originalChunkFileName;

		compiler.hooks.thisCompilation.tap(
			'ChunkManifestReplacePlugin',
			compilation => {
				let { mainTemplate } = compilation;
				let { output } = compilation.compiler.options;
				let initialJS,
					chunkManifest = {};
				let { fileName, replacer } = this.options;
				mainTemplate.hooks.requireEnsure.tap(
					'ChunkManifestReplacePlugin',
					(source, rootChunk) => {
						originalChunkFileName = output.chunkFilename;
						output.chunkFilename = '__CHUNK_MANIFEST__';

						let iterateChunks = chunks => {
							chunks.forEach(chunk => {
								let { name, id } = chunk;
								chunkManifest[id] = name + '.js';
								if (chunk.isInitial()) {
									initialJS[name || id] = name + '.js';
								}
								if (chunk.chunks.length) {
									iterateChunks(chunk.chunks);
								}
							});
						};

						iterateChunks(rootChunk.chunks);

						compilation.chunks[fileName] = new RawSource(
							JSON.stringify({
								manifestVariable: replacer,
								manifest: chunkManifest,
								initialJS
							})
						);

						rootChunk.files.push(fileName);

						return source;
					}
				);
			}
		);

		compiler.hooks.compilation.tap(
			'ChunkManifestReplacePlugin',
			compilation => {
				let { mainTemplate } = compilation;
				let { output } = compilation.compiler.options;
				mainTemplate.hooks.requireEnsure.tap(
					'ChunkManifestReplacePlugin',
					(source, chunk, hash, chunkIdVar) => {
						let { replacer } = this.options;
						let { output } = compilation.compiler.options;
						output.chunkFilename = originalChunkFileName;
						let regex = new RegExp('"__CHUNK_MANIFEST__"', 'g');
						return source.replace(
							regex,
							replacer + '[' + chunkIdVar + ']'
						);
					}
				);
			}
		);
	}
}

export default ChunkManifestReplacePlugin;
