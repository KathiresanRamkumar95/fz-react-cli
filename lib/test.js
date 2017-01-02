'use strict';

var jest = require('jest');
var argv = process.argv.slice(2);
var config = require('./config/jest.config');

argv.push('--config', JSON.stringify(config()));
jest.run(argv);