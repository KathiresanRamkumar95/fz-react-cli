'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChunkManifestReplacePlugin = function () {
	function ChunkManifestReplacePlugin(options) {
		_classCallCheck(this, ChunkManifestReplacePlugin);

		this.options = options;
	}

	_createClass(ChunkManifestReplacePlugin, [{
		key: 'apply',
		value: function apply(compiler) {
			var _this = this;

			var originalChunkFileName = void 0;

			compiler.hooks.thisCompilation.tap('ChunkManifestReplacePlugin', function (compilation) {
				var mainTemplate = compilation.mainTemplate;
				var output = compilation.compiler.options.output;

				var chunkManifest = {};
				var initialJS = {};
				var _options = _this.options,
				    fileName = _options.fileName,
				    replacer = _options.replacer,
				    needChunkHash = _options.needChunkHash;

				mainTemplate.hooks.requireEnsure.tap('ChunkManifestReplacePlugin', function (source) {
					if (replacer) {
						originalChunkFileName = output.chunkFilename;
						output.chunkFilename = '__CHUNK_MANIFEST__';
					}

					compilation.chunks.forEach(function (chunk) {
						var name = chunk.name,
						    renderedHash = chunk.renderedHash,
						    id = chunk.id;

						var fullName = name + (needChunkHash ? '.' + renderedHash : '') + '.js';
						chunkManifest[id] = fullName;
						if (chunk.canBeInitial()) {
							initialJS[name || id] = fullName;
						}
					});

					(0, _utils.writeFile)(_path2.default.join(output.path, fileName), JSON.stringify({
						manifestVariable: replacer,
						manifest: chunkManifest,
						initialJS: initialJS
					}));

					return source;
				});
			});

			compiler.hooks.compilation.tap('ChunkManifestReplacePlugin', function (compilation) {
				var mainTemplate = compilation.mainTemplate;

				mainTemplate.hooks.requireEnsure.tap('ChunkManifestReplacePlugin', function (source, chunk, hash, chunkIdVar) {
					var replacer = _this.options.replacer;

					if (replacer) {
						var output = compilation.compiler.options.output;

						output.chunkFilename = originalChunkFileName;
						var regex = /"__CHUNK_MANIFEST__"/g;
						return source.replace(regex, 'window.' + replacer + '[' + chunkIdVar + ']');
					}
					return source;
				});
			});
		}
	}]);

	return ChunkManifestReplacePlugin;
}();

exports.default = ChunkManifestReplacePlugin;