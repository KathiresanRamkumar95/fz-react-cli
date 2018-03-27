let iterateOptions = (defaultOptions, userOptions) => {
	return Object.keys(defaultOptions).reduce((options, key) => {
		let option = defaultOptions[key];
		if (option && typeof option === 'object' && !Array.isArray(option)) {
			options[key] = iterateOptions(option, userOptions[key] || {});
		} else {
			if (typeof userOptions[key] === 'boolean') {
				options[key] =
					userOptions[key] !== undefined
						? userOptions[key]
						: defaultOptions[key];
			} else {
				options[key] = userOptions[key] || defaultOptions[key];
			}
		}
		return options;
	}, {});
};

let getOptions = (defaultOptions, userOptions = false) => {
	if (!userOptions) {
		return defaultOptions;
	}
	return iterateOptions(defaultOptions, userOptions);
};

export default getOptions;
