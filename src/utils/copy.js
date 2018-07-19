import path from 'path';
import fs from 'fs';

import { log } from './index';

let args = process.argv.slice(2);
let appPath = fs.realpathSync(process.cwd());

let [srcPath, targetPath, exts, isCopy = true, flatten = ''] = args;

exts = exts ? exts.split(',').map(ext => `.${ext.trim()}`) : false;
srcPath = path.join(appPath, srcPath);
targetPath = targetPath === '."' || !targetPath ? '' : targetPath;
targetPath = path.join(appPath, targetPath);

let removeDirectory = dirPath => {
  fs.readdirSync(dirPath).forEach(fileOrDir => {
    let fileOrDirPath = path.join(dirPath, fileOrDir);
    if (fs.statSync(fileOrDirPath).isDirectory()) {
      removeDirectory(fileOrDirPath);
    } else {
      fs.unlinkSync(fileOrDirPath);
    }
  });
  fs.rmdirSync(dirPath);
};

let copyFile = (srcPath, targetPath, isCopy = true) => {
  let readStream = fs.createReadStream(srcPath);
  let writeStream = fs.createWriteStream(targetPath);
  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    if (!isCopy) {
      fs.unlinkSync(srcPath);
    }
  });
};

let iterateDirectory = (srcPath, targetPath, isCopy, extensions, flatten) => {
  fs.readdirSync(srcPath).forEach(fileOrDir => {
    let fromPath = path.join(srcPath, fileOrDir);
    let toPath = targetPath;

    if (flatten !== 'flatten' || !fs.statSync(fromPath).isDirectory()) {
      toPath = path.join(targetPath, fileOrDir);
    }

    if (fs.statSync(fromPath).isDirectory()) {
      if (!fs.existsSync(toPath)) {
        fs.mkdirSync(toPath);
      }
      iterateDirectory(fromPath, toPath, isCopy, extensions, flatten);
    } else {
      if (extensions) {
        let { ext } = path.parse(fromPath);
        if (extensions.indexOf(ext) !== -1) {
          copyFile(fromPath, toPath);
        }
      } else {
        copyFile(fromPath, toPath);
      }
    }
  });
};

let copy = (srcPath, targetPath, isCopy, exts, flatten) => {
  if (fs.statSync(srcPath).isDirectory()) {
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }
    let { name } = path.parse(srcPath);
    let originPath = targetPath;
    if (flatten !== 'flatten') {
      originPath = path.join(targetPath, name);
      if (!fs.existsSync(originPath)) {
        fs.mkdirSync(originPath);
      }
    }
    iterateDirectory(srcPath, originPath, isCopy, exts, flatten);
  } else {
    /* direct file copy issue there but that feature not needed i think*/
    copyFile(srcPath, targetPath, isCopy);
  }
  if (!isCopy) {
    removeDirectory(srcPath);
  }
  log(isCopy ? 'Folder/file are copied!' : 'Folder/file are moved!');
};

copy(srcPath, targetPath, isCopy, exts, flatten);
