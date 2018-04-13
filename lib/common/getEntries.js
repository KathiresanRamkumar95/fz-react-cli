'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getEntries = function getEntries(options, mode) {
	var appPath = process.cwd();
	var isPreactMig = options.isPreactMig,
	    isReactMig = options.isReactMig,
	    hasWidget = options.hasWidget,
	    server = options.server,
	    app = options.app,
	    staticDomain = options.staticDomain;
	var js = staticDomain.js;


	var mainJs = [];
	var entry = { main: mainJs };

	if (mode === 'development') {
		var host = server.host,
		    port = server.port,
		    hotReload = server.hotReload;


		isPreactMig && mainJs.push('preact/devtools');
		mainJs.push(_path2.default.join(__dirname, '..', 'templates', 'WMSTemplate') + '?wmsPath=wss://' + host + ':' + port);

		if (hotReload) {
			var url = 'ht' + 'tps:' + '//' + host + ':' + port;
			mainJs.push([require.resolve('../templates/HMRTemplate') + '?hmrPath=' + url, require.resolve('react-error-overlay')]);
		}
	} else if (mode === 'production') {
		mainJs.push(require.resolve('../templates/publicPathTemplate.js') + '?js=' + js);
	}

	var folder = app.folder;


	mainJs.push(_path2.default.join(appPath, folder, isReactMig ? 'migration.js' : 'index.js'));

	if (hasWidget) {
		entry.widget = [];
		if (mode === 'production') {
			entry.widget.push(require.resolve('../templates/publicPathTemplate.js') + '?js=' + js);
		}
		entry.widget.push(_path2.default.join(appPath, folder, 'widget.js'));
	}
	return entry;
};

exports.default = getEntries;