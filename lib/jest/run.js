'use strict';

var _jest = require('jest');

var _jest2 = _interopRequireDefault(_jest);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _utils.getOptions)();
var folder = options.app.folder;


var argv = process.argv.slice(2);

var config = require('../configs/jest.config');

argv.push('--config', JSON.stringify(config(folder)), '--no-cache');
_jest2.default.run(argv);