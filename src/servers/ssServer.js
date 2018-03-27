import fs from 'fs';
import path from 'path';
import https from 'https';
import webpack from 'webpack';
import express from 'express';
import { spawnSync } from 'child_process';
import webpackDevMiddleware from 'webpack-dev-middleware';
import ssTest from 'fz-screenshot-test';

import { getOptions, requireOptions, getServerURL, log } from '../utils';
import defaultOptions from '../defaultOptions';
import docsConfig from '../configs/webpack.docs.config';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { ssServer: server } = options;
let { host, port, locale, seleniumHub, remoteBranch, referBranch } = server;

let appPath = process.cwd();
let serverUrl = getServerURL('htt' + 'ps', server);

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

let compiler = webpack(docsConfig);

app.use(
	webpackDevMiddleware(compiler, {
		logLevel: 'error',
		publicPath: docsConfig.output.publicPath,
		headers: { 'Access-Control-Allow-Origin': '*' }
	})
);

app.use(require('webpack-hot-middleware')(compiler));

app.use('/docs', express.static(path.join(appPath, 'docs')));

app.use('/docs/*', function(req, res) {
	res.sendFile(path.join(__dirname, '..', '..', 'docs', 'index.html'));
});

if (remoteBranch) {
	app.post('/repo/merge', function(req, res) {
		var { ref } = req.body;
		if (ref && ref.endsWith(remoteBranch)) {
			spawnSync('git', ['pull', 'origin', remoteBranch], {
				stdio: 'inherit'
			});
		}
		res.send('done');
	});
}

let httpsServer = https.createServer(
	{
		key: fs.readFileSync(path.join(__dirname, '../../cert/key.pem')),
		cert: fs.readFileSync(path.join(__dirname, '../../cert/cert.pem')),
		passphrase: 'zddqa1585f82'
	},
	app
);

httpsServer.listen(port, err => {
	if (err) {
		throw err;
	}
	log('Listening at ' + serverUrl);
});

let httpPort = Number(port) + 1;

app.listen(httpPort, err => {
	if (err) {
		throw err;
	}
	log(
		'Listening at ' +
			getServerURL('ht' + 'tp', { host, locale, port: httpPort }) +
			'/docs/'
	);
});

ssTest.run(
	{
		seleniumHub: seleniumHub,
		url: 'http://' + host + ':' + port + '/docs/component.html',
		browserList: ['firefox', 'chrome'],
		mode: 'test',
		script:
			'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
	},
	status => {
		if (status !== false) {
			log('Current Mode call back server kill function called..!');
			referenceMode();
		} else {
			server.close();
			webpackDevMiddleware.close();
			log('Component list undefined.');
		}
	}
);

let referenceMode = () => {
	spawnSync('git', ['checkout', referBranch], { encoding: 'utf8' });

	log('Reference Branch test mode test called..!');

	ssTest.run(
		{
			seleniumHub: seleniumHub,
			url: 'http://' + host + ':' + port + '/docs/component.html',
			browserList: ['firefox', 'chrome'],
			mode: 'reference',
			script:
				'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
		},
		() => {
			server.close();
			webpackDevMiddleware.close();
			spawnSync(
				'cp',
				[
					'-r',
					path.join(
						__dirname,
						'..',
						'..',
						'templates',
						'screenShotReport'
					),
					path.join(appPath, 'screenShots')
				],
				{ stdio: 'inherit' }
			);
			log('Screenshot test succesfully completed.');
		}
	);
};
