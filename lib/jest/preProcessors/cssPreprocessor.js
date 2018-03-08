'use strict';

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _postcssHashClassname = require('postcss-hash-classname');

var _postcssHashClassname2 = _interopRequireDefault(_postcssHashClassname);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var count = 0;

module.exports = {
	process: function process(src, filename) {
		count++;
		var opts = { hashType: 'md5', digestType: 'base32' };
		opts.maxLength = 6;
		opts.type = '.json';
		opts.outputName = 'jsonFile_test_' + count;
		var processor = (0, _postcss2.default)([(0, _postcssHashClassname2.default)(opts)]);
		processor.process(src).css;
		var jsonMap = fs.readFileSync('jsonFile_test_' + count + '.json', 'UTF-8');
		return 'module.exports =' + jsonMap;
	}
};