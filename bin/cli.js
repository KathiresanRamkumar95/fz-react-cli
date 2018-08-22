#!/usr/bin/env node

let path = require('path');
let os = require('os');
let { spawnSync } = require('child_process');
let { getOptions } = require('../lib/utils/index.js');

let { log, initPreCommitHook } = require('../lib/utils');
initPreCommitHook();

let presets = {
  env: require.resolve('babel-preset-env'),
  react: require.resolve('babel-preset-react')
};

let options = getOptions();

let { esLint: esLintOptions } = options;
let { ignoreFilePaths: esLintIgnorePaths } = esLintOptions;

let isWindows = os.platform().toLowerCase() === 'win32';

let [, , option] = process.argv;
let args = process.argv.slice(3);
let appPath = process.cwd();

let isNodeModuleUnderAppFolder = __dirname.indexOf(appPath) !== -1;

let webpack = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'webpack')
  : 'webpack';

let babel = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'babel')
  : 'babel';

let propertyToJson = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'propertyToJson')
  : 'propertyToJson';

let esLint = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'eslint')
  : 'eslint';

if (isWindows) {
  webpack += '.cmd';
  babel += '.cmd';
  propertyToJson += '.cmd';
  esLint += '.cmd';
}

let result;
switch (option) {
  case 'copy':
    result = spawnSync(
      'node',
      [require.resolve('../lib/utils/copy')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'move':
    result = spawnSync(
      'node',
      [require.resolve('../lib/utils/copy')].concat(args.concat(false)),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;

  case 'clone':
    result = spawnSync(
      'node',
      [require.resolve('../lib/utils/repoClone')].concat(args.concat(args)),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;

  case 'app':
    result = spawnSync(
      'cp',
      ['-r', path.join(__dirname, '..', 'templates', 'app')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'library':
    result = spawnSync(
      'cp',
      ['-r', path.join(__dirname, '..', 'templates', 'library')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'propertyToJson':
    result = spawnSync(
      propertyToJson,
      args.map(arg => path.join(appPath, arg)),
      {
        stdio: 'inherit'
      }
    );
    process.exit(result.status);
    break;
  case 'help':
    result = spawnSync(
      'node',
      [require.resolve('../lib/servers/helpServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'start':
    result = spawnSync(
      'node',
      [require.resolve('../lib/servers/server'), '--expose-http2'].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'clean':
    args = args.map(arg => path.join(appPath, arg));
    result = spawnSync(
      'node',
      [require.resolve('../lib/utils/clean')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'docs':
    result = spawnSync(
      'node',
      [require.resolve('../lib/servers/docsServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'sstest':
    result = spawnSync(
      'node',
      [require.resolve('../lib/servers/ssServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'build:library:umd':
  case 'build:component:umd':
    result = spawnSync(
      webpack,
      [
        '--config',
        require.resolve('../lib/configs/webpack.component.umd.config.js')
      ],
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'build:css:umd':
    result = spawnSync(
      webpack,
      ['--config', require.resolve('../lib/configs/webpack.css.umd.config.js')],
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'build:component:server':
    result = spawnSync(
      webpack,
      ['--config', require.resolve('../lib/configs/webpack.server.config.js')],
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'cluster:monitor':
    result = spawnSync(
      'node',
      [require.resolve('../lib/servers/clusterHubServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'node':
    result = spawnSync(
      'node',
      [require.resolve('../lib/servers/nodeServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);

    break;
  case 'build:library:cmjs':
    result = spawnSync(
      babel,
      [
        'src',
        '-d',
        'lib',
        `--presets=${presets.env},${presets.react}`,
        '--copy-files'
      ].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);

    break;
  case 'build:library:es':
    result = spawnSync(
      babel,
      [
        'src',
        '--out-dir',
        'es',
        `--presets=${require.resolve('../lib/utils/babelPresets')},${
          presets.react
        }`,
        '--copy-files'
      ].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);

    break;
  case 'build':
    result = spawnSync(
      webpack,
      [
        '--config',
        require.resolve('../lib/configs/webpack.prod.config.js')
      ].concat(args),
      { stdio: 'inherit' }
    );

    process.exit(result.status);
    break;
  case 'test':
    result = spawnSync(
      'node',
      [require.resolve('../lib/jest/run.js')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'publish:report':
    result = spawnSync(
      'sh',
      [path.join(__dirname, '..', 'lib', 'sh', 'reportPublish.sh')].concat(
        args
      ),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'lint':
    result = spawnSync(
      esLint,
      [
        '-c',
        path.join(__dirname, '..', '.eslintrc.js'),
        '--ignore-path',
        esLintIgnorePaths
          ? path.join(appPath, esLintIgnorePaths)
          : path.join(__dirname, '..', '.eslintignore')
      ].concat(args.map(arg => path.join(appPath, arg))),
      {
        stdio: 'inherit'
      }
    );
    break;

  case 'set:config':
    result = spawnSync(
      'node',
      [require.resolve('../lib/utils/setEnvVariables')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case '--version':
  case '-version':
  case '--v':
  case '-v':
    log(`@zohodesk/react-cli v${require('../package.json').version}`);
    break;
  default:
    log(`fz-react-cli > Unknown option "${option}".`);
    log('fz-react-cli app <appName>');
    log('fz-react-cli library <libraryName>');
    log('fz-react-cli start');
    log('fz-react-cli build');
    log('fz-react-cli sstest');
    log('fz-react-cli test');
    log('fz-react-cli publish:report');
    log('fz-react-cli build:library:es');
    log('fz-react-cli gitclone <last argument clone folder>');
    log('fz-react-cli hgclone <last argument clone folder>');
    process.exit(0);

    break;
}
