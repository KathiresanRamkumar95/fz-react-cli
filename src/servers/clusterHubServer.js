import path from 'path';
import fs from 'fs';
import express from 'express';

import { getOptions, getServerURL, log } from '../utils';

let options = getOptions();
let {
  cluster: { server }
} = options;

let app = express();
let appPath = process.cwd();

let clusterConfigPath = path.join(appPath, 'clusterConfig.js');
let config;

if (fs.existsSync(clusterConfigPath)) {
  config = require(clusterConfigPath);
} else {
  throw new Error(
    `clusterConfig.js doen't exist under following path - ${clusterConfigPath}`
  );
}

app.get('/clusterhub/nodes', (req, res) => {
  res.send(JSON.stringify(config.cluster));
});

app.use(
  '/clusterhub',
  express.static(path.join(__dirname, '..', '..', 'templates', 'clusterhub'))
);

app.listen(server.port, err => {
  if (err) {
    throw err;
  }
  log(`Listening at ${getServerURL(server, 'ht' + 'tp')}/clusterhub/`);
});
