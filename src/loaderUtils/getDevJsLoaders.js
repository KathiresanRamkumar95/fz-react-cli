import path from 'path';

let getDevJsLoaders = needEslinting => {
	let loaders = [
		{
			loader: 'babel-loader',
			options: {
				presets: [
					[require.resolve('babel-preset-env'), { modules: false }],
					require.resolve('babel-preset-react')
				],
				plugins: [
					[
						require.resolve('babel-plugin-transform-runtime'),
						{
							helpers: true,
							polyfill: true,
							regenerator: false,
							moduleName: 'babel-runtime'
						}
					]
				],
				cacheDirectory: true
			}
		}
	];

	if (needEslinting) {
		loaders.push({
			loader: 'eslint-loader',
			options: {
				emitError: true,
				emitWarning: true,
				configFile: path.join(__dirname, '..', '..', '.eslintrc.js')
			}
		});
	}

    return loaders;
};

export default getDevJsLoaders;
