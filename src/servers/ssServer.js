import path from 'path';
// import https from 'https';
import webpack from 'webpack';
import express from 'express';
import { spawnSync } from 'child_process';
import webpackDevMiddleware from 'webpack-dev-middleware';
import ssTest from 'fz-screenshot-test';

import {
  getOptions,
  requireOptions,
  getServerURL,
  log,
  getCurrentBranch
} from '../utils';
import defaultOptions from '../defaultOptions';
import docsConfig from '../configs/webpack.docs.config';

let userOptions = requireOptions();
let options = getOptions(defaultOptions, userOptions);
let { ssServer: server } = options;
let { host, port, domain, seleniumHub, remoteBranch, referBranch } = server;

let appPath = process.cwd();

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

log(getCurrentBranch(), 'Current Branch');

let compiler = webpack(docsConfig);
let wMid = webpackDevMiddleware(compiler, {
  logLevel: 'error',
  publicPath: docsConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
});
app.use(wMid);

app.use(require('webpack-hot-middleware')(compiler));

app.use('/docs', express.static(path.join(appPath, 'docs')));

app.use('/docs/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'docs', 'index.html'));
});

if (remoteBranch) {
  app.post('/repo/merge', (req, res) => {
    let { ref } = req.body;
    if (ref && ref.endsWith(remoteBranch)) {
      spawnSync('git', ['pull', 'origin', remoteBranch], {
        stdio: 'inherit'
      });
    }
    res.send('done');
  });
}

// let httpsServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, '../../cert/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, '../../cert/cert.pem')),
//     passphrase: 'zddqa1585f82'
//   },
//   app
// );
//
// httpsServer.listen(port, err => {
//   if (err) {
//     throw err;
//   }
//   log(`Listening at ${serverUrl}`);
// });

// let httpPort = Number(port) + 1;
let httpPort = Number(port);

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

ssTest.run(
  {
    seleniumHub: seleniumHub,
    url: `http://${host}:${port}/docs/component.html`,
    browserList: ['chrome'],
    mode: 'test',
    script:
      'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
  },
  status => {
    if (status !== false) {
      log('Current Mode call back server kill function called..!');
      // httpsServer.close();
      server.close();
      wMid.close();
      referenceMode();
    } else {
      //  httpsServer.close();
      server.close();
      wMid.close();
      log('Component list undefined.');
    }
  }
);

let referenceMode = () => {
  spawnSync('git', ['checkout', referBranch], { encoding: 'utf8' });

  log(getCurrentBranch());

  log('Reference Branch test mode test called..!');
  let wMid = require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: docsConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
  app.use(wMid);

  app.use(require('webpack-hot-middleware')(compiler));

  app.get('/docs/component.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'docs', 'component.html'));
  });
  app.get('/docs/js/babel.min.js', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', '..', 'docs', 'js', 'babel.min.js')
    );
  });
  app.get('/docs/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'docs', 'index.html'));
  });

  let server = app.listen(port, err => {
    if (err) {
      log(err);
      return;
    }
    if (!host && !port) {
      log('you can change hostname and port in your package.json');
    }
    log(
      `Listening at ${getServerURL('ht' + 'tp', {
        host,
        domain,
        port: httpPort
      })}/docs/`
    );
  });

  ssTest.run(
    {
      seleniumHub: seleniumHub,
      url: `http://${host}:${port}/docs/component.html`,
      browserList: ['chrome'],
      mode: 'reference',
      script:
        'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
    },
    () => {
      server.close();
      wMid.close();
      log('Screenshot test succesfully completed.');
    }
  );
};
