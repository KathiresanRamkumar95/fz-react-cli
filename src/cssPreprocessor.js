let fs = require('fs');
let postcss = require('postcss');
let plugin = require('postcss-hash-classname');
let count = 0;

module.exports = {
  process(src, filename) {
    count++;
    let opts = { hashType: 'md5', digestType: 'base32' };
    opts.maxLength = 6;
    opts.type = '.json';
    opts.outputName = `jsonFile_test_${count}`;
    let processor = postcss([plugin(opts)]);
    processor.process(src).css;
    let jsonMap = fs.readFileSync(`jsonFile_test_${count}.json`, 'UTF-8');
    return `module.exports =${jsonMap}`;
  }
};
