'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _child_process = require('child_process');

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _webpackDocs = require('../configs/webpack.docs.config');

var _webpackDocs2 = _interopRequireDefault(_webpackDocs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var server = options.docsServer;
var host = server.host,
    port = server.port,
    locale = server.locale,
    branch = server.branch;


var appPath = process.cwd();
var serverUrl = (0, _utils.getServerURL)('htt' + 'ps', server);

var app = (0, _express2.default)();

app.use(_express2.default.json());
app.use(_express2.default.urlencoded({
	extended: true
}));

var compiler = (0, _webpack2.default)(_webpackDocs2.default);

app.use((0, _webpackDevMiddleware2.default)(compiler, {
	logLevel: 'error',
	publicPath: _webpackDocs2.default.output.publicPath,
	headers: { 'Access-Control-Allow-Origin': '*' }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/docs', _express2.default.static(_path2.default.join(appPath, 'docs')));

app.use('/docs/*', function (req, res) {
	res.sendFile(_path2.default.join(__dirname, '..', '..', 'templates', 'docs', 'index.html'));
});

if (branch) {
	app.post('/repo/merge', function (req, res) {
		var ref = req.body.ref;

		if (ref && ref.endsWith(branch)) {
			(0, _child_process.spawnSync)('git', ['pull', 'origin', branch], {
				stdio: 'inherit'
			});
		}
		res.send('done');
	});
}

var httpsServer = _https2.default.createServer({
	key: _fs2.default.readFileSync(_path2.default.join(__dirname, '../../cert/key.pem')),
	cert: _fs2.default.readFileSync(_path2.default.join(__dirname, '../../cert/cert.pem')),
	passphrase: 'zddqa1585f82'
}, app);

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
	(0, _utils.log)('Listening at ' + (0, _utils.getServerURL)('ht' + 'tp', { host: host, locale: locale, port: httpPort }) + '/docs/');
});