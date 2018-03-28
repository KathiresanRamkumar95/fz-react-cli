export default {
	presets: [['env', { modules: false }]],
	plugins: [
		[
			'transform-runtime',
			{
				helpers: true,
				polyfill: true,
				regenerator: false,
				moduleName: 'babel-runtime'
			}
		]
	]
};
