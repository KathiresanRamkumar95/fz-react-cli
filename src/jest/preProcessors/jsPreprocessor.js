import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
	presets: ['babel-preset-env', 'babel-preset-react']
});
