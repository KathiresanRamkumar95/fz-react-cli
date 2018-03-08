'use strict';

var _reactDocgen = require('react-docgen');

var _reactDocgen2 = _interopRequireDefault(_reactDocgen);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (source) {
	undefined.cacheable && undefined.cacheable();
	var query = _loaderUtils2.default.parseQuery(undefined.query);

	var value = {};
	try {
		value = _reactDocgen2.default.parse(source);
	} catch (e) {
		(0, _utils.log)('ERROR in docgen-loader', e);
	}
	var comNameAry = undefined.resourcePath.split(_path2.default.sep);
	var comName = comNameAry[comNameAry.length - 1];
	var name = comName.substring(0, comName.lastIndexOf('.'));
	return source + ';' + name + '.propsObj=' + JSON.stringify(value);
};