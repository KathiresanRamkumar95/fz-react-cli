'use strict';

var _child_process = require('child_process');

var _fzScreenshotTest = require('fz-screenshot-test');

var _fzScreenshotTest2 = _interopRequireDefault(_fzScreenshotTest);

var _utils = require('../utils');

var _docsServerCore = require('./docsServerCore');

var _docsServerCore2 = _interopRequireDefault(_docsServerCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = (0, _utils.getOptions)();
var _options$ssTest = options.ssTest,
    seleniumHub = _options$ssTest.seleniumHub,
    remoteBranch = _options$ssTest.remoteBranch,
    referBranch = _options$ssTest.referBranch,
    server = options.docs.server;


var docsServerInstance = (0, _docsServerCore2.default)();

(0, _utils.log)((0, _utils.getCurrentBranch)(), 'Current Branch');

if (remoteBranch) {
  docsServerInstance.http.post('/repo/merge', function (req, res) {
    var ref = req.body.ref;

    if (ref && ref.endsWith(remoteBranch)) {
      (0, _child_process.spawnSync)('git', ['pull', 'origin', remoteBranch], {
        stdio: 'inherit'
      });
    }
    res.send('done');
  });
}

var afterFirstScreenShotCollected = function afterFirstScreenShotCollected() {
  (0, _child_process.spawnSync)('git', ['checkout', referBranch], { encoding: 'utf8' });
  (0, _utils.log)((0, _utils.getCurrentBranch)());
  (0, _utils.log)('Reference Branch test mode test called..!');
  docsServerInstance = (0, _docsServerCore2.default)();
};

var runSSTest = function runSSTest(onBefore, isLastRun) {
  typeof onBefore === 'function' && onBefore();
  _fzScreenshotTest2.default.run({
    seleniumHub: seleniumHub,
    url: (0, _utils.getServerURL)(server, 'ht' + 'tps') + '/docs/component.html',
    browserList: ['chrome'],
    mode: 'test',
    script: 'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
  }, function (status) {
    if (status !== false) {
      (0, _utils.log)('Current Mode call back server kill function called..!');
      var _docsServerInstance = docsServerInstance,
          http = _docsServerInstance.http,
          https = _docsServerInstance.https,
          wdm = _docsServerInstance.wdm;

      http.close();
      https.close();
      wdm.close();
      if (!isLastRun) {
        runSSTest(afterFirstScreenShotCollected, true);
      } else {
        (0, _utils.log)('Screenshot test succesfully completed.');
      }
    } else {
      var _docsServerInstance2 = docsServerInstance,
          _http = _docsServerInstance2.http,
          _https = _docsServerInstance2.https,
          _wdm = _docsServerInstance2.wdm;

      _http.close();
      _https.close();
      _wdm.close();
      (0, _utils.log)('Component list undefined.');
    }
  });
};

runSSTest();