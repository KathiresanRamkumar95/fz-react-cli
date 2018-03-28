import optimizeJS from 'optimize-js';
import fs from 'fs';
import path from 'path';
import { writeFile, log, makeDir } from '../utils';

class SourceMapHookPlugin {
	constructor(options = {}) {
		this.optimize = options.optimize;
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tapAsync(
			'SourceMapHookPlugin',
			(compilation, callback) => {
				let outputPath = compilation.options.output.path;

				let jsPath = path.join(outputPath, 'js');
				let smapJsPath = path.join(outputPath, 'js-sm');
				makeDir([outputPath, jsPath, smapJsPath]);

				let promises = [];
				let files = fs.readdirSync(jsPath);
				files.forEach(file => {
					let src = fs
						.readFileSync(path.join(jsPath, file))
						.toString();
					let optimizedSrc;
					if (this.optimize) {
						optimizedSrc = optimizeJS(src);
					} else {
						optimizedSrc = src;
					}
					src += `\n//# sourceMappingURL=../smap/${file}.map`;
					promises.push(
						writeFile(path.join(jsPath, file), optimizedSrc)
					);
					promises.push(writeFile(path.join(smapJsPath, file), src));
				});

				Promise.all(promises).then(() => {
					log('Source map hook completed');
					callback();
				});
			}
		);
	}
}

export default SourceMapHookPlugin;
