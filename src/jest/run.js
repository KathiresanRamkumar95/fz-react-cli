import jest from 'jest';

import { getOptions } from '../utils';

let options = getOptions();
let {
  app: { folder }
} = options;

let argv = process.argv.slice(2);

let config = require('../configs/jest.config');

argv.push('--config', JSON.stringify(config(folder)), '--no-cache');
jest.run(argv);
