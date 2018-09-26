'use strict';

var path = require('path');
var os = require('os');
var spawn = require('cross-spawn');
var config = require('./config/jest.config');

var isNodeModuleUnderAppFolder = __dirname.indexOf(process.cwd()) != -1;
var jest = !isNodeModuleUnderAppFolder ? path.join(__dirname, '..', 'node_modules', '.bin', 'jest') : 'jest';

var isWindows = os.platform().toLowerCase() === 'win32';
if (isWindows) {
  jest += '.cmd';
}

var results = spawn.sync(jest, ['--lastCommit', '--coverage', '-o', '--config', JSON.stringify(config(null, true))], {
  encoding: 'utf8'
});

console.log(results.output[1]);