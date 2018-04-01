import fs from 'fs';
import path from 'path';
import https from 'https';
import webpack from 'webpack';
import express from 'express';
import WebSocket from 'ws';
import webpackDevMiddleware from 'webpack-dev-middleware';
import reactErrorOverlay from 'react-error-overlay/middleware';

import HMRMiddleware from '../middlewares/HMRMiddleware';
import { getOptions, requireOptions, getServerURL, log } from '../utils';
import defaultOptions from '../defaultOptions';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { server, app: appInfo, disableContextURL } = options;
let { host, port, locale, mode, hotReload, hasMock } = server;
let { context } = appInfo;

let contextURL = disableContextURL ? '' : `/${  context}`;
let serverUrl = getServerURL('htt' + 'ps', server);

const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

let config;
if (mode === 'production') {
	process.isDevelopment = true;
	config = require('../configs/webpack.prod.config');
} else if (hotReload || mode === 'development') {
	process.isDevelopment = true;
	config = require('../configs/webpack.dev.config');
} else {
	throw new Error('You must configure valid option in mode');
}

let compiler = webpack(config);
let appPath = process.cwd();

app.use(
	webpackDevMiddleware(compiler, {
		logLevel: 'error',
		publicPath:
			mode === 'production'
				? contextURL === ''
					? `${serverUrl  }/${  contextURL}`
					: serverUrl + contextURL
				: config.output.publicPath,
		headers: { 'Access-Control-Allow-Origin': '*' },
		compress: mode === 'production'
	})
);

if (hotReload) {
	app.use(reactErrorOverlay());
}

app.use(HMRMiddleware(compiler, { path: '/sockjs-node/info' }));

if (hasMock) {
	let mockServerPath = path.join(appPath, 'mockapi', 'index.js');
	if (fs.existsSync(mockServerPath)) {
		let mockServer = require(mockServerPath);
		mockServer(app);
	} else {
		log(
			'You must export a function from mockapi folder by only we can provide mock api feature'
		);
	}
}

app
	.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		next();
	})
	.use(`${contextURL  }/fonts`, express.static(`${context  }/fonts`));

app.use('/wms/*', (req, res) => {
	res.sendFile(
		path.join(__dirname, '..', '..', 'templates', 'wms', 'index.html')
	);
});

const httpsServer = https.createServer(
	{
		key: fs.readFileSync(path.join(__dirname, '../../cert/key.pem')),
		cert: fs.readFileSync(path.join(__dirname, '../../cert/cert.pem')),
		passphrase: 'zddqa1585f82'
	},
	app
);

const wss = new WebSocket.Server({ server: httpsServer });
let wsPool = [];

wss.on('connection', ws => {
	wsPool.push(ws);

	ws.on('close', () => {
		wsPool = wsPool.filter(ws1 => ws1 !== ws);
	});

	ws.on('message', message => {
		log('received: %s', message);
	});

	ws.send('something');
});

app.post('/wmsmockapi', (req, res) => {
	wsPool.forEach(ws => {
		let { body } = req;
		try {
			ws.send(JSON.stringify(body));
		} catch (e) {
			log(e, body);
		}
	});

	res.send('success');
});

if (contextURL) {
	app.use(contextURL, express.static(context));
	app.use(`${contextURL  }/*`, express.static(context));
} else {
	app.use(express.static(context));
	app.use('/*', express.static(context));
}

httpsServer.listen(port, err => {
	if (err) {
		throw err;
	}
	log(`Listening at ${  serverUrl  }${contextURL}/`);
});

let httpPort = Number(port) + 1;

app.listen(httpPort, err => {
	if (err) {
		throw err;
	}
	log(
		`Listening at ${ 
			getServerURL('ht' + 'tp', { host, locale, port: httpPort }) 
		}${contextURL}/`
	);
});
