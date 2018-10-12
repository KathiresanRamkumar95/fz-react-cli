'use strict';

var jest = require('jest');
var argv = process.argv.slice(2);
var appFolder = process.env.npm_config_app_folder || 'src';
var coverage = process.env.npm_config_commit_coverage || false;
if (coverage) {
  var config = require('./config/jest.config');
  argv.push('--lastCommit', '-o', '--config', JSON.stringify(config(null, true)), '--no-cache');
} else {
  var _config = require('./config/jest.config');
  argv.push('--config', JSON.stringify(_config(appFolder)), '--no-cache');
}
jest.run(argv);