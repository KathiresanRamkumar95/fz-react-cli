'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = process.argv.slice(2);
var appPath = _fs2.default.realpathSync(process.cwd());

var srcPath = args[0];
var targetPath = args[1];
var exts = args[2];
var isCopy = args[3] || true;
var flatten = args[4] || '';
exts = exts ? exts.split(',').map(function (ext) {
	return '.' + ext.trim();
}) : false;
srcPath = _path2.default.join(appPath, srcPath);
targetPath = targetPath === '."' || !targetPath ? '' : targetPath;
targetPath = _path2.default.join(appPath, targetPath);

var removeDirectory = function removeDirectory(dirPath) {
	_fs2.default.readdirSync(dirPath).forEach(function (fileOrDir) {
		fileOrDir = _path2.default.join(dirPath, fileOrDir);
		if (_fs2.default.statSync(fileOrDir).isDirectory()) {
			removeDirectory(fileOrDir);
		} else {
			_fs2.default.unlinkSync(fileOrDir);
		}
	});
	_fs2.default.rmdirSync(dirPath);
};

var copyFile = function copyFile(srcPath, targetPath) {
	var isCopy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	var readStream = _fs2.default.createReadStream(srcPath);
	var writeStream = _fs2.default.createWriteStream(targetPath);
	readStream.pipe(writeStream);

	writeStream.on('finish', function () {
		if (!isCopy) {
			_fs2.default.unlinkSync(srcPath);
		}
	});
};

var iterateDirectory = function iterateDirectory(srcPath, targetPath, isCopy, extensions, flatten) {
	_fs2.default.readdirSync(srcPath).forEach(function (fileOrDir) {
		var fromPath = _path2.default.join(srcPath, fileOrDir);
		var toPath = targetPath;

		if (flatten != 'flatten' || !_fs2.default.statSync(fromPath).isDirectory()) {
			toPath = _path2.default.join(targetPath, fileOrDir);
		}

		if (_fs2.default.statSync(fromPath).isDirectory()) {
			if (!_fs2.default.existsSync(toPath)) {
				_fs2.default.mkdirSync(toPath);
			}
			iterateDirectory(fromPath, toPath, isCopy, extensions, flatten);
		} else {
			if (extensions) {
				var _path$parse = _path2.default.parse(fromPath),
				    ext = _path$parse.ext;

				if (extensions.indexOf(ext) !== -1) {
					copyFile(fromPath, toPath);
				}
			} else {
				copyFile(fromPath, toPath);
			}
		}
	});
};

var copy = function copy(srcPath, targetPath, isCopy, exts, flatten) {
	if (_fs2.default.statSync(srcPath).isDirectory()) {
		if (!_fs2.default.existsSync(targetPath)) {
			_fs2.default.mkdirSync(targetPath);
		}

		var _path$parse2 = _path2.default.parse(srcPath),
		    name = _path$parse2.name;

		var originPath = targetPath;
		if (flatten != 'flatten') {
			originPath = _path2.default.join(targetPath, name);
			if (!_fs2.default.existsSync(originPath)) {
				_fs2.default.mkdirSync(originPath);
			}
		}
		iterateDirectory(srcPath, originPath, isCopy, exts, flatten);
	} else {
		/* direct file copy issue there but that feature not needed i think*/
		copyFile(srcPath, targetPath, isCopy);
	}
	if (!isCopy) {
		removeDirectory(srcPath);
	}
	(0, _index.log)(isCopy ? 'Folder/file are copied!' : 'Folder/file are moved!');
};

copy(srcPath, targetPath, isCopy, exts, flatten);