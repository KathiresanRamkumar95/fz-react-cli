class ModuleStatsPlugin {
	constructor (options = {}) {
		this.options = options;
		this.options.filename = options.filename || 'moduleStats.js';
	}

	apply (compiler) {
		compiler.hooks.emit.tap('ModuleStatsPlugin', (compilation, callback) => {
			let stats = compilation.getStats().toJson();

			let { modules } = stats;
			let moduleName = '';
			let rModuleName = '';
			let rReferencesArray = [];
			let rReferencedByArray = [];
			let data = { results: [] };
			let moduleDetails = {};
			let references = '';
			let referencedBy = '';
			// let normalizedData = '';
			let dre;

			// eslint-disable-next-line guard-for-in
			for (let i in modules) {
				moduleName = modules[i].name;
				if (
					moduleName.startsWith('./src') &&
					!(moduleName.indexOf('index.js') > -1) &&
					!moduleName.endsWith('css')
				) {
					rModuleName = moduleName.substring(
						moduleName.lastIndexOf('/') + 1,
						moduleName.lastIndexOf('.')
					);
					if (rModuleName.endsWith('docs')) {
						rModuleName = rModuleName.substring(
							0,
							rModuleName.lastIndexOf('.')
						);
					}

					if (modules[i].reasons.length > 0) {
						// eslint-disable-next-line guard-for-in
						for (let l in modules[i].reasons) {
							referencedBy = modules[i].reasons[l].moduleName;
							if (!referencedBy.endsWith('index.js')) {
								let referencedby = referencedBy.substring(
									referencedBy.lastIndexOf('/') + 1,
									referencedBy.lastIndexOf('.')
								);
								if (referencedby.endsWith('docs')) {
									rReferencedByArray.push(
										referencedby.substring(0, referencedby.lastIndexOf('.'))
									);
								} else {
									rReferencedByArray.push(
										referencedBy.substring(
											referencedBy.lastIndexOf('/') + 1,
											referencedBy.lastIndexOf('.')
										)
									);
								}
							}
						}
					}

					for (let module in modules) {
						if (modules[module].name.startsWith('./src')) {
							for (let reason in modules[module].reasons) {
								if (
									moduleName === modules[module].reasons[reason].moduleName &&
									!(modules[module].name.indexOf('css') > -1)
								) {
									if (
										!modules[module].name.endsWith('react.js') &&
										!(modules[module].name.indexOf('react-dom') > -1) &&
										!modules[module].name.endsWith('.png')
									) {
										references = modules[module].name;
										rReferencesArray.push(
											references.substring(
												references.lastIndexOf('/') + 1,
												references.lastIndexOf('.')
											)
										);
									}
								}
							}
						}
					}

					rReferencesArray = rReferencesArray.filter(
						(item, index, inputArray) => {
							return inputArray.indexOf(item) === index;
						}
					);

					moduleDetails = {
						name: rModuleName,
						references: rReferencesArray,
						referencedby: rReferencedByArray
					};

					dre = '';

					data.results.push(moduleDetails);
					moduleDetails = {};
					rReferencesArray = [];
					rReferencedByArray = [];
					referencedBy = '';
					references = '';

					data.results.forEach(mod => {
						dre += '\'' + mod.name + '\':' + JSON.stringify(mod) + ',';
					});
				}
			}

			let dataResult = '{' + dre + '}';
			let mResult = 'let mdata = ' + dataResult;

			compilation.assets[this.options.filename] = {
				source: function () {
					return mResult;
				},
				size: function () {
					return mResult.length;
				}
			};
			callback();
		});
	}
}

export default ModuleStatsPlugin;
