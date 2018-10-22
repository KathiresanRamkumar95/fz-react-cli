'use strict';

let jest = require('jest');
let argv = process.argv.slice(2);
let appFolder = process.env.npm_config_app_folder || 'src';
let coverage = process.env.npm_config_commit_coverage || false;
if (coverage) {
  let config = require('./config/jest.config');
  argv.push(
    '--lastCommit',
    '-o',
    '--config',
    JSON.stringify(config(null, true)),
    '--no-cache'
  );
} else {
  let config = require('./config/jest.config');
  argv.push('--config', JSON.stringify(config(appFolder)), '--no-cache');
}
jest.run(argv);
