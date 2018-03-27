'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModuleStatsPlugin = function () {
	function ModuleStatsPlugin() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, ModuleStatsPlugin);

		this.options = options;
		this.options.filename = options.filename || 'moduleStats.js';
	}

	_createClass(ModuleStatsPlugin, [{
		key: 'apply',
		value: function apply(compiler) {
			var _this = this;

			compiler.hooks.emit.tap('ModuleStatsPlugin', function (compilation, callback) {
				var stats = compilation.getStats().toJson();

				var modules = stats.modules;
				var moduleName = '';
				var rModuleName = '';
				var rReferencesArray = [];
				var rReferencedByArray = [];
				var data = { results: [] };
				var moduleDetails = {};
				var references = '';
				var referencedBy = '';
				// let normalizedData = '';
				var dre = void 0;

				for (var i in modules) {
					moduleName = modules[i].name;
					if (moduleName.startsWith('./src') && !(moduleName.indexOf('index.js') > -1) && !moduleName.endsWith('css')) {
						rModuleName = moduleName.substring(moduleName.lastIndexOf('/') + 1, moduleName.lastIndexOf('.'));
						if (rModuleName.endsWith('docs')) {
							rModuleName = rModuleName.substring(0, rModuleName.lastIndexOf('.'));
						}

						if (modules[i].reasons.length > 0) {
							for (var l in modules[i].reasons) {
								referencedBy = modules[i].reasons[l].moduleName;
								if (!referencedBy.endsWith('index.js')) {
									var referencedby = referencedBy.substring(referencedBy.lastIndexOf('/') + 1, referencedBy.lastIndexOf('.'));
									if (referencedby.endsWith('docs')) {
										rReferencedByArray.push(referencedby.substring(0, referencedby.lastIndexOf('.')));
									} else {
										rReferencedByArray.push(referencedBy.substring(referencedBy.lastIndexOf('/') + 1, referencedBy.lastIndexOf('.')));
									}
								}
							}
						}

						for (var module in modules) {
							if (modules[module].name.startsWith('./src')) {
								for (var reason in modules[module].reasons) {
									if (moduleName === modules[module].reasons[reason].moduleName && !(modules[module].name.indexOf('css') > -1)) {
										if (!modules[module].name.endsWith('react.js') && !(modules[module].name.indexOf('react-dom') > -1) && !modules[module].name.endsWith('.png')) {
											references = modules[module].name;
											rReferencesArray.push(references.substring(references.lastIndexOf('/') + 1, references.lastIndexOf('.')));
										}
									}
								}
							}
						}

						rReferencesArray = rReferencesArray.filter(function (item, index, inputArray) {
							return inputArray.indexOf(item) == index;
						});

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

						data.results.forEach(function (mod) {
							dre += '\'' + mod.name + '\':' + JSON.stringify(mod) + ',';
						});
					}
				}

				var dataResult = '{' + dre + '}';
				var mResult = 'let mdata = ' + dataResult;

				compilation.assets[_this.options.filename] = {
					source: function source() {
						return mResult;
					},
					size: function size() {
						return mResult.length;
					}
				};
				callback();
			});
		}
	}]);

	return ModuleStatsPlugin;
}();

exports.default = ModuleStatsPlugin;