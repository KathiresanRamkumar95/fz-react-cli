import fs from 'fs';
import path from 'path';
import https from 'https';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import express from 'express';
import spawn from 'cross-spawn';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import HMRMiddleware from '../middlewares/HMRMiddleware';
import { getOptions, requireOptions, getServerURL, log } from '../utils';
import defaultOptions from '../defaultOptions';
import docsConfig from '../configs/webpack.docs.config';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { docsServer: server, app: appInfo, disableContextURL } = options;
let { host, port, locale, branch } = server;
let { context, folder } = appInfo;

let appPath = process.cwd();
let contextURL = disableContextURL ? '' : context;
let serverUrl = getServerURL('htt' + 'ps', server);

const app = express();

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

let compiler = webpack(docsConfig);

app.use(
	webpackDevMiddleware(compiler, {
		noInfo: true,
		publicPath: docsConfig.output.publicPath,
		headers: { 'Access-Control-Allow-Origin': '*' }
	})
);

app.use(require('webpack-hot-middleware')(compiler));

app.use('/docs', express.static(path.join(appPath, 'docs')));

app.use('/docs/*', function(req, res) {
	res.sendFile(
		path.join(__dirname, '..', '..', 'templates', 'docs', 'index.html')
	);
});

if (branch) {
	app.post('/repo/merge', function(req, res) {
		var { ref } = req.body;
		if (ref && ref.endsWith(branch)) {
			var results = spawn.sync('git', ['pull', 'origin', branch], {
				stdio: 'inherit'
			});
		}
		res.send('done');
	});
}

const httpsServer = https.createServer(
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
