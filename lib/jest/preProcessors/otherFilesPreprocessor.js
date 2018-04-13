'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  process: function process(src, filename) {
    return 'module.exports = ' + JSON.stringify(_path2.default.basename(filename)) + ';';
  }
};