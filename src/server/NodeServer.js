var path = require('path');
var express = require('express');
var cp = require('child_process');
var fs = require('fs');
var bodyParser = require('body-parser');
var createEventStream = require('../utils/eventStream');
var args = process.argv.slice(3);
var app = express();

var host = process.argv[2] || 'localhost';
var port = process.argv[3] || '4040';
port = parseInt(port);

var repoUrl =
  process.env.npm_config_repo_url ||
  'https://vimalesan.a@git.csez.zohocorpin.com/zohodesk/supportportal.git';
var repoBranch = process.argv[4] || 'theme1';
var commitHash = '';
var clientAppPath = process.env.npm_config_app_path || 'jsapps/portalapp';
var url = 'htt' + 'p://' + host + ':' + (port + 1);
var appPath = fs.realpathSync(process.cwd());
var info = {
  repoUrl,
  repoBranch,
  host,
  port
};
var streamObj = createEventStream(5000, () => {
  return { repoBranch, commitHash, isStart: serverProcess ? true : false };
});
var serverProcess;
app = app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  );
  next();
});
app.use(bodyParser.json()); // to support JSON-encoded bodies

app.get('/node/getInfo', (req, res) => {
  res.send(JSON.stringify(info));
});
app.get('/node/heartbeat', streamObj.handler);
app.get('/node/clone', (req, res) => {
  var output = cp.spawnSync('rm', ['-R', repoBranch], {
    encoding: 'utf8'
  });

  output = cp.spawnSync(
    'git',
    ['clone', repoUrl, '-b', repoBranch, repoBranch],
    {
      encoding: 'utf8'
    }
  );
  output = cp.spawnSync('npm', ['install'], {
    encoding: 'utf8',
    shell: true,
    cwd: path.join(appPath, repoBranch, clientAppPath)
  });
  var test = cp.spawnSync('npm', ['run', 'build:component:server'], {
    encoding: 'utf8',
    shell: true,
    cwd: path.join(appPath, repoBranch, clientAppPath)
  });
  console.log(test.stdout);
  res.send(output.stdout);
});
app.get('/node/isStart', (req, res) => {
  if (serverProcess) {
    res.send('true');
  } else {
    res.send('false');
  }
});
app.get('/node/start', (req, res) => {
  if (!serverProcess) {
    console.log(path.join(appPath, repoBranch, clientAppPath));
    var test = cp.spawnSync('npm', ['run', 'build:component:server'], {
      encoding: 'utf8',
      shell: true,
      cwd: path.join(appPath, repoBranch, clientAppPath)
    });
    console.log(test.stdout);
    serverProcess = cp.spawn(
      'npm',
      ['run', 'serverrender', '--server:port=' + port],
      {
        encoding: 'utf8',
        shell: true,
        cwd: path.join(appPath, repoBranch, clientAppPath)
      }
    );
    serverProcess.on('error', function(err) {
      console.log('Oh noez, teh errurz: ' + err);
      res.send('Server Error');
      serverProcess = null;
    });
    var flag = true;
    serverProcess.stdout.on('data', function(data) {
      console.log('stdout: ' + data.toString());
      if (flag) {
        res.send('Server start');
        flag = false;
      }
    });
  } else {
    res.send('Already started');
  }
});
app.get('/node/stop', (req, res) => {
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
app.post('/node/deploy', (req, res) => {
  if (serverProcess) {
    serverProcess.stdin.pause();
    if (serverProcess.kill('SIGTERM')) {
      serverProcess = null;
      var test = cp.spawnSync('git', ['pull'], {
        encoding: 'utf8',
        shell: true,
        cwd: path.join(appPath, repoBranch, clientAppPath)
      });
      console.log('pull:', test.stdout);
      var deployObj = req.body;
      test = cp.spawnSync('git', ['reset', '--hard', deployObj.repoInfo.hash], {
        encoding: 'utf8',
        shell: true,
        cwd: path.join(appPath, repoBranch, clientAppPath)
      });
      console.log('reset commit hash', test.stdout);
      commitHash = deployObj.repoInfo.hash;
      // test = cp.spawnSync('npm', ['install'], {
      //   encoding: 'utf8',
      //   shell: true,
      //   cwd: path.join(appPath, repoBranch, clientAppPath)
      // });
      // console.log('install', test.stdout);
      test = cp.spawnSync('npm', ['run', 'build:component:server'], {
        encoding: 'utf8',
        shell: true,
        cwd: path.join(appPath, repoBranch, clientAppPath)
      });
      console.log('server build', test.stdout);
      serverProcess = cp.spawn(
        'npm',
        [
          'run',
          'serverrender',
          '--server:port=' + port,
          '--',
          JSON.stringify(deployObj.initialJS)
        ],
        {
          encoding: 'utf8',
          shell: true,
          cwd: path.join(appPath, repoBranch, clientAppPath)
        }
      );
      serverProcess.on('error', function(err) {
        console.log('Oh noez, teh errurz: ' + err);
        res.send('Server Error');
        serverProcess = null;
      });
      var flag = true;
      serverProcess.stdout.on('data', function(data) {
        console.log('stdout: ' + data.toString());
        if (flag) {
          res.send('Server start');
          flag = false;
        }
      });
    } else {
      res.send('Not able to stop');
    }
  } else {
    var test = cp.spawnSync('git', ['pull'], {
      encoding: 'utf8',
      shell: true,
      cwd: path.join(appPath, repoBranch, clientAppPath)
    });
    console.log('pull:', test.stdout);
    var deployObj = req.body;
    test = cp.spawnSync('git', ['reset', '--hard', deployObj.repoInfo.hash], {
      encoding: 'utf8',
      shell: true,
      cwd: path.join(appPath, repoBranch, clientAppPath)
    });
    console.log('reset commit hash', test.stdout);
    commitHash = deployObj.repoInfo.hash;
    // test = cp.spawnSync('npm', ['install'], {
    //   encoding: 'utf8',
    //   shell: true,
    //   cwd: path.join(appPath, repoBranch, clientAppPath)
    // });
    // console.log('install', test.stdout);
    test = cp.spawnSync('npm', ['run', 'build:component:server'], {
      encoding: 'utf8',
      shell: true,
      cwd: path.join(appPath, repoBranch, clientAppPath)
    });
    console.log('server build', test.stdout);
    serverProcess = cp.spawn(
      'npm',
      [
        'run',
        'serverrender',
        '--server:port=' + port,
        '--',
        JSON.stringify(JSON.stringify(deployObj))
      ],
      {
        encoding: 'utf8',
        shell: true,
        cwd: path.join(appPath, repoBranch, clientAppPath)
      }
    );
    serverProcess.on('error', function(err) {
      console.log('Oh noez, teh errurz: ' + err);
      res.send('Server Error');
      serverProcess = null;
    });
    var flag = true;
    serverProcess.stdout.on('data', function(data) {
      console.log('stdout: ' + data.toString());
      if (flag) {
        res.send('Server start');
        flag = false;
      }
    });
  }
});
var server = app.listen(port + 1, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + url + '/node/');
});
