let getEntries = (options, mode) => {
	let appPath = process.cwd();
	let { isPreactMig, hasWidget, server, publicPathCallback } = options;

	let mainJs = [];
	let entry = { main: mainJs };

	if (mode === 'development') {
		let { host, port, hotReload } = server;

		isPreactMig && mainJs.push('preact/devtools');
		mainJs.push(
			path.join(__dirname, '..', 'wmsClient') +
				`wmsPath=wss://${host}:${port}`
		);

		if (hotReload) {
			mainJs.push([
				require.resolve('../templates/HMRTemplate') + `?hmrPath=${url}`,
				require.resolve('react-error-overlay')
			]);
		}
	} else if (mode === 'production') {
		mainJs.push(
			require.resolve('../templates/publicPathTemplate.js') +
				`?js=${js}publicPathCallback=${publicPathCallback}`
		);
	}

	mainJs.push(
		path.join(appPath, folder, isReactMig ? 'migration.js' : 'index.js')
	);

	if (hasWidget) {
		entry.widget = [];
		if (mode === 'production') {
			entry.widget.push(
				require.resolve('../templates/publicPathTemplate.js') +
					`?js=${js}publicPathCallback=${publicPathCallback}`
			);
		}
		entry.widget.push(path.join(appPath, folder, 'widget.js'));
	}
	return entry;
};

export default getEntries;
