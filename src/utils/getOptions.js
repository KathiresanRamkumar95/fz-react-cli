import fs from 'fs';
import path from 'path';

import schemas from '../schemas';

let defaulter = (target, source) => {
  let defaultObject = {};

  Object.keys(target).forEach(key => {
    let data = target[key];
    if (data && typeof data === 'object') {
      if (typeof data.cli === 'string') {
        let cliData =
          (typeof process.env[`npm_config_${data.cli}`] === 'string' &&
            process.env[`npm_config_${data.cli}`]) ||
          (source && source[key]) ||
          data.value;

        if (typeof data.value === 'boolean') {
          cliData = cliData === 'true' ? true : false;
        }

        defaultObject[key] = cliData;
      } else {
        defaultObject[key] = defaulter(
          data,
          source && source[key] ? source[key] : {}
        );
      }
    } else {
      defaultObject[key] =
        typeof source === 'object' &&
        source[key] !== null &&
        typeof source[key] !== 'undefined'
          ? source[key]
          : target[key];
    }
  });

  return defaultObject;
};

let getOptions = () => {
  let appPath = process.cwd();
  let userSchemas;
  let packagePath = path.join(appPath, 'package.json');

  if (fs.existsSync(packagePath)) {
    userSchemas = require(packagePath)['react-cli'] || {};
  }

  let options = defaulter(schemas, userSchemas || {});
  options.packageVersion = process.env.npm_package_version;
  return options;
};

export default getOptions;
