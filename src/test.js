var jest = require('jest');
var argv = process.argv.slice(2);
var appFolder = process.env.npm_config_app_folder || 'src';
var config = require('./config/jest.config');
argv.push('--config', JSON.stringify(config(appFolder)),'--no-cache');
jest.run(argv);
