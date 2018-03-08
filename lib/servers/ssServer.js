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

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _fzScreenshotTest = require('fz-screenshot-test');

var _fzScreenshotTest2 = _interopRequireDefault(_fzScreenshotTest);

var _HMRMiddleware = require('../middlewares/HMRMiddleware');

var _HMRMiddleware2 = _interopRequireDefault(_HMRMiddleware);

var _utils = require('../utils');

var _defaultOptions = require('../defaultOptions');

var _defaultOptions2 = _interopRequireDefault(_defaultOptions);

var _webpackDocs = require('../configs/webpack.docs.config');

var _webpackDocs2 = _interopRequireDefault(_webpackDocs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userOptions = (0, _utils.requireOptions)();
var options = (0, _utils.getOptions)(_defaultOptions2.default, userOptions);
var server = options.ssServer,
    appInfo = options.app,
    disableContextURL = options.disableContextURL;
var host = server.host,
    port = server.port,
    locale = server.locale,
    seleniumHub = server.seleniumHub,
    remoteBranch = server.remoteBranch,
    referBranch = server.referBranch;
var context = appInfo.context,
    folder = appInfo.folder;


var appPath = process.cwd();
var contextURL = disableContextURL ? '' : context;
var serverUrl = (0, _utils.getServerURL)('htt' + 'ps', server);

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
	extended: true
}));

var compiler = (0, _webpack2.default)(_webpackDocs2.default);

app.use((0, _webpackDevMiddleware2.default)(compiler), {
	noInfo: true,
	publicPath: _webpackDocs2.default.output.publicPath,
	headers: { 'Access-Control-Allow-Origin': '*' }
});

app.use(require('webpack-hot-middleware')(compiler));

app.use('/docs', _express2.default.static(_path2.default.join(appPath, 'docs')));

app.use('/docs/*', function (req, res) {
	res.sendFile(_path2.default.join(__dirname, '..', '..', 'docs', 'index.html'));
});

if (branch) {
	app.post('/repo/merge', function (req, res) {
		var ref = req.body.ref;

		if (ref && ref.endsWith(branch)) {
			var results = _crossSpawn2.default.sync('git', ['pull', 'origin', branch], {
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

_fzScreenshotTest2.default.run({
	seleniumHub: seleniumHub,
	url: 'http://' + host + ':' + port + '/docs/component.html',
	browserList: ['firefox', 'chrome'],
	mode: 'test',
	script: 'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
}, function (status) {
	if (status !== false) {
		(0, _utils.log)('Current Mode call back server kill function called..!');
		referenceMode();
	} else {
		server.close();
		wMid.close();
		(0, _utils.log)('Component list undefined.');
	}
});

var referenceMode = function referenceMode() {
	_crossSpawn2.default.sync('git', ['checkout', referBranch], { encoding: 'utf8' });

	(0, _utils.log)('Reference Branch test mode test called..!');

	_fzScreenshotTest2.default.run({
		seleniumHub: seleniumHub,
		url: 'http://' + host + ':' + port + '/docs/component.html',
		browserList: ['firefox', 'chrome'],
		mode: 'reference',
		script: 'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return Objlist'
	}, function () {
		server.close();
		wMid.close();
		var result = _crossSpawn2.default.sync('cp', ['-r', _path2.default.join(__dirname, '..', '..', 'templates', 'screenShotReport'), _path2.default.join(appPath, 'screenShots')], { stdio: 'inherit' });
		(0, _utils.log)('Screenshot test succesfully completed.');
	});
};