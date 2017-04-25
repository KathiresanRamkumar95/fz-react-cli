'use strict';

var path = require('path');
module.exports = {
  process: function process(src, filename) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  }
};