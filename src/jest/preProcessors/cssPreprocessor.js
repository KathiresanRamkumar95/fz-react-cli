import postCss from 'postcss';
import plugin from 'postcss-hash-classname';

let count = 0;

module.exports = {
	process: function(src, filename) {
		count++;
		let opts = { hashType: 'md5', digestType: 'base32' };
		opts.maxLength = 6;
		opts.type = '.json';
		opts.outputName = 'jsonFile_test_' + count;
		let processor = postCss([plugin(opts)]);
		processor.process(src).css;
		let jsonMap = fs.readFileSync(
			'jsonFile_test_' + count + '.json',
			'UTF-8'
		);
		return 'module.exports =' + jsonMap;
	}
};
