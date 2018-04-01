import path from 'path';
import fs from 'fs';

import { log, writeFile, makeDir } from '../utils';

let getRegex = regexString => regexString.map(str => new RegExp(str));

class UnusedFilesFindPlugin {
	constructor (options = {}) {
		this.usedFilesExcludes = getRegex(options.usedFilesExcludes);
		this.allFilesExcludes = getRegex(options.allFilesExcludes);
		this.origin = options.origin;
		this.delete = options.delete;
		this.outputFileName = options.outputFileName;
		if (!this.origin) {
			throw new Error('You must provide origin point of the app');
		}
	}

	isIgnoredUsedFile (file) {
		let result;
		for (let i = 0; i < this.usedFilesExcludes.length; i++) {
			let exclude = this.usedFilesExcludes[i];
			result = exclude.test(file);
			if (result) {
				break;
			}
		}
		return result;
	}

	isIgnoredAllFile (file) {
		let result;
		for (let i = 0; i < this.allFilesExcludes.length; i++) {
			let exclude = this.allFilesExcludes[i];
			result = exclude.test(file);
			if (result) {
				break;
			}
		}
		return result;
	}

	getAllFiles (rootPath) {
		let allFiles = [];
		let files = fs
			.readdirSync(rootPath)
			.map(file => path.join(rootPath, file));
		files.forEach(file => {
			if (fs.statSync(file).isDirectory()) {
				allFiles = allFiles.concat(this.getAllFiles(file));
			} else {
				if (!this.isIgnoredAllFile(file)) {
					allFiles.push(file);
				}
			}
		});
		return allFiles;
	}

	apply (compiler) {
		compiler.hooks.afterEmit.tap('UnusedFilesShowPlugin', compilation => {
			let { path: outputPath } = compilation.compiler.options.output;
			let usedFiles = Array.from(compilation.fileDependencies).reduce(
				(files, usedFile) => {
					if (!this.isIgnoredUsedFile(usedFile)) {
						files[usedFile] = true;
					}
					return files;
				},
				{}
			);

			let allFiles = this.getAllFiles(this.origin);

			let unusedFiles = [];
			allFiles.forEach(file => {
				if (!usedFiles[file]) {
					unusedFiles.push(file);
				}
			});

			if (!unusedFiles.length) {
				log('There is no unused files');
			} else {
				if (this.outputFileName) {
					log(
						`You can see unused files info from ${ 
							path.join(outputPath, this.outputFileName) 
						} path`
					);
					makeDir(outputPath);
					writeFile(
						path.join(outputPath, this.outputFileName),
						JSON.stringify(unusedFiles)
					);
				}
			}

			if (this.delete) {
				unusedFiles.forEach(file => {
					fs.unlinkSync(file);
					log(`Deleted - ${  file}`);
				});
			}
		});
	}
}

export default UnusedFilesFindPlugin;
