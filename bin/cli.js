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

switch (option) {
	case 'copy':
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/copy')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'move':
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/copy')].concat(args.concat(false)),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'gitclone':
		args[args.length - 1] = path.join(appPath, args[args.length - 1]);
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/clean'), args[args.length - 1]],
			{ stdio: 'inherit' }
		);
		let result = spawn.sync('git', ['clone'].concat(args), {
			stdio: 'inherit'
		});
		process.exit(result.status);
		break;
	case 'hgclone':
		args[args.length - 1] = path.join(appPath, args[args.length - 1]);
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/clean'), args[args.length - 1]],
			{ stdio: 'inherit' }
		);
		let result = spawn.sync('hg', ['clone'].concat(args), {
			stdio: 'inherit'
		});
		process.exit(result.status);
		break;
	case 'app':
		let result = spawn.sync(
			'cp',
			['-r', path.join(__dirname, '..', 'templates', 'app')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'library':
		let result = spawn.sync(
			'cp',
			['-r', path.join(__dirname, '..', 'library')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'propertyToJson':
		let result = spawn.sync(
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
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/helpServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'start':
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/server')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'clean':
		args = args.map(arg => path.join(appPath, arg));
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/utils/clean')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'docs':
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/docsServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'sstest':
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/ssServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'build:component':
		let result = spawn.sync(
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
		let result = spawn.sync(
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
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/clusterHubServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'node':
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/servers/nodeServer')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);

		break;
	case 'build:library:es':
		let result = spawn.sync(
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
		let result = spawn.sync(
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
		let result = spawn.sync(
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
		let result = spawn.sync(
			'node',
			[require.resolve('../lib/jest/run.js')].concat(args),
			{ stdio: 'inherit' }
		);
		process.exit(result.status);
		break;
	case 'publish:report':
		let result = spawn.sync(
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
