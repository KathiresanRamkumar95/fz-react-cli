'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = process.argv.slice(2);
var appPath = _fs2.default.realpathSync(process.cwd());

var _args = _slicedToArray(args, 5),
    srcPath = _args[0],
    targetPath = _args[1],
    exts = _args[2],
    _args$ = _args[3],
    isCopy = _args$ === undefined ? true : _args$,
    _args$2 = _args[4],
    flatten = _args$2 === undefined ? '' : _args$2;

exts = exts ? exts.split(',').map(function (ext) {
  return '.' + ext.trim();
}) : false;
srcPath = _path2.default.join(appPath, srcPath);
targetPath = targetPath === '."' || !targetPath ? '' : targetPath;
targetPath = _path2.default.join(appPath, targetPath);

var removeDirectory = function removeDirectory(dirPath) {
  _fs2.default.readdirSync(dirPath).forEach(function (fileOrDir) {
    var fileOrDirPath = _path2.default.join(dirPath, fileOrDir);
    if (_fs2.default.statSync(fileOrDirPath).isDirectory()) {
      removeDirectory(fileOrDirPath);
    } else {
      _fs2.default.unlinkSync(fileOrDirPath);
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

    if (flatten !== 'flatten' || !_fs2.default.statSync(fromPath).isDirectory()) {
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
  console.log(srcPath);
  if (_fs2.default.statSync(srcPath).isDirectory()) {
    if (!_fs2.default.existsSync(targetPath)) {
      _fs2.default.mkdirSync(targetPath);
    }

    var _path$parse2 = _path2.default.parse(srcPath),
        name = _path$parse2.name;

    var originPath = targetPath;
    if (flatten !== 'flatten') {
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