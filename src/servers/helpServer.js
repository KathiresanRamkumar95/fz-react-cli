import path from 'path';
import express from 'express';

import { getOptions, requireOptions, getServerURL, log } from '../utils';
import defaultOptions from '../defaultOptions';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { helpServer: server } = options;
let serverUrl = getServerURL('ht' + 'tp', server);
let { port } = server;

let app = express();

app.use(
	'/help',
	express.static(path.join(__dirname, '..', '..', 'templates', 'help'))
);

app.listen(port, err => {
	if (err) {
		throw err;
	}
	log('Listening at ' + serverUrl + '/help/');
});
