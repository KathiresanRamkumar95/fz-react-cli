"use strict";

var fs = require('fs');
module.exports = function () {
  var appPath = fs.realpathSync(process.cwd());
  return {
    "rootDir": appPath,
    "testPathIgnorePatterns": ["/node_modules/"],
    "unmockedModulePathPatterns": ["__tests__", "node_modules", ".*"],
    "testPathDirs": ["<rootDir>/__tests__/"],
    "collectCoverage": true,
    "coverageReporters": ["json", "html", "json-summary", "text"],
    "moduleFileExtensions": ["js", "jsx"],
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(jsx|js|json|node)$",
    "testResultsProcessor": "./result.js",
    "transform": "../preprocessor.js",
    "setupFiles": ["../setup.jsx"]
  };
};