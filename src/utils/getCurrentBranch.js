import { spawnSync } from 'child_process';

export default () => {
  let results = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8'
  });
  let [currentBranch] = results.output.filter(d => d);
  return currentBranch.replace(/(\r\n|\n|\r)/gm, '');
};
