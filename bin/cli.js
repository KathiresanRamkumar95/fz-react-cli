#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
let spawn = require('cross-spawn');

let { log } = require('../lib/utils');

let presets = {
	env: require.resolve('babel-preset-env'),
	react: require.resolve('babel-preset-react')
};

let option = process.argv[2];
let args = process.argv.slice(3);
let appPath = process.cwd();

let isNodeModuleUnderAppFolder = __dirname.indexOf(appPath) !== -1;

let webpack = !isNodeModuleUnderAppFolder
	? path.join(__dirname, '..', 'node_modules', '.bin', 'webpack')
	: 'webpack';

let crossEnv = !isNodeModuleUnderAppFolder
	? path.join(__dirname, '..', 'node_modules', '.bin', 'cross-env')
	: 'cross-env';

let babel = !isNodeModuleUnderAppFolder
	? path.join(__dirname, '..', 'node_modules', '.bin', 'babel')
	: 'babel';

let propertyToJson = !isNodeModuleUnderAppFolder
	? path.join(__dirname, '..', 'node_modules', '.bin', 'propertyToJson')
	: 'propertyToJson';

let result;
switch (option) {
	case 'copy':
		result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/copy')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'move':
		result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/copy')].concat(args.concat(false)),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'gitclone':
		args[args.length - 1] = path.join(appPath, args[args.length - 1]);
		result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/clean'), args[args.length - 1]],
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		result = spawn.sync('git', ['clone'].concat(args), {
			stdio: 'inherit'
		});
		process.exit(result.status);
		break;
	case 'hgclone':
		args[args.length - 1] = path.join(appPath, args[args.length - 1]);
		result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/clean'), args[args.length - 1]],
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		result = spawn.sync('hg', ['clone'].concat(args), {
			stdio: 'inherit'
		});
		process.exit(result.status);
		break;
	case 'app':
		result = spawn.sync(
			'cp',
			['-r', path.join(__dirname, '..', 'templates', 'app')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'library':
		result = spawn.sync(
			'cp',
			['-r', path.join(__dirname, '..', 'library')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'propertyToJson':
		result = spawn.sync(
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
		result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/helpServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'start':
		result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/server')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'clean':
		args = args.map(arg => path.join(appPath, arg));
		result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/clean')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'docs':
		result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/docsServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'sstest':
		result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/ssServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'build:component':
		result = spawn.sync(
			crossEnv,
			[
				'BABEL_ENV=commonjs',
				babel,
				'src',
				'--out-dir',
				'lib',
				'--presets=' + presets.env + ',' + presets.react,
				'--copy-files'
			].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);

		break;
	case 'build:component:server':
		result = spawn.sync(
			webpack,
			[
				'--config',
				require.resolve('../lib/configs/webpack.server.config.js')
			],
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'cluster:monitor':
		result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/clusterHubServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'node':
		result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/nodeServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);

		break;
	case 'build:library:es':
		result = spawn.sync(
			crossEnv,
			[
				babel,
				'src',
				'--out-dir',
				'es',
				'--presets=' +
					require.resolve('../lib/utils/babelPresets') +
					',' +
					presets.react,
				'--copy-files'
			].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);

		break;
	case 'build:library:umd':
		result = spawn.sync(
			webpack,
			[
				'--config',
				require.resolve(
					'../lib/configs/webpack.library.build.config.js'
				)
			],
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'build':
		result = spawn.sync(
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
		result = spawn.sync(
			'node',
			[require.resolve('../lib/jest/run.js')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'publish:report':
		result = spawn.sync(
			'sh',
			[
				path.join(__dirname, '..', 'lib', 'sh', 'reportPublish.sh')
			].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	default:
		log('fz-react-cli > Unknown script "' + script + '".');
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

		break;
}
