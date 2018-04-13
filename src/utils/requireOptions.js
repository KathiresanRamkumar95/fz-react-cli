let setN = (object, paths, value) => {
  let target = object;
  let result = target;
  let { length } = paths;

  paths.reduce((target, path, index) => {
    if (!target[path]) {
      target[path] = {};
    }

    if (length - 1 === index) {
      if (value === 'false' || value === 'true') {
        //eslint-disable-next-line
				value = JSON.parse(value);
      }
      target[path] = value;
    }
    return target[path];
  }, target);

  return result;
};

let setArray = (object, paths, value) => {
  let { length } = paths;
  if (length === 1) {
    if (!object) {
      //eslint-disable-next-line
			object = [];
    }
    object[Number(paths[0])] = value;
    return object;
  }
  let target = object;
  let result = target;

  paths.reduce((target, path, index) => {
    if (index === length - 1) {
      if (value === 'false' || value === 'true') {
        //eslint-disable-next-line
				value = JSON.parse(value);
      }
      target[Number(path)] = value;
    } else if (index === length - 2) {
      if (!target[path]) {
        target[path] = [];
      }
    } else {
      if (!target[path]) {
        target[path] = {};
      }
    }
    return target[path];
  }, target);

  return result;
};

let requireOptions = () => {
  let userOptions = Object.keys(process.env).filter(
    key => key.indexOf('npm_package_fz_react_cli_') >= 0
  );

  return userOptions.reduce((options, key) => {
    let flag = key.replace(/npm_package_fz_react_cli_/i, '');
    if (flag.indexOf('_') !== -1) {
      let nestedFlags = flag.split('_');
      let rootFlag = nestedFlags.shift();
      let lastFlag = nestedFlags[nestedFlags.length - 1];
      let num = Number(lastFlag);
      if (typeof num === 'number' && !Number.isNaN(num)) {
        options[rootFlag] = setArray(
          options[rootFlag],
          nestedFlags,
          process.env[key]
        );
      } else {
        options[rootFlag] = setN(
          options[rootFlag] || {},
          nestedFlags,
          process.env[key]
        );
      }
    } else {
      let value = process.env[key];
      if (value === 'false' || value === 'true') {
        value = JSON.parse(value);
      }
      options[flag] = value;
    }
    return options;
  }, {});
};

export default requireOptions;
