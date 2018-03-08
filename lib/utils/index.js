'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getOptions = require('./getOptions');

Object.defineProperty(exports, 'getOptions', {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_getOptions).default;
	}
});

var _setOptions = require('./setOptions');

Object.defineProperty(exports, 'setOptions', {
	enumerable: true,
	get: function get() {
		return _interopRequireDefault(_setOptions).default;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = exports.log = function log() {
	var print = console;
	print.apply(undefined, arguments);
};