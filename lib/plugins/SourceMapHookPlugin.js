'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _optimizeJs = require('optimize-js');

var _optimizeJs2 = _interopRequireDefault(_optimizeJs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SourceMapHookPlugin = function () {
	function SourceMapHookPlugin() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SourceMapHookPlugin);

		this.optimize = options.optimize;
	}

	_createClass(SourceMapHookPlugin, [{
		key: 'apply',
		value: function apply(compiler) {
			var _this = this;

			compiler.hooks.afterEmit.tapAsync('SourceMapHookPlugin', function (compilation, callback) {
				var outputPath = compilation.options.output.path;

				var jsPath = _path2.default.join(outputPath, 'js');
				var smapJsPath = _path2.default.join(outputPath, 'js-sm');
				(0, _utils.makeDir)([outputPath, jsPath, smapJsPath]);

				var promises = [];
				var files = _fs2.default.readdirSync(jsPath);
				files.forEach(function (file) {
					var src = _fs2.default.readFileSync(_path2.default.join(jsPath, file)).toString();
					var optimizedSrc = void 0;
					if (_this.optimize) {
						optimizedSrc = (0, _optimizeJs2.default)(src);
					} else {
						optimizedSrc = src;
					}
					src += '\n//# sourceMappingURL=../smap/' + file + '.map';
					promises.push((0, _utils.writeFile)(_path2.default.join(jsPath, file), optimizedSrc));
					promises.push((0, _utils.writeFile)(_path2.default.join(smapJsPath, file), src));
				});

				Promise.all(promises).then(function () {
					(0, _utils.log)('Source map hook completed');
					callback();
				});
			});
		}
	}]);

	return SourceMapHookPlugin;
}();

exports.default = SourceMapHookPlugin;