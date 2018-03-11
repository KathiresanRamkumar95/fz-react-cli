'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.makeDir = exports.writeFile = exports.log = exports.getServerURL = exports.createEventStream = exports.requireOptions = exports.getOptions = undefined;

var _getOptions = require('./getOptions');

Object.defineProperty(exports, 'getOptions', {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_getOptions).default;
	}
});

var _requireOptions = require('./requireOptions');

Object.defineProperty(exports, 'requireOptions', {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_requireOptions).default;
	}
});

var _createEventStream = require('./createEventStream');

Object.defineProperty(exports, 'createEventStream', {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_createEventStream).default;
	}
});

var _getServerURL = require('./getServerURL');

Object.defineProperty(exports, 'getServerURL', {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_getServerURL).default;
	}
});

var _stream = require('stream');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = exports.log = function log() {
	var print = console;
	print.log.apply(print, arguments);
};

var writeFile = exports.writeFile = function writeFile(outputPath, src) {
	var isPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	return new Promise(function (resolve, reject) {
		var inStr = void 0;
		if (isPath) {
			inStr = _fs2.default.createReadStream(src);
		} else {
			inStr = new _stream.Readable();
			inStr._read = function () {};
			inStr.push(src);
			inStr.push(null);
		}
		var outStr = _fs2.default.createWriteStream(outputPath);
		outStr.on('finish', function () {
			resolve();
		});
		inStr.pipe(outStr);
	});
};

var makeDir = exports.makeDir = function makeDir(paths) {
	if (typeof paths === 'string') {
		paths = [paths];
	}
	paths.forEach(function (path) {
		if (!_fs2.default.existsSync(path)) {
			_fs2.default.mkdirSync(path);
		}
	});
};