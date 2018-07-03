'use strict';

var fs = require('fs');
var path = require('path');
module.exports = function (source, map) {
  var comNameAry = this.resourcePath.split(path.sep);
  var filePath = this.resourcePath;
  var appPath = fs.realpathSync(process.cwd());
  var changePath = filePath.replace('/lib/', '/src/');
  var comName = comNameAry[comNameAry.length - 1];
  var name = comName.substring(0, comName.lastIndexOf('.'));
  var src = fs.readFileSync(filePath.startsWith(appPath) ? filePath : changePath).toString();
  return source + ';' + name + '.source=' + JSON.stringify(src);
};