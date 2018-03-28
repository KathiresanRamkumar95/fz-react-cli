import jest from 'jest';

import { getOptions, requireOptions } from '../utils';
import defaultOptions from '../defaultOptions';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { app } = options;
let { folder } = app;

let argv = process.argv.slice(2);

let config = require('./configs/jest.config');

argv.push('--config', JSON.stringify(config(folder)), '--no-cache');
jest.run(argv);
