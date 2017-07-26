var docgen = require('react-docgen');
var loaderUtils = require('loader-utils');
var path = require('path');
module.exports = function(source) {
  this.cacheable && this.cacheable();
  var query = loaderUtils.parseQuery(this.query);

  var value = {};
  try {
    value = docgen.parse(source);
  } catch (e) {
    console.log('ERROR in docgen-loader', e);
  }
  var comNameAry = this.resourcePath.split(path.sep);
  var comName = comNameAry[comNameAry.length - 1];
  var name = comName.substring(0, comName.lastIndexOf('.'));
  return source + ';' + name + '.propsObj=' + JSON.stringify(value);
};
