'use strict';

var _child_process = require('child_process');

var args = process.argv.slice(2);

args.forEach(function (arg) {
  if (arg.startsWith('-')) {
    //eslint-disable-next-line
    arg = arg.substring(2);
  }

  (0, _child_process.execSync)('npm config set ' + arg);
});