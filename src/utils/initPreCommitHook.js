import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { log } from './index';

export let getGitRootDir = () => {
  try {
    return execSync('git rev-parse --show-toplevel').toString();
  } catch (e) {
    return false;
  }
};

export let initPreCommitHook = (forReactCLI = false) => {
  let gitRootDir = getGitRootDir();
  if (gitRootDir) {
    let precommit = fs
      .readFileSync(path.join(__dirname, '../sh/pre-commit.sh'))
      .toString();

    let targetPath = path
      .join(gitRootDir, '.git', 'hooks', 'pre-commit')
      .replace(/\s/g, '');

    if (fs.existsSync(`${targetPath}.sample`)) {
      fs.renameSync(`${targetPath}.sample`, targetPath);
      fs.writeFileSync(targetPath, precommit);
      log('pre-commit hook added');
    }

    let packagePath = path.join(process.cwd(), 'package.json');
    let packageJson = require(packagePath);

    if (packageJson.scripts.lint !== 'react-cli lint') {
      packageJson.scripts.lint = forReactCLI
        ? 'eslint ./src'
        : 'react-cli lint';

      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      log('lint script added in your package.json');
    }
  }
};
