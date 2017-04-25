'use strict';

var postcss = require('postcss');
var plugin = require('postcss-hash-classname');
var count = 0;

module.exports = {
    process: function process(src, filename) {
        count++;
        var opts = { hashType: 'md5', digestType: 'base32' };
        opts.maxLength = 6;
        opts.type = '.json';
        opts.outputName = 'jsonFile_test_' + count;
        var processor = postcss([plugin(opts)]);
        processor.process(src).css;
        var jsonMap = fs.readFileSync("jsonFile_test_" + count + ".json", "UTF-8");
        return "module.exports =" + jsonMap;
    }
};