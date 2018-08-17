import { Readable } from 'stream';
import fs from 'fs';

export { default as getOptions } from './getOptions';
export { default as createEventStream } from './createEventStream';
export { default as getServerURL } from './getServerURL';
export { default as getCurrentBranch } from './getCurrentBranch';
export * from './initPreCommitHook';

export let log = (...info) => {
  let print = console;
  print.log(...info);
};

export let writeFile = (outputPath, src, isPath = false) =>
  new Promise((resolve, reject) => {
    let inStr;
    if (isPath) {
      inStr = fs.createReadStream(src);
    } else {
      inStr = new Readable();
      inStr._read = () => true;
      inStr.push(src);
      inStr.push(null);
    }
    let outStr = fs.createWriteStream(outputPath);
    outStr.on('error', () => {
      reject();
    });
    outStr.on('finish', () => {
      resolve();
    });

    inStr.pipe(outStr);
  });

export let makeDir = paths => {
  if (typeof paths === 'string') {
    //eslint-disable-next-line
    paths = [paths];
  }
  paths.forEach(path => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });
};
