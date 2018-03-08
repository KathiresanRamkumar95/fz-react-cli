'use strict';

var _jest = require('jest');

var _jest2 = _interopRequireDefault(_jest);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var app = options.app;
var folder = app.folder;


var argv = process.argv.slice(2);

var config = require('./configs/jest.config');

argv.push('--config', JSON.stringify(config(folder)), '--no-cache');
_jest2.default.run(argv);