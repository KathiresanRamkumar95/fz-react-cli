'use strict';

var fs = require('fs');
var path = require('path');
module.exports = function (appFolder) {
  var forCommittedFiles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var appPath = fs.realpathSync(process.cwd());
  if (forCommittedFiles) {
    return {
      coverageReporters: ['json', 'html', 'json-summary', 'text'],
      coverageDirectory: path.resolve(appPath, 'commitCoverage'),
      collectCoverage: true,
      transform: {
        '^.+\\.(js|jsx)$': path.resolve(__dirname, '..', 'jsPreprocessor.js'),
        '^.+\\.css$': path.resolve(__dirname, '..', 'cssPreprocessor.js'),
        '^(?!.*\\.(js|jsx|css|json)$)': path.resolve(__dirname, '..', 'otherFilesPreprocessor.js')
      },
      moduleFileExtensions: ['js'],
      testResultsProcessor: path.resolve(__dirname, '..', 'coverageResult.js')
    };
  }

  return {
    rootDir: appPath,
    testPathIgnorePatterns: ['/node_modules/', 'docs'],
    unmockedModulePathPatterns: ['__tests__', 'node_modules', '.*'],
    testPathDirs: ['<rootDir>/' + appFolder + '/'],
    //collectCoverageFrom: [`<rootDir>/${appFolder}/`],
    collectCoverage: true,
    coverageReporters: ['json', 'html', 'json-summary', 'text'],
    moduleFileExtensions: ['js', 'jsx'],
    testRegex: '(/__tests__/.*|\\.(test|spec))\\.(jsx|js|json|node)$',
    moduleNameMapper: {
      '\\.(css|less)$': 'identity-obj-proxy'
    },
    transform: {
      '^.+\\.(js|jsx)$': path.resolve(__dirname, '..', 'jsPreprocessor.js'),
      '^.+\\.css$': path.resolve(__dirname, '..', 'cssPreprocessor.js'),
      '^(?!.*\\.(js|jsx|css|json)$)': path.resolve(__dirname, '..', 'otherFilesPreprocessor.js')
    },
    testResultsProcessor: path.resolve(__dirname, '..', 'result.js'),
    setupFiles: [path.resolve(__dirname, '..', 'setup.js')],
    globals: {
      __DEVELOPMENT__: true,
      __DOCS__: false,
      __TEST__: true
    },
    moduleDirectories: [path.resolve(__dirname, '..', '..', 'node_modules'), 'node_modules']
  };
};