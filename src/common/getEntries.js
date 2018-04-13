import path from 'path';

let getEntries = (options, mode) => {
  let appPath = process.cwd();
  let {
    isPreactMig,
    isReactMig,
    hasWidget,
    server,
    app,
    staticDomain
  } = options;
  let { js } = staticDomain;

  let mainJs = [];
  let entry = { main: mainJs };

  if (mode === 'development') {
    let { host, port, hotReload } = server;

    isPreactMig && mainJs.push('preact/devtools');
    mainJs.push(
      `${path.join(
        __dirname,
        '..',
        'templates',
        'WMSTemplate'
      )}?wmsPath=wss://${host}:${port}`
    );

    if (hotReload) {
      let url = `ht${'tps:'}//${host}:${port}`;
      mainJs.push([
        `${require.resolve('../templates/HMRTemplate')}?hmrPath=${url}`,
        require.resolve('react-error-overlay')
      ]);
    }
  } else if (mode === 'production') {
    mainJs.push(
      `${require.resolve('../templates/publicPathTemplate.js')}?js=${js}`
    );
  }

  let { folder } = app;

  mainJs.push(
    path.join(appPath, folder, isReactMig ? 'migration.js' : 'index.js')
  );

  if (hasWidget) {
    entry.widget = [];
    if (mode === 'production') {
      entry.widget.push(
        `${require.resolve('../templates/publicPathTemplate.js')}?js=${js}`
      );
    }
    entry.widget.push(path.join(appPath, folder, 'widget.js'));
  }
  return entry;
};

export default getEntries;
