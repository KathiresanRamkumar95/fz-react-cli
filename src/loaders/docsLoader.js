import fs from 'fs';
import path from 'path';

module.exports = source => {
	let comNameAry = this.resourcePath.split(path.sep);
	let comName = comNameAry[comNameAry.length - 1];
	let name = comName.substring(0, comName.lastIndexOf('.'));
	let src = fs.readFileSync(this.resourcePath).toString();
	return `${source  };${  name  }.source=${  JSON.stringify(src)}`;
};
