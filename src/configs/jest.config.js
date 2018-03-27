import path from 'path';

module.exports = function(appFolder) {
	var appPath = process.cwd();
	return {
		rootDir: appPath,
		testPathIgnorePatterns: ['/node_modules/', 'docs'],
		unmockedModulePathPatterns: ['__tests__', 'node_modules', '.*'],
		testPathDirs: ['<rootDir>/' + appFolder + '/'],
		collectCoverage: true,
		coverageReporters: ['json', 'html', 'json-summary', 'text'],
		moduleFileExtensions: ['js'],
		testRegex: '(/__tests__/.*|\\.(test|spec))\\.(js|json|node)$',
		moduleNameMapper: {
			'\\.(css|less)$': 'identity-obj-proxy'
		},
		transform: {
			'^.+\\.js$': path.resolve(
				__dirname,
				'..',
				'jest',
				'preProcessors',
				'jsPreprocessor.js'
			),
			'^.+\\.css$': path.resolve(
				__dirname,
				'..',
				'jest',
				'preProcessors',
				'cssPreprocessor.js'
			),
			'^(?!.*\\.(js|css|json)$)': path.resolve(
				__dirname,
				'..',
				'jest',
				'preProcessors',
				'otherFilesPreprocessor.js'
			)
		},
		testResultsProcessor: path.resolve(
			__dirname,
			'..',
			'jest',
			'result.js'
		),
		setupFiles: [path.resolve(__dirname, '..', 'jest', 'setup.js')],
		globals: {
			__DEVELOPMENT__: true,
			__DOCS__: false,
			__TEST__: true
		},
		moduleDirectories: [
			path.resolve(__dirname, '..', '..', 'node_modules'),
			'node_modules'
		]
	};
};
