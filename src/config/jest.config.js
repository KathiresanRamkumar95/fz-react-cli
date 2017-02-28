var fs = require('fs');
var path = require('path');
module.exports =function(){
  var appPath = fs.realpathSync(process.cwd());
  return {
      "rootDir": appPath,
      "testPathIgnorePatterns": [
        "/node_modules/",
        "docs"
      ],
      "unmockedModulePathPatterns": [
        "__tests__",
        "node_modules",
        ".*"
      ],
      "testPathDirs": [
        "<rootDir>/__tests__/",
        "<rootDir>/src/"
      ],
      "collectCoverage": true,
      "coverageReporters": [
        "json",
        "html",
        "json-summary",
        "text"
      ],
      "moduleFileExtensions": [
        "js",
        "jsx"
      ],
      "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(jsx|js|json|node)$",
      "moduleNameMapper": {
        "\\.(css|less)$": "identity-obj-proxy"
      },
        "transform": {".js":  path.resolve(__dirname,"..","preprocessor.js")},
      "setupFiles": [
        path.resolve(__dirname,"..","setup.js")
      ]
    }
}