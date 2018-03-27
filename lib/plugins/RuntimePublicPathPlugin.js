'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RuntimePublicPathPlgin = function () {
	function RuntimePublicPathPlgin(options) {
		_classCallCheck(this, RuntimePublicPathPlgin);

		this.publicPathCallback = options.publicPathCallback;
	}

	_createClass(RuntimePublicPathPlgin, [{
		key: 'apply',
		value: function apply(compiler) {
			var publicPathCallback = this.publicPathCallback;


			compiler.hooks.thisCompilation.tap('RuntimePublicPathPlgin', function (compilation) {
				compilation.mainTemplate.hooks.requireExtensions.tap('RuntimePublicPathPlgin', function (source) {
					var buf = [];
					var wrapperName = 'requireEnsureWrapper';
					buf.push(source);
					buf.push('');
					buf.push('// Dynamic assets path override ');
					buf.push('var ' + wrapperName + ' = ' + this.requireFn + '.e;');
					buf.push(this.requireFn + '.e = function requireEnsure(chunkId) {');
					buf.push('\t' + publicPathCallback + '(' + this.requireFn + ', chunkId);');
					buf.push('\treturn ' + wrapperName + '(chunkId);');
					buf.push('}');

					return buf.join('\n');
				}.bind(compilation.mainTemplate));
			});
		}
	}]);

	return RuntimePublicPathPlgin;
}();

exports.default = RuntimePublicPathPlgin;