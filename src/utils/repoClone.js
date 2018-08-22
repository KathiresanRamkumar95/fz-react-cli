import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';

import { getOptions, log } from './index';

let options = getOptions();

let {
  clone: {
    type,
    url,
    branch,
    revision,
    projectName,
    cacheDir,
    remoteName,
    shouldDelete
  }
} = options;

if (type && (type === 'git' || type === 'hg')) {
  log(`Going to clone ${type} repository`);
} else {
  throw new Error('You must give valid type to clone a repository');
}

let projectPath = path.join(cacheDir, projectName);

let cloneRepo = () => {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }
  let revisionOrBranch;

  if (type === 'git') {
    revisionOrBranch = `-b${branch}`;
  } else {
    if (revision) {
      revisionOrBranch = `-r${revision}`;
    } else {
      revisionOrBranch = `-b${branch}`;
    }
  }

  spawnSync(type, ['clone', url, revisionOrBranch, projectName], {
    cwd: cacheDir,
    stdio: 'inherit'
  });

  if (type === 'hg') {
    fs.writeFileSync(path.join(projectPath, '.hg', 'remoteUrl'), url);
  }

  log('Repository cloned!');
};

let getRemoteURL = () => {
  if (type === 'git') {
    let results = spawnSync('git', [`config --get remote.${remoteName}.url`], {
      cwd: projectPath,
      stdio: 'inherit'
    });

    let [remoteUrl] = results.output.filter(d => d);
    return remoteUrl.replace(/(\r\n|\n|\r)/gm, '').trim();
  }
  let remoteUrl = fs
    .readFileSync(path.join(projectPath, '.hg', 'remoteUrl'))
    .toString();
  return remoteUrl.trim();
};

if (fs.existsSync(projectPath)) {
  let remoteUrl = getRemoteURL();

  if (remoteUrl === url) {
    if (type === 'git') {
      spawnSync(type, ['pull', remoteName, branch], {
        cwd: projectPath,
        stdio: 'inherit'
      });
    } else {
      spawnSync(type, ['pull', (revision ? '-r' : '-b') + remoteName, branch], {
        cwd: projectPath,
        stdio: 'inherit'
      });
    }
  } else {
    shouldDelete &&
      spawnSync('rm', ['-rf', projectName], {
        cwd: cacheDir,
        stdio: 'inherit'
      });

    log('Existing repository deleted!');
    cloneRepo();
  }
} else {
  cloneRepo();
}
