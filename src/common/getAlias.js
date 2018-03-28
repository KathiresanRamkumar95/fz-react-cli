let getAlias = options => {
	let alias = {};
	let { isPreactMig } = options;
	if (isPreactMig) {
		alias.react = 'preact';
		alias['react-dom'] = 'preact-compat';
	}
	return alias;
};

export default getAlias;
