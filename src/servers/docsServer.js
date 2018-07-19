import fs from 'fs';
import path from 'path';
import https from 'https';
import webpack from 'webpack';
import express from 'express';
import { spawnSync } from 'child_process';
import webpackDevMiddleware from 'webpack-dev-middleware';

import { getOptions, requireOptions, getServerURL, log } from '../utils';
import defaultOptions from '../defaultOptions';
import docsConfig from '../configs/webpack.docs.config';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { docsServer: server } = options;
let { host, port, domain, branch } = server;

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
app.use(
  '/docs/external/',
  express.static(path.join(appPath, 'docs', 'external'))
);
app.use(
  '/docs',
  express.static(path.join(__dirname, '..', '..', 'templates', 'docs'))
);

app.use('/docs/*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', 'templates', 'docs', 'index.html')
  );
});

if (branch) {
  app.post('/repo/merge', (req, res) => {
    let { ref } = req.body;
    if (ref && ref.endsWith(branch)) {
      spawnSync('git', ['pull', 'origin', branch], {
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
  log(`Listening at ${serverUrl}/docs/`);
});

let httpPort = Number(port) + 1;

app.listen(httpPort, err => {
  if (err) {
    throw err;
  }
  log(
    `Listening at ${getServerURL('ht' + 'tp', {
      host,
      domain,
      port: httpPort
    })}/docs/`
  );
});
