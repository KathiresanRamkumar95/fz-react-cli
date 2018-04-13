'use strict';

let _fs = require('fs');

let _fs2 = _interopRequireDefault(_fs);

let _path = require('path');

let _path2 = _interopRequireDefault(_path);

let _https = require('https');

let _https2 = _interopRequireDefault(_https);

let _http = require('http2');

let _http2 = _interopRequireDefault(_http);

let _webpack = require('webpack');

let _webpack2 = _interopRequireDefault(_webpack);

let _express = require('express');

let _express2 = _interopRequireDefault(_express);

let _ws = require('ws');

let _ws2 = _interopRequireDefault(_ws);

let _webpackDevMiddleware = require('webpack-dev-middleware');

let _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

let _middleware = require('react-error-overlay/middleware');

let _middleware2 = _interopRequireDefault(_middleware);

let _HMRMiddleware = require('../middlewares/HMRMiddleware');

let _HMRMiddleware2 = _interopRequireDefault(_HMRMiddleware);

let _utils = require('../utils');

let _defaultOptions = require('../defaultOptions');

let _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

let userOptions = (0, _utils.requireOptions)();
let options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
let server = options.server,
  appInfo = options.app,
  disableContextURL = options.disableContextURL;
let host = server.host,
  port = server.port,
  locale = server.locale,
  mode = server.mode,
  hotReload = server.hotReload,
  hasMock = server.hasMock;
let context = appInfo.context;

let contextURL = disableContextURL ? '' : `/${context}`;
let serverUrl = (0, _utils.getServerURL)('htt' + 'ps', server);

let app = (0, _express2.default)();

app.use(_express2.default.json());
app.use(
  _express2.default.urlencoded({
    extended: true
  })
);

let config = void 0;
if (mode === 'production') {
  process.isDevelopment = true;
  config = require('../configs/webpack.prod.config');
} else if (hotReload || mode === 'development') {
  process.isDevelopment = true;
  config = require('../configs/webpack.dev.config');
} else {
  throw new Error('You must configure valid option in mode');
}

let compiler = (0, _webpack2.default)(config);
let appPath = process.cwd();

app.use(
  (0, _webpackDevMiddleware2.default)(compiler, {
    logLevel: 'error',
    publicPath:
      mode === 'production'
        ? contextURL === ''
          ? `${serverUrl}/${contextURL}`
          : serverUrl + contextURL
        : config.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    compress: mode === 'production'
  })
);

if (hotReload) {
  app.use((0, _middleware2.default)());
}

app.use((0, _HMRMiddleware2.default)(compiler, { path: '/sockjs-node/info' }));

if (hasMock) {
  let mockServerPath = _path2.default.join(appPath, 'mockapi', 'index.js');
  if (_fs2.default.existsSync(mockServerPath)) {
    let mockServer = require(mockServerPath);
    mockServer(app);
  } else {
    (0, _utils.log)(
      'You must export a function from mockapi folder by only we can provide mock api feature'
    );
  }
}

app
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use(`${contextURL}/fonts`, _express2.default.static(`${context}/fonts`));

app.use('/wms/*', (req, res) => {
  res.sendFile(
    _path2.default.join(__dirname, '..', '..', 'templates', 'wms', 'index.html')
  );
});

let httpsServer = _https2.default.createServer(
  {
    key: _fs2.default.readFileSync(
      _path2.default.join(__dirname, '../../cert/key.pem')
    ),
    cert: _fs2.default.readFileSync(
      _path2.default.join(__dirname, '../../cert/cert.pem')
    ),
    passphrase: 'zddqa1585f82'
  },
  app
);

let http2Server = _http2.default.createSecureServer({
  key: _fs2.default.readFileSync(
    _path2.default.join(__dirname, '../../cert/key.pem')
  ),
  cert: _fs2.default.readFileSync(
    _path2.default.join(__dirname, '../../cert/cert.pem')
  ),
  passphrase: 'zddqa1585f82'
});

http2Server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hello World</h1>');
});

let wss = new _ws2.default.Server({ server: httpsServer });
let wsPool = [];

wss.on('connection', ws => {
  wsPool.push(ws);

  ws.on('close', () => {
    wsPool = wsPool.filter(ws1 => ws1 !== ws);
  });

  ws.on('message', message => {
    (0, _utils.log)('received: %s', message);
  });

  ws.send('something');
});

app.post('/wmsmockapi', (req, res) => {
  wsPool.forEach(ws => {
    let body = req.body;

    try {
      ws.send(JSON.stringify(body));
    } catch (e) {
      (0, _utils.log)(e, body);
    }
  });

  res.send('success');
});

if (contextURL) {
  app.use(contextURL, _express2.default.static(context));
  app.use(`${contextURL}/*`, _express2.default.static(context));
} else {
  app.use(_express2.default.static(context));
  app.use('/*', _express2.default.static(context));
}

httpsServer.listen(port, err => {
  if (err) {
    throw err;
  }
  (0, _utils.log)(`Listening at ${serverUrl}${contextURL}/`);
});

let http2Port = Number(port) + 1;

http2Server.listen(http2Port, err => {
  if (err) {
    throw err;
  }
  (0, _utils.log)(
    `Listening at ${(0, _utils.getServerURL)('ht' + 'tps', {
      host: host,
      locale: locale,
      port: http2Port
    })}${contextURL}/`
  );
});

let httpPort = http2Port + 1;

app.listen(httpPort, err => {
  if (err) {
    throw err;
  }
  (0, _utils.log)(
    `Listening at ${(0, _utils.getServerURL)('ht' + 'tp', {
      host: host,
      locale: locale,
      port: httpPort
    })}${contextURL}/`
  );
});
