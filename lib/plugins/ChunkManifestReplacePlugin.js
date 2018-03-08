'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChunkManifestReplacePlugin = function () {
	function ChunkManifestReplacePlugin(options) {
		_classCallCheck(this, ChunkManifestReplacePlugin);

		this.replacer = options.replacer;
	}

	_createClass(ChunkManifestReplacePlugin, [{
		key: 'apply',
		value: function apply(compiler) {
			var _this = this;

			var originalChunkFileName = void 0;

			compiler.hooks.thisCompilation.tap('ChunkManifestReplacePlugin', function (compilation) {
				var mainTemplate = compilation.mainTemplate;
				var output = compilation.compiler.options.output;

				mainTemplate.hooks.requireEnsure.tap('ChunkManifestReplacePlugin', function (source, chunk) {
					originalChunkFileName = output.chunkFilename;
					output.chunkFilename = '__CHUNK_MANIFEST__';
					return source;
				});
			});

			compiler.hooks.compilation.tap('ChunkManifestReplacePlugin', function (compilation) {
				var mainTemplate = compilation.mainTemplate;
				var output = compilation.compiler.options.output;

				mainTemplate.hooks.requireEnsure.tap('ChunkManifestReplacePlugin', function (source, chunk, hash, chunkIdVar) {
					var output = compilation.compiler.options.output;

					output.chunkFilename = originalChunkFileName;
					var regex = new RegExp('"__CHUNK_MANIFEST__"', 'g');
					return source.replace(regex, _this.replacer + '[' + chunkIdVar + ']');
				});
			});
		}
	}]);

	return ChunkManifestReplacePlugin;
}();

exports.default = ChunkManifestReplacePlugin;