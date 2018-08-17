'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPreCommitHook = exports.getGitRootDir = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getGitRootDir = exports.getGitRootDir = function getGitRootDir() {
  try {
    return (0, _child_process.execSync)('git rev-parse --show-toplevel').toString();
  } catch (e) {
    return false;
  }
};

var initPreCommitHook = exports.initPreCommitHook = function initPreCommitHook() {
  var forReactCLI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var gitRootDir = getGitRootDir();
  if (gitRootDir) {
    var precommit = _fs2.default.readFileSync(_path2.default.join(__dirname, '../sh/pre-commit.sh')).toString();

    var targetPath = _path2.default.join(gitRootDir, '.git', 'hooks', 'pre-commit').replace(/\s/g, '');

    if (_fs2.default.existsSync(targetPath + '.sample')) {
      _fs2.default.renameSync(targetPath + '.sample', targetPath);
      _fs2.default.writeFileSync(targetPath, precommit);
      (0, _index.log)('pre-commit hook added');
    }

    var packagePath = _path2.default.join(process.cwd(), 'package.json');
    var packageJson = require(packagePath);

    if (packageJson.scripts.lint !== 'react-cli lint') {
      packageJson.scripts.lint = forReactCLI ? 'eslint ./src' : 'react-cli lint';

      _fs2.default.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      (0, _index.log)('lint script added in your package.json');
    }
  }
};