'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var getEntries = function getEntries(options, mode) {
	var appPath = process.cwd();
	var isPreactMig = options.isPreactMig,
	    hasWidget = options.hasWidget,
	    server = options.server,
	    publicPathCallback = options.publicPathCallback;


	var mainJs = [];
	var entry = { main: mainJs };

	if (mode === 'development') {
		var host = server.host,
		    port = server.port,
		    hotReload = server.hotReload;


		isPreactMig && mainJs.push('preact/devtools');
		mainJs.push(path.join(__dirname, '..', 'wmsClient') + ('wmsPath=wss://' + host + ':' + port));

		if (hotReload) {
			mainJs.push([require.resolve('../templates/HMRTemplate') + ('?hmrPath=' + url), require.resolve('react-error-overlay')]);
		}
	} else if (mode === 'production') {
		mainJs.push(require.resolve('../templates/publicPathTemplate.js') + ('?js=' + js + 'publicPathCallback=' + publicPathCallback));
	}

	mainJs.push(path.join(appPath, folder, isReactMig ? 'migration.js' : 'index.js'));

	if (hasWidget) {
		entry.widget = [];
		if (mode === 'production') {
			entry.widget.push(require.resolve('../templates/publicPathTemplate.js') + ('?js=' + js + 'publicPathCallback=' + publicPathCallback));
		}
		entry.widget.push(path.join(appPath, folder, 'widget.js'));
	}
	return entry;
};

exports.default = getEntries;