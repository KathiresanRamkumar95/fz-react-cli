'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _child_process = require('child_process');

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var server = options.nodeServer;
var host = server.host,
    port = server.port,
    repoUrl = server.repoUrl,
    branch = server.branch,
    clientAppPath = server.clientAppPath;


var appPath = process.cwd();
var serverUrl = (0, _utils.getServerURL)('ht' + 'tp', server);

var app = (0, _express2.default)();

var commitHash = '';
var serverProcess = void 0;

var stream = (0, _utils.createEventStream)(5000, function () {
  return { branch: branch, commitHash: commitHash, isStart: serverProcess ? true : false };
});

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

app.use(_express2.default.json());

app.get('/node/getInfo', function (req, res) {
  res.send(JSON.stringify({ repoUrl: repoUrl, host: host, port: port, branch: branch }));
});

app.get('/node/heartbeat', stream.handler);

app.get('/node/clone', function (req, res) {
  var output = (0, _child_process.spawnSync)('rm', ['-R', branch], {
    encoding: 'utf8'
  });

  output = (0, _child_process.spawnSync)('git', ['clone', repoUrl, '-b', branch, branch], {
    encoding: 'utf8'
  });
  output = (0, _child_process.spawnSync)('npm', ['install'], {
    encoding: 'utf8',
    shell: true,
    cwd: _path2.default.join(appPath, branch, clientAppPath)
  });

  var test = (0, _child_process.spawnSync)('npm', ['run', 'build:component:server'], {
    encoding: 'utf8',
    shell: true,
    cwd: _path2.default.join(appPath, branch, clientAppPath)
  });

  (0, _utils.log)(test.stdout);
  res.send(output.stdout);
});

app.get('/node/isStart', function (req, res) {
  if (serverProcess) {
    res.send('true');
  } else {
    res.send('false');
  }
});

app.get('/node/start', function (req, res) {
  if (!serverProcess) {
    (0, _utils.log)(_path2.default.join(appPath, branch, clientAppPath));
    var test = (0, _child_process.spawnSync)('npm', ['run', 'build:component:server'], {
      encoding: 'utf8',
      shell: true,
      cwd: _path2.default.join(appPath, branch, clientAppPath)
    });
    (0, _utils.log)(test.stdout);
    serverProcess = (0, _child_process.spawnSync)('npm', ['run', 'serverrender', '--server:port=' + port], {
      encoding: 'utf8',
      shell: true,
      cwd: _path2.default.join(appPath, branch, clientAppPath)
    });
    serverProcess.on('error', function (err) {
      (0, _utils.log)('Oh noez, teh errurz: ' + err);
      res.send('Server Error');
      serverProcess = null;
    });
    var flag = true;
    serverProcess.stdout.on('data', function (data) {
      (0, _utils.log)('stdout: ' + data.toString());
      if (flag) {
        res.send('Server start');
        flag = false;
      }
    });
  } else {
    res.send('Already started');
  }
});
app.get('/node/stop', function (req, res) {
  if (serverProcess) {
    serverProcess.stdin.pause();
    if (serverProcess.kill('SIGTERM')) {
      res.send('Stopped');
      serverProcess = null;
    } else {
      res.send('Not able to stop');
    }
  } else {
    res.send('Already Stopped');
  }
});
app.post('/node/deploy', function (req, res) {
  if (serverProcess) {
    serverProcess.stdin.pause();
    if (serverProcess.kill('SIGTERM')) {
      serverProcess = null;
      var test = (0, _child_process.spawnSync)('git', ['pull'], {
        encoding: 'utf8',
        shell: true,
        cwd: _path2.default.join(appPath, branch, clientAppPath)
      });
      (0, _utils.log)('pull:', test.stdout);
      var deployObj = req.body;
      test = (0, _child_process.spawnSync)('git', ['reset', '--hard', deployObj.repoInfo.hash], {
        encoding: 'utf8',
        shell: true,
        cwd: _path2.default.join(appPath, branch, clientAppPath)
      });
      (0, _utils.log)('reset commit hash', test.stdout);
      commitHash = deployObj.repoInfo.hash;
      // test = spawnSync('npm', ['install'], {
      //   encoding: 'utf8',
      //   shell: true,
      //   cwd: path.join(appPath, branch, clientAppPath)
      // });
      // console.log('install', test.stdout);
      test = (0, _child_process.spawnSync)('npm', ['run', 'build:component:server'], {
        encoding: 'utf8',
        shell: true,
        cwd: _path2.default.join(appPath, branch, clientAppPath)
      });
      (0, _utils.log)('server build', test.stdout);
      serverProcess = (0, _child_process.spawnSync)('npm', ['run', 'serverrender', '--server:port=' + port, '--', JSON.stringify(JSON.stringify(deployObj))], {
        encoding: 'utf8',
        shell: true,
        cwd: _path2.default.join(appPath, branch, clientAppPath)
      });
      serverProcess.on('error', function (err) {
        (0, _utils.log)('Oh noez, teh errurz: ' + err);
        res.send('Server Error');
        serverProcess = null;
      });
      var flag = true;
      serverProcess.stdout.on('data', function (data) {
        (0, _utils.log)('stdout: ' + data.toString());
        if (flag) {
          res.send('Server start');
          flag = false;
        }
      });
    } else {
      res.send('Not able to stop');
    }
  } else {
    var _test = (0, _child_process.spawnSync)('git', ['pull'], {
      encoding: 'utf8',
      shell: true,
      cwd: _path2.default.join(appPath, branch, clientAppPath)
    });
    (0, _utils.log)('pull:', _test.stdout);
    var _deployObj = req.body;
    _test = (0, _child_process.spawnSync)('git', ['reset', '--hard', _deployObj.repoInfo.hash], {
      encoding: 'utf8',
      shell: true,
      cwd: _path2.default.join(appPath, branch, clientAppPath)
    });
    (0, _utils.log)('reset commit hash', _test.stdout);
    commitHash = _deployObj.repoInfo.hash;
    // test = spawnSync('npm', ['install'], {
    //   encoding: 'utf8',
    //   shell: true,
    //   cwd: path.join(appPath, branch, clientAppPath)
    // });
    // console.log('install', test.stdout);
    _test = (0, _child_process.spawnSync)('npm', ['run', 'build:component:server'], {
      encoding: 'utf8',
      shell: true,
      cwd: _path2.default.join(appPath, branch, clientAppPath)
    });
    (0, _utils.log)('server build', _test.stdout);
    serverProcess = (0, _child_process.spawnSync)('npm', ['run', 'serverrender', '--server:port=' + port, '--', JSON.stringify(JSON.stringify(_deployObj))], {
      encoding: 'utf8',
      shell: true,
      cwd: _path2.default.join(appPath, branch, clientAppPath)
    });
    serverProcess.on('error', function (err) {
      (0, _utils.log)('Oh noez, teh errurz: ' + err);
      res.send('Server Error');
      serverProcess = null;
    });
    var _flag = true;
    serverProcess.stdout.on('data', function (data) {
      (0, _utils.log)('stdout: ' + data.toString());
      if (_flag) {
        res.send('Server start');
        _flag = false;
      }
    });
  }
});

app.listen(port + 1, function (err) {
  if (err) {
    throw err;
  }
  (0, _utils.log)('Listening at ' + serverUrl + '/node/');
});