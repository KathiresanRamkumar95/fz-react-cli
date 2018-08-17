'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getRegex = function getRegex(regexString) {
  return regexString.map(function (str) {
    return new RegExp(str);
  });
};

var UnusedFilesFindPlugin = function () {
  function UnusedFilesFindPlugin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, UnusedFilesFindPlugin);

    this.usedFilesExcludes = getRegex(options.usedFilesExcludes);
    this.appFilesExcludes = getRegex(options.appFilesExcludes);
    this.origin = options.origin;
    this.delete = options.delete;
    this.outputFileName = options.outputFileName;
    if (!this.origin) {
      throw new Error('You must provide origin point of the app');
    }
  }

  _createClass(UnusedFilesFindPlugin, [{
    key: 'isIgnoredUsedFile',
    value: function isIgnoredUsedFile(file) {
      var result = void 0;
      for (var i = 0; i < this.usedFilesExcludes.length; i++) {
        var exclude = this.usedFilesExcludes[i];
        result = exclude.test(file);
        if (result) {
          break;
        }
      }
      return result;
    }
  }, {
    key: 'isIgnoredAllFile',
    value: function isIgnoredAllFile(file) {
      var result = void 0;
      for (var i = 0; i < this.appFilesExcludes.length; i++) {
        var exclude = this.appFilesExcludes[i];
        result = exclude.test(file);
        if (result) {
          break;
        }
      }
      return result;
    }
  }, {
    key: 'getAllFiles',
    value: function getAllFiles(rootPath) {
      var _this = this;

      var allFiles = [];
      var files = _fs2.default.readdirSync(rootPath).map(function (file) {
        return _path2.default.join(rootPath, file);
      });
      files.forEach(function (file) {
        if (_fs2.default.statSync(file).isDirectory()) {
          allFiles = allFiles.concat(_this.getAllFiles(file));
        } else {
          if (!_this.isIgnoredAllFile(file)) {
            allFiles.push(file);
          }
        }
      });
      return allFiles;
    }
  }, {
    key: 'apply',
    value: function apply(compiler) {
      var _this2 = this;

      compiler.hooks.afterEmit.tap('UnusedFilesShowPlugin', function (compilation) {
        var outputPath = compilation.compiler.options.output.path;

        var usedFiles = Array.from(compilation.fileDependencies).reduce(function (files, usedFile) {
          if (!_this2.isIgnoredUsedFile(usedFile)) {
            files[usedFile] = true;
          }
          return files;
        }, {});

        var allFiles = _this2.getAllFiles(_this2.origin);

        var unusedFiles = [];
        allFiles.forEach(function (file) {
          if (!usedFiles[file]) {
            unusedFiles.push(file);
          }
        });

        if (!unusedFiles.length) {
          (0, _utils.log)('There is no unused files');
        } else {
          if (_this2.outputFileName) {
            (0, _utils.log)('You can see unused files info from ' + _path2.default.join(outputPath, _this2.outputFileName) + ' path');
            (0, _utils.makeDir)(outputPath);
            (0, _utils.writeFile)(_path2.default.join(outputPath, _this2.outputFileName), JSON.stringify(unusedFiles));
          }
        }

        if (_this2.delete) {
          unusedFiles.forEach(function (file) {
            _fs2.default.unlinkSync(file);
            (0, _utils.log)('Deleted - ' + file);
          });
        }
      });
    }
  }]);

  return UnusedFilesFindPlugin;
}();

exports.default = UnusedFilesFindPlugin;