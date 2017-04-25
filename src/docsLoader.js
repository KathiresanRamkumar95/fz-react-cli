var fs = require('fs');
var path = require('path');
module.exports = function (source,map){
      var comNameAry = this.resourcePath.split(path.sep);
      var comName = comNameAry[comNameAry.length-1]
      var name = comName.substring(0, comName.lastIndexOf(".") )
      var src = fs.readFileSync(this.resourcePath).toString()
      return source+";"+name+".source="+JSON.stringify(src);
}