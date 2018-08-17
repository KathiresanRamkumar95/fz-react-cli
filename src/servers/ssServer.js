import { spawnSync } from 'child_process';
import ssTest from 'fz-screenshot-test';

import { getOptions, log, getCurrentBranch, getServerURL } from '../utils';
import docsServer from './docsServerCore';

let options = getOptions();
let {
  ssTest: { seleniumHub, remoteBranch, referBranch },
  docs: { server }
} = options;

let docsServerInstance = docsServer();

log(getCurrentBranch(), 'Current Branch');

if (remoteBranch) {
  docsServerInstance.http.post('/repo/merge', (req, res) => {
    let { ref } = req.body;
    if (ref && ref.endsWith(remoteBranch)) {
      spawnSync('git', ['pull', 'origin', remoteBranch], {
        stdio: 'inherit'
      });
    }
    res.send('done');
  });
}

let afterFirstScreenShotCollected = () => {
  spawnSync('git', ['checkout', referBranch], { encoding: 'utf8' });
  log(getCurrentBranch());
  log('Reference Branch test mode test called..!');
  docsServerInstance = docsServer();
};

let runSSTest = (onBefore, isLastRun) => {
  typeof onBefore === 'function' && onBefore();
  ssTest.run(
    {
      seleniumHub: seleniumHub,
      url: `${getServerURL(server, 'ht' + 'tps')}/docs/component.html`,
      browserList: ['chrome'],
      mode: 'test',
      script:
        'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
    },
    status => {
      if (status !== false) {
        log('Current Mode call back server kill function called..!');
        let { http, https, wdm } = docsServerInstance;
        http.close();
        https.close();
        wdm.close();
        if (!isLastRun) {
          runSSTest(afterFirstScreenShotCollected, true);
        } else {
          log('Screenshot test succesfully completed.');
        }
      } else {
        let { http, https, wdm } = docsServerInstance;
        http.close();
        https.close();
        wdm.close();
        log('Component list undefined.');
      }
    }
  );
};

runSSTest();
