import path from 'path';
import fs from 'fs';
import express from 'express';
import spawn from 'cross-spawn';

import {
	getOptions,
	requireOptions,
	getServerURL,
	log,
	createEventStream
} from '../utils';
import defaultOptions from '../defaultOptions';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { nodeServer: server, app: appInfo, disableContextURL } = options;
let { host, port, repoUrl, branch, clientAppPath } = server;
let { context, folder } = appInfo;

let appPath = process.cwd();
let contextURL = disableContextURL ? '' : context;
let serverUrl = getServerURL('ht' + 'tp', server);

const app = express();

let commitHash = '';
let serverProcess;

let stream = createEventStream(5000, () => {
	return { branch, commitHash, isStart: serverProcess ? true : false };
});

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,POST,PUT,DELETE,OPTIONS'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
	);
	next();
});

app.use(express.json());

app.get('/node/getInfo', (req, res) => {
	res.send(JSON.stringify({ repoUrl, host, port, branch }));
});

app.get('/node/heartbeat', streamObj.handler);

app.get('/node/clone', (req, res) => {
	let output = spawn.sync('rm', ['-R', branch], {
		encoding: 'utf8'
	});

	output = spawn.sync('git', ['clone', repoUrl, '-b', branch, branch], {
		encoding: 'utf8'
	});
	output = spawn.sync('npm', ['install'], {
		encoding: 'utf8',
		shell: true,
		cwd: path.join(appPath, branch, clientAppPath)
	});

	let test = spawn.sync('npm', ['run', 'build:component:server'], {
		encoding: 'utf8',
		shell: true,
		cwd: path.join(appPath, branch, clientAppPath)
	});

	log(test.stdout);
	res.send(output.stdout);
});

app.get('/node/isStart', (req, res) => {
	if (serverProcess) {
		res.send('true');
	} else {
		res.send('false');
	}
});

app.get('/node/start', (req, res) => {
	if (!serverProcess) {
		log(path.join(appPath, branch, clientAppPath));
		let test = spawn.sync('npm', ['run', 'build:component:server'], {
			encoding: 'utf8',
			shell: true,
			cwd: path.join(appPath, branch, clientAppPath)
		});
		log(test.stdout);
		serverProcess = spawn.sync(
			'npm',
			['run', 'serverrender', '--server:port=' + port],
			{
				encoding: 'utf8',
				shell: true,
				cwd: path.join(appPath, branch, clientAppPath)
			}
		);
		serverProcess.on('error', err => {
			log('Oh noez, teh errurz: ' + err);
			res.send('Server Error');
			serverProcess = null;
		});
		let flag = true;
		serverProcess.stdout.on('data', data => {
			log('stdout: ' + data.toString());
			if (flag) {
				res.send('Server start');
				flag = false;
			}
		});
	} else {
		res.send('Already started');
	}
});
app.get('/node/stop', (req, res) => {
	if (serverProcess) {
		serverProcess.stdin.pause();
		if (serverProcess.kill('SIGTERM')) {
			res.send('Stopped');
			serverProcess = null;
		} else {
			res.send('Not able to stop');
		}
	} else {
		res.send('Already Stopped');
	}
});
app.post('/node/deploy', (req, res) => {
	if (serverProcess) {
		serverProcess.stdin.pause();
		if (serverProcess.kill('SIGTERM')) {
			serverProcess = null;
			let test = spawn.sync('git', ['pull'], {
				encoding: 'utf8',
				shell: true,
				cwd: path.join(appPath, branch, clientAppPath)
			});
			log('pull:', test.stdout);
			let deployObj = req.body;
			test = spawn.sync(
				'git',
				['reset', '--hard', deployObj.repoInfo.hash],
				{
					encoding: 'utf8',
					shell: true,
					cwd: path.join(appPath, branch, clientAppPath)
				}
			);
			log('reset commit hash', test.stdout);
			commitHash = deployObj.repoInfo.hash;
			// test = spawn.sync('npm', ['install'], {
			//   encoding: 'utf8',
			//   shell: true,
			//   cwd: path.join(appPath, branch, clientAppPath)
			// });
			// console.log('install', test.stdout);
			test = spawn.sync('npm', ['run', 'build:component:server'], {
				encoding: 'utf8',
				shell: true,
				cwd: path.join(appPath, branch, clientAppPath)
			});
			log('server build', test.stdout);
			serverProcess = spawn.sync(
				'npm',
				[
					'run',
					'serverrender',
					'--server:port=' + port,
					'--',
					JSON.stringify(JSON.stringify(deployObj))
				],
				{
					encoding: 'utf8',
					shell: true,
					cwd: path.join(appPath, branch, clientAppPath)
				}
			);
			serverProcess.on('error', err => {
				log('Oh noez, teh errurz: ' + err);
				res.send('Server Error');
				serverProcess = null;
			});
			var flag = true;
			serverProcess.stdout.on('data', data => {
				log('stdout: ' + data.toString());
				if (flag) {
					res.send('Server start');
					flag = false;
				}
			});
		} else {
			res.send('Not able to stop');
		}
	} else {
		let test = spawn.sync('git', ['pull'], {
			encoding: 'utf8',
			shell: true,
			cwd: path.join(appPath, branch, clientAppPath)
		});
		log('pull:', test.stdout);
		let deployObj = req.body;
		test = spawn.sync('git', ['reset', '--hard', deployObj.repoInfo.hash], {
			encoding: 'utf8',
			shell: true,
			cwd: path.join(appPath, branch, clientAppPath)
		});
		log('reset commit hash', test.stdout);
		commitHash = deployObj.repoInfo.hash;
		// test = spawn.sync('npm', ['install'], {
		//   encoding: 'utf8',
		//   shell: true,
		//   cwd: path.join(appPath, branch, clientAppPath)
		// });
		// console.log('install', test.stdout);
		test = spawn.sync('npm', ['run', 'build:component:server'], {
			encoding: 'utf8',
			shell: true,
			cwd: path.join(appPath, branch, clientAppPath)
		});
		log('server build', test.stdout);
		serverProcess = spawn.sync(
			'npm',
			[
				'run',
				'serverrender',
				'--server:port=' + port,
				'--',
				JSON.stringify(JSON.stringify(deployObj))
			],
			{
				encoding: 'utf8',
				shell: true,
				cwd: path.join(appPath, branch, clientAppPath)
			}
		);
		serverProcess.on('error', err => {
			log('Oh noez, teh errurz: ' + err);
			res.send('Server Error');
			serverProcess = null;
		});
		let flag = true;
		serverProcess.stdout.on('data', data => {
			log('stdout: ' + data.toString());
			if (flag) {
				res.send('Server start');
				flag = false;
			}
		});
	}
});

app.listen(port + 1, err => {
	if (err) {
		throw err;
	}
	log('Listening at ' + serverUrl + '/node/');
});
