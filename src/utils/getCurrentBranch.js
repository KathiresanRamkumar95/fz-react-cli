import { spawnSync } from 'child_process';

export default (type = 'git', cwd = __dirname) => {
  let results;
  if (type === 'git') {
    results = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      cwd
    });
  } else if (type === 'hg') {
    results = spawnSync('hg', ['identify', '-b'], {
      encoding: 'utf8',
      cwd
    });
  }

  let [currentBranch] = results.output.filter(d => d);
  return currentBranch.replace(/(\r\n|\n|\r)/gm, '');
};
