'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (appFolder) {
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
      '^.+\\.js$': _path2.default.resolve(__dirname, '..', 'jest', 'preProcessors', 'jsPreprocessor.js'),
      '^.+\\.css$': _path2.default.resolve(__dirname, '..', 'jest', 'preProcessors', 'cssPreprocessor.js'),
      '^(?!.*\\.(js|css|json)$)': _path2.default.resolve(__dirname, '..', 'jest', 'preProcessors', 'otherFilesPreprocessor.js')
    },
    testResultsProcessor: _path2.default.resolve(__dirname, '..', 'jest', 'result.js'),
    setupFiles: [_path2.default.resolve(__dirname, '..', 'jest', 'setup.js')],
    globals: {
      __DEVELOPMENT__: true,
      __DOCS__: false,
      __TEST__: true
    },
    moduleDirectories: [_path2.default.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  };
};