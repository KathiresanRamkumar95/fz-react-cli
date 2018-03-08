'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _splitChunks = require('./splitChunks');

Object.defineProperty(exports, 'splitChunks', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_splitChunks).default;
  }
});

var _getEntries = require('./getEntries');

Object.defineProperty(exports, 'getEntries', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getEntries).default;
  }
});

var _getAlias = require('./getAlias');

Object.defineProperty(exports, 'getAlias', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getAlias).default;
  }
});

var _getInsertIntoFunction = require('./getInsertIntoFunction');

Object.defineProperty(exports, 'getInsertIntoFunction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getInsertIntoFunction).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }