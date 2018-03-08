'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _middleware = require('react-error-overlay/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _HMRMiddleware = require('../middlewares/HMRMiddleware');

var _HMRMiddleware2 = _interopRequireDefault(_HMRMiddleware);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var server = options.server,
    appInfo = options.app,
    disableContextURL = options.disableContextURL;
var host = server.host,
    port = server.port,
    locale = server.locale,
    mode = server.mode,
    hotReload = server.hotReload,
    hasMock = server.hasMock;
var context = appInfo.context,
    folder = appInfo.folder;


var contextURL = disableContextURL ? '' : context;
var serverUrl = (0, _utils.getServerURL)('htt' + 'ps', server);

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
	extended: true
}));

var config = void 0;
if (mode === 'production') {
	config = require('../configs/webpack.prod.config');
	app.use((0, _compression2.default)());
} else if (hotReload) {
	config = require('../configs/webpack.prod.config');
} else {
	config = require('../configs/webpack.dev.config');
}

var compiler = (0, _webpack2.default)(config);
var appPath = process.cwd();

app.use((0, _webpackDevMiddleware2.default)(compiler), {
	noInfo: true,
	publicPath: mode === 'production' ? disableContextURL ? serverUrl : serverUrl + '/' + context : config.output.publicPath,
	headers: { 'Access-Control-Allow-Origin': '*' }
});

if (hotReload) {
	app.use((0, _middleware2.default)());
}

app.use((0, _HMRMiddleware2.default)(compiler, { path: '/sockjs-node/info' }));

if (hasMock) {
	var mockServerPath = _path2.default.join(appPath, 'mockapi', 'index.js');
	if (_fs2.default.existsSync(mockServerPath)) {
		var mockServer = require(mockServerPath);
		mockServer(app);
	} else {
		(0, _utils.log)('You must export a function from mockapi folder by only we can provide mock api feature');
	}
}

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	next();
}).use(contextURL + '/fonts', _express2.default.static(context + '/fonts'));

app.use('/wms/*', function (req, res) {
	res.sendFile(_path2.default.join(__dirname, '..', '..', 'templates', 'wms', 'index.html'));
});

var httpsServer = _https2.default.createServer({
	key: _fs2.default.readFileSync(_path2.default.join(__dirname, '../../cert/key.pem')),
	cert: _fs2.default.readFileSync(_path2.default.join(__dirname, '../../cert/cert.pem')),
	passphrase: 'zddqa1585f82'
}, app);

var wss = new _ws2.default.Server({ server: server });
var wsPool = [];

wss.on('connection', function (ws, req) {
	wsPool.push(ws);

	ws.on('close', function () {
		wsPool = wsPool.filter(function (ws1) {
			return ws1 != ws;
		});
	});

	ws.on('message', function (message) {
		(0, _utils.log)('received: %s', message);
	});

	ws.send('something');
});

app.post('/wmsmockapi', function (req, res) {
	wsPool.forEach(function (ws) {
		var body = req.body;

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
	app.use(contextURL + '/*', _express2.default.static(context));
} else {
	app.use(_express2.default.static(context));
	app.use('/*', _express2.default.static(context));
}

httpsServer.listen(port, function (err) {
	if (err) {
		throw err;
	}
	(0, _utils.log)('Listening at ' + serverUrl);
});

var httpPort = Number(port) + 1;

app.listen(httpPort, function (err) {
	if (err) {
		throw err;
	}
	(0, _utils.log)('Listening at ' + (0, _utils.getServerURL)('ht' + 'tp', { host: host, locale: locale, port: httpPort }) + ('/' + contextURL + '/'));
});