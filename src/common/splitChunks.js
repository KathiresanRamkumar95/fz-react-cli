import path from 'path';

let isVendor = module => {
	let { userRequest } = module;
	return (
		userRequest &&
		userRequest.indexOf('node_modules') >= 0 &&
		userRequest.indexOf(`node_modules${path.sep}react`) === -1 &&
		userRequest.indexOf('.css') === -1 &&
		userRequest.indexOf('publicPathConfig.js') === -1
	);
};

let isReact = module => {
	let { userRequest } = module;
	return (
		userRequest && userRequest.indexOf(`node_modules${path.sep}react`) >= 0
	);
};

export default {
	cacheGroups: {
		default: false,
		'react.vendor': {
			name: 'react.vendor',
			chunks: 'all',
			minChunks: 1,
			test: isReact
		},
		vendor: {
			name: 'vendor',
			chunks: 'all',
			minChunks: 1,
			test: isVendor
		}
	}
};
