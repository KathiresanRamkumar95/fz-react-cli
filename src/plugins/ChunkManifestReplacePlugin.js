import { writeFile } from '../utils';
import path from 'path';

class ChunkManifestReplacePlugin {
	constructor (options) {
		this.options = options;
	}

	apply (compiler) {
		let originalChunkFileName;

		compiler.hooks.thisCompilation.tap(
			'ChunkManifestReplacePlugin',
			compilation => {
				let { mainTemplate } = compilation;
				let { output } = compilation.compiler.options;
				let chunkManifest = {};
				let initialJS = {};
				let { fileName, replacer, needChunkHash } = this.options;
				mainTemplate.hooks.requireEnsure.tap(
					'ChunkManifestReplacePlugin',
					(source) => {
						if (replacer) {
							originalChunkFileName = output.chunkFilename;
							output.chunkFilename = '__CHUNK_MANIFEST__';
						}

						compilation.chunks.forEach(chunk => {
							let { name, renderedHash, id } = chunk;
							let fullName = name + (needChunkHash ? '.' +  renderedHash : '') + '.js';
							chunkManifest[id] = fullName;
							if (chunk.canBeInitial()) {
								initialJS[name || id] = fullName;
							}
						});

						writeFile(
							path.join(output.path, fileName),
							JSON.stringify({
								manifestVariable: replacer,
								manifest: chunkManifest,
								initialJS
							})
						);

						return source;
					}
				);
			}
		);

		compiler.hooks.compilation.tap(
			'ChunkManifestReplacePlugin',
			compilation => {
				let { mainTemplate } = compilation;
				mainTemplate.hooks.requireEnsure.tap(
					'ChunkManifestReplacePlugin',
					(source, chunk, hash, chunkIdVar) => {
						let { replacer } = this.options;
						if (replacer) {
							let { output } = compilation.compiler.options;
							output.chunkFilename = originalChunkFileName;
							let regex = /"__CHUNK_MANIFEST__"/g;
							return source.replace(
								regex,
								`window.${replacer}[${chunkIdVar}]`
							);
						}
						return source;
					}
				);
			}
		);
	}
}

export default ChunkManifestReplacePlugin;
