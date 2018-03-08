'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (source, map) {
	var comNameAry = undefined.resourcePath.split(_path2.default.sep);
	var comName = comNameAry[comNameAry.length - 1];
	var name = comName.substring(0, comName.lastIndexOf('.'));
	var src = _fs2.default.readFileSync(undefined.resourcePath).toString();
	return source + ';' + name + '.source=' + JSON.stringify(src);
};