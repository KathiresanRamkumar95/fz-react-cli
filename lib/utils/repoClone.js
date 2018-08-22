'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _index.getOptions)();

var _options$clone = options.clone,
    type = _options$clone.type,
    url = _options$clone.url,
    branch = _options$clone.branch,
    revision = _options$clone.revision,
    projectName = _options$clone.projectName,
    cacheDir = _options$clone.cacheDir,
    remoteName = _options$clone.remoteName,
    shouldDelete = _options$clone.shouldDelete;


if (type && (type === 'git' || type === 'hg')) {
  (0, _index.log)('Going to clone ' + type + ' repository');
} else {
  throw new Error('You must give valid type to clone a repository');
}

var projectPath = _path2.default.join(cacheDir, projectName);

var cloneRepo = function cloneRepo() {
  if (!_fs2.default.existsSync(cacheDir)) {
    _fs2.default.mkdirSync(cacheDir);
  }
  var revisionOrBranch = void 0;

  if (type === 'git') {
    revisionOrBranch = '-b' + branch;
  } else {
    if (revision) {
      revisionOrBranch = '-r' + revision;
    } else {
      revisionOrBranch = '-b' + branch;
    }
  }

  (0, _child_process.spawnSync)(type, ['clone', url, revisionOrBranch, projectName], {
    cwd: cacheDir,
    stdio: 'inherit'
  });

  if (type === 'hg') {
    _fs2.default.writeFileSync(_path2.default.join(projectPath, '.hg', 'remoteUrl'), url);
  }

  (0, _index.log)('Repository cloned!');
};

var getRemoteURL = function getRemoteURL() {
  if (type === 'git') {
    var results = (0, _child_process.spawnSync)('git', ['config --get remote.' + remoteName + '.url'], {
      cwd: projectPath,
      stdio: 'inherit'
    });

    var _results$output$filte = results.output.filter(function (d) {
      return d;
    }),
        _results$output$filte2 = _slicedToArray(_results$output$filte, 1),
        _remoteUrl = _results$output$filte2[0];

    return _remoteUrl.replace(/(\r\n|\n|\r)/gm, '').trim();
  }
  var remoteUrl = _fs2.default.readFileSync(_path2.default.join(projectPath, '.hg', 'remoteUrl')).toString();
  return remoteUrl.trim();
};

if (_fs2.default.existsSync(projectPath)) {
  var remoteUrl = getRemoteURL();

  if (remoteUrl === url) {
    if (type === 'git') {
      (0, _child_process.spawnSync)(type, ['pull', remoteName, branch], {
        cwd: projectPath,
        stdio: 'inherit'
      });
    } else {
      (0, _child_process.spawnSync)(type, ['pull', (revision ? '-r' : '-b') + remoteName, branch], {
        cwd: projectPath,
        stdio: 'inherit'
      });
    }
  } else {
    shouldDelete && (0, _child_process.spawnSync)('rm', ['-rf', projectName], {
      cwd: cacheDir,
      stdio: 'inherit'
    });

    (0, _index.log)('Existing repository deleted!');
    cloneRepo();
  }
} else {
  cloneRepo();
}