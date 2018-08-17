'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _schemas = require('../schemas');

var _schemas2 = _interopRequireDefault(_schemas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaulter = function defaulter(target, source) {
  var defaultObject = {};

  Object.keys(target).forEach(function (key) {
    var data = target[key];
    if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
      if (typeof data.cli === 'string') {
        var cliData = typeof process.env['npm_config_' + data.cli] === 'string' && process.env['npm_config_' + data.cli] || source && source[key] || data.value;

        if (typeof data.value === 'boolean') {
          cliData = cliData === 'true' ? true : false;
        }

        defaultObject[key] = cliData;
      } else {
        defaultObject[key] = defaulter(data, source && source[key] ? source[key] : {});
      }
    } else {
      defaultObject[key] = (typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object' && source[key] !== null && typeof source[key] !== 'undefined' ? source[key] : target[key];
    }
  });

  return defaultObject;
};

var getOptions = function getOptions() {
  var appPath = process.cwd();
  var userSchemas = void 0;
  var packagePath = _path2.default.join(appPath, 'package.json');

  if (_fs2.default.existsSync(packagePath)) {
    userSchemas = require(packagePath)['react-cli'] || {};
  }

  var options = defaulter(_schemas2.default, userSchemas || {});
  options.packageVersion = process.env.npm_package_version;
  return options;
};

exports.default = getOptions;