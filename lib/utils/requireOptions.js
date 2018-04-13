'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var setN = function setN(object, paths, value) {
	var target = object;
	var result = target;
	var length = paths.length;


	paths.reduce(function (target, path, index) {
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

var setArray = function setArray(object, paths, value) {
	var length = paths.length;

	if (length === 1) {
		if (!object) {
			//eslint-disable-next-line
			object = [];
		}
		object[Number(paths[0])] = value;
		return object;
	}
	var target = object;
	var result = target;

	paths.reduce(function (target, path, index) {
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

var requireOptions = function requireOptions() {
	var userOptions = Object.keys(process.env).filter(function (key) {
		return key.indexOf('npm_package_fz_react_cli_') >= 0;
	});

	return userOptions.reduce(function (options, key) {
		var flag = key.replace(/npm_package_fz_react_cli_/i, '');
		if (flag.indexOf('_') !== -1) {
			var nestedFlags = flag.split('_');
			var rootFlag = nestedFlags.shift();
			var lastFlag = nestedFlags[nestedFlags.length - 1];
			var num = Number(lastFlag);
			if (typeof num === 'number' && !Number.isNaN(num)) {
				options[rootFlag] = setArray(options[rootFlag], nestedFlags, process.env[key]);
			} else {
				options[rootFlag] = setN(options[rootFlag] || {}, nestedFlags, process.env[key]);
			}
		} else {
			var value = process.env[key];
			if (value === 'false' || value === 'true') {
				value = JSON.parse(value);
			}
			options[flag] = value;
		}
		return options;
	}, {});
};

exports.default = requireOptions;