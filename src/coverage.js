let path = require('path');
let os = require('os');
let spawn = require('cross-spawn');
let config = require('./config/jest.config');

var isNodeModuleUnderAppFolder = __dirname.indexOf(process.cwd()) != -1;
var jest = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'jest')
  : 'jest';

let isWindows = os.platform().toLowerCase() === 'win32';
if (isWindows) {
  jest += '.cmd';
}

let results = spawn.sync(
  jest,
  [
    '--lastCommit',
    '--coverage',
    '-o',
    '--config',
    JSON.stringify(config(null, true))
  ],
  {
    encoding: 'utf8'
  }
);

console.log(results.output[1]);
