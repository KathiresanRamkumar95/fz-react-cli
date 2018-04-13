import path from 'path';
import fs from 'fs';
import express from 'express';

import { getOptions, requireOptions, getServerURL, log } from '../utils';
import defaultOptions from '../defaultOptions';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { clusterServer: server } = options;
let serverUrl = getServerURL('ht' + 'tp', server);
let { port } = server;

let app = express();
let appPath = process.cwd();

let clusterConfigPath = path.join(appPath, 'clusterConfig.js');
let config;

if (fs.existsSync(clusterConfigPath)) {
  config = require(clusterConfigPath);
} else {
  throw new Error(
    `clusterConfig.js doen't exist under following path - ${  clusterConfigPath}`
  );
}

app.get('/clusterhub/nodes', (req, res) => {
  res.send(JSON.stringify(config.cluster));
});

app.use(
  '/clusterhub',
  express.static(path.join(__dirname, '..', '..', 'templates', 'clusterhub'))
);

app.listen(port, err => {
  if (err) {
    throw err;
  }
  log(`Listening at ${  serverUrl  }/clusterhub/`);
});
