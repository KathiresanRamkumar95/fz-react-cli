import docgen from 'react-docgen';
// import loaderUtils from 'loader-utils';
import path from 'path';

import { log } from '../utils';

module.exports = source => {
	this.cacheable && this.cacheable();
	// let query = loaderUtils.parseQuery(this.query);

	let value = {};
	try {
		value = docgen.parse(source);
	} catch (e) {
		log('ERROR in docgen-loader', e);
	}
	let comNameAry = this.resourcePath.split(path.sep);
	let comName = comNameAry[comNameAry.length - 1];
	let name = comName.substring(0, comName.lastIndexOf('.'));
	return source + ';' + name + '.propsObj=' + JSON.stringify(value);
};
