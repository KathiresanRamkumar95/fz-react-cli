import fs from 'fs';
import path from 'path';

module.exports = function(source) {
  let comNameAry = this.resourcePath.split(path.sep);
  let filePath = this.resourcePath;
  let appPath = fs.realpathSync(process.cwd());
  let changePath = filePath.replace('/lib/', '/src/');
  let comName = comNameAry[comNameAry.length - 1];
  let name = comName.substring(0, comName.lastIndexOf('.'));
  let src = fs
    .readFileSync(filePath.startsWith(appPath) ? filePath : changePath)
    .toString();
  return `${source};${name}.source=${JSON.stringify(src)}`;
};
