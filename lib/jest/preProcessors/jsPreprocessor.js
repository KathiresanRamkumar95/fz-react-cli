'use strict';

var _babelJest = require('babel-jest');

var _babelJest2 = _interopRequireDefault(_babelJest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _babelJest2.default.createTransformer({
	presets: ['babel-preset-env', 'babel-preset-react']
});