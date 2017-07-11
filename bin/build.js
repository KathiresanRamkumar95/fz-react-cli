#!/usr/bin/env node
var spawn = require('cross-spawn');
var script = process.argv[2];
var args = process.argv.slice(3);
var fs = require('fs');
var path = require('path');
var appPath = fs.realpathSync(process.cwd());
var isNodeModuleUnderAppFolder = __dirname.indexOf(appPath) != -1;
var webpack = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'webpack')
  : 'webpack';
var crossEnv = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'cross-env')
  : 'cross-env';
var babel = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'babel')
  : 'babel';
switch (script) {
  case 'start':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/server/server')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'clean':
    args = args.map(arg => path.join(appPath, arg));
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/clean')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'docs':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/server/docsServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'sstest':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/server/ssServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'build:component':
    console.log(crossEnv);
    var result = spawn.sync(
      crossEnv,
      [
        'BABEL_ENV=commonjs',
        babel,
        'src',
        '--out-dir',
        'lib',
        '--presets=babel-preset-es2015/lib/index.js,babel-preset-react/lib/index.js',
        '--copy-files'
      ].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);

    break;
  case 'build:component:umd':
    var result = spawn.sync(
      webpack,
      [
        '--config',
        require.resolve('../lib/config/webpack.component.build.config.js')
      ].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'build':
    var result = spawn.sync(
      webpack,
      [
        '--config',
        require.resolve('../lib/config/webpack.prod.config.js')
      ].concat(args),
      { stdio: 'inherit' }
    );

    process.exit(result.status);
    break;
  case 'test':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/test')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'publish:report':
    var result = spawn.sync(
      'sh',
      [path.join(__dirname, '..', 'reportpublish.sh')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  default:
    console.log('Unknown script "' + script + '".');
    break;
}
