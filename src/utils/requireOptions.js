let setN = (object, paths, value) => {
	let target = object;
	let result = target;
	let { length } = paths;

	paths.reduce((target, path, index) => {
		if (!target[path]) {
			target[path] = {};
		}

		if (length - 1 === index) {
			target[path] = value;
		}
		return target[path];
	}, target);

	return result;
};

let requireOptions = () => {
	let userOptions = Object.keys(process.env).filter(key => {
		return key.indexOf('npm_package_fz_react_cli_') >= 0;
	});

	return userOptions.reduce((options, key) => {
		let flag = key.replace(/npm_package_fz_react_cli_/i, '');
		if (flag.indexOf('_') !== -1) {
			let nestedFlags = flag.split('_');
			let rootFlag = nestedFlags.shift();
			options[rootFlag] = setN(
				options[rootFlag] || {},
				nestedFlags,
				process.env[key]
			);
		} else {
			options[flag] = userOptions[key];
		}
		return options;
	}, {});
};

export default requireOptions;
