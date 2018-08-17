import { execSync } from 'child_process';

let args = process.argv.slice(2);

args.forEach(arg => {
  if (arg.startsWith('-')) {
    //eslint-disable-next-line
    arg = arg.substring(2);
  }

  execSync(`npm config set ${arg}`);
});
