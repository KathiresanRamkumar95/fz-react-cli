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
			target[path] = value;
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
			options[rootFlag] = setN(options[rootFlag] || {}, nestedFlags, process.env[key]);
		} else {
			options[flag] = userOptions[key];
		}
		return options;
	}, {});
};

exports.default = requireOptions;