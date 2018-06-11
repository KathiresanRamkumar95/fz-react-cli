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
var propertyToJson = !isNodeModuleUnderAppFolder
  ? path.join(__dirname, '..', 'node_modules', '.bin', 'propertyToJson')
  : 'propertyToJson';
var presetEs2015 = require.resolve('babel-preset-es2015');
var presetReact = require.resolve('babel-preset-react');
var hash = process.env.npm_config_hash_enable || false;
switch (script) {
  case 'copy':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/utils/copy')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'move':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/utils/copy')].concat(args.concat(false)),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'gitclone':
    args[args.length - 1] = path.join(appPath, args[args.length - 1]);
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/clean'), args[args.length - 1]],
      { stdio: 'inherit' }
    );
    var result = spawn.sync('git', ['clone'].concat(args), {
      stdio: 'inherit'
    });
    process.exit(result.status);
    break;
  case 'hgclone':
    args[args.length - 1] = path.join(appPath, args[args.length - 1]);
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/clean'), args[args.length - 1]],
      { stdio: 'inherit' }
    );
    var result = spawn.sync('hg', ['clone'].concat(args), {
      stdio: 'inherit'
    });
    process.exit(result.status);
    break;
  case 'app':
    var result = spawn.sync(
      'cp',
      ['-r', path.join(__dirname, '..', 'blueprint')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'library':
    var result = spawn.sync(
      'cp',
      ['-r', path.join(__dirname, '..', 'library')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'propertyToJson':
    var result = spawn.sync(
      propertyToJson,
      args.map(arg => {
        return path.join(appPath, arg);
      }),
      {
        stdio: 'inherit'
      }
    );
    process.exit(result.status);
    break;
  case 'help':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/server/helpServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'html':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/server/htmlServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
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
    var result = spawn.sync(
      crossEnv,
      [
        'BABEL_ENV=commonjs',
        babel,
        'src',
        '--out-dir',
        'lib',
        '--presets=' + presetEs2015 + ',' + presetReact,
        '--copy-files'
      ].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);

    break;
  case 'build:component:server':
    // var result = spawn.sync(
    //   crossEnv,
    //   [
    //     'BABEL_ENV=server',
    //     babel,
    //     'app',
    //     '--out-dir',
    //     'lib',
    //     '--presets=' + presetEs2015 + ',' + presetReact,
    //     '--copy-files'
    //   ].concat(args),
    //   { stdio: 'inherit' }
    // );
    // process.exit(result.status);
    var result = spawn.sync(
      webpack,
      ['--config', require.resolve('../lib/config/webpack.server.config.js')],
      { stdio: 'inherit' }
    );
    console.log('result');
    process.exit(result.status);
    break;
  case 'cluster:monitor':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/server/clusterHubServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);

    break;
  case 'node':
    var result = spawn.sync(
      'node',
      [require.resolve('../lib/server/NodeServer')].concat(args),
      { stdio: 'inherit' }
    );
    process.exit(result.status);

    break;
  case 'build:library:es':
    var result = spawn.sync(
      crossEnv,
      [
        babel,
        'src',
        '--out-dir',
        'es',
        '--presets=' +
          require.resolve('../lib/babelPresetModule') +
          ',' +
          presetReact,
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
      ],
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'build:css:umd':
    var result = spawn.sync(
      webpack,
      [
        '--config',
        require.resolve('../lib/config/webpack.css.build.config.js')
      ],
      { stdio: 'inherit' }
    );
    process.exit(result.status);
    break;
  case 'build':
    if (hash) {
      var result = spawn.sync(
        webpack,
        [
          '--config',
          require.resolve('../lib/config/webpack.hash.prod.config.js')
        ].concat(args),
        { stdio: 'inherit' }
      );

      process.exit(result.status);
    } else {
      var result = spawn.sync(
        webpack,
        [
          '--config',
          require.resolve('../lib/config/webpack.prod.config.js')
        ].concat(args),
        { stdio: 'inherit' }
      );

      process.exit(result.status);
    }
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
    console.log('fz-react-cli > Unknown script "' + script + '".');
    console.log('fz-react-cli app <appName>');
    console.log('fz-react-cli library <libraryName>');
    console.log('fz-react-cli start');
    console.log('fz-react-cli build');
    console.log('fz-react-cli sstest');
    console.log('fz-react-cli test');
    console.log('fz-react-cli publish:report');
    console.log('fz-react-cli build:library:es');
    console.log('fz-react-cli gitclone <last argument clone folder>');
    console.log('fz-react-cli hgclone <last argument clone folder>');
    process.exit(0);
    break;
}
