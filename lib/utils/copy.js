'use strict';

var path = require('path');
var fs = require('fs');
var args = process.argv.slice(2);
var appPath = fs.realpathSync(process.cwd());

var srcPath = args[0];
var targetPath = args[1];
var exts = args[2];
var isCopy = args[3] || true;
var flatten = args[4] || '';
exts = exts ? exts.split(',').map(function (ext) {
	return '.' + ext.trim();
}) : false;
srcPath = path.join(appPath, srcPath);
targetPath = targetPath === '."' || !targetPath ? '' : targetPath;
targetPath = path.join(appPath, targetPath);

var removeDirectory = function removeDirectory(dirPath) {
	fs.readdirSync(dirPath).forEach(function (fileOrDir) {
		fileOrDir = path.join(dirPath, fileOrDir);
		if (fs.statSync(fileOrDir).isDirectory()) {
			removeDirectory(fileOrDir);
		} else {
			fs.unlinkSync(fileOrDir);
		}
	});
	fs.rmdirSync(dirPath);
};

var copyFile = function copyFile(srcPath, targetPath) {
	var isCopy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	var readStream = fs.createReadStream(srcPath);
	var writeStream = fs.createWriteStream(targetPath);
	readStream.pipe(writeStream);
	if (!isCopy) {
		try {
			fs.unlinkSync(fileOrDir);
		} catch (err) {
			process.stdout.write(err);
		}
	}
};

var iterateDirectory = function iterateDirectory(srcPath, targetPath, isCopy, extensions, flatten) {
	fs.readdirSync(srcPath).forEach(function (fileOrDir) {
		var fromPath = path.join(srcPath, fileOrDir);
		var toPath = targetPath;

		if (flatten != 'flatten' || !fs.statSync(fromPath).isDirectory()) {
			toPath = path.join(targetPath, fileOrDir);
		}

		if (fs.statSync(fromPath).isDirectory()) {
			if (!fs.existsSync(toPath)) {
				fs.mkdirSync(toPath);
			}
			iterateDirectory(fromPath, toPath, isCopy, extensions, flatten);
		} else {
			if (extensions) {
				var _path$parse = path.parse(fromPath),
				    ext = _path$parse.ext;

				if (extensions.indexOf(ext) !== -1) {
					copyFile(fromPath, toPath, isCopy);
				}
			} else {
				copyFile(fromPath, toPath, isCopy);
			}
		}
	});
};

var copy = function copy(srcPath, targetPath, isCopy, exts, flatten) {
	if (fs.statSync(srcPath).isDirectory()) {
		if (!fs.existsSync(targetPath)) {
			fs.mkdirSync(targetPath);
		}

		var _path$parse2 = path.parse(srcPath),
		    name = _path$parse2.name;

		var originPath = targetPath;
		if (flatten != 'flatten') {
			originPath = path.join(targetPath, name);
			if (!fs.existsSync(originPath)) {
				fs.mkdirSync(originPath);
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
	console.log(isCopy ? 'Folder/file are copied!' : 'Folder/file are moved!');
};

copy(srcPath, targetPath, isCopy, exts, flatten);