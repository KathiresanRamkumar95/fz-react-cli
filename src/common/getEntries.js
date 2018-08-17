import path from 'path';
import { getServerURL } from '../utils';

let getEntries = (appSchemas, mode) => {
  let appPath = process.cwd();
  let {
    isPreactMig,
    isReactMig,
    hasWidget,
    server,
    folder,
    staticDomainKeys: { js }
  } = appSchemas.app;

  let mainJs = [];
  let entry = { main: mainJs };

  if (mode === 'development') {
    let { hotReload } = server;

    isPreactMig && mainJs.push('preact/devtools');
    mainJs.push(
      `${path.join(
        __dirname,
        '..',
        'templates',
        'WMSTemplate'
      )}?wmsPath=wss:${getServerURL(server)}`
    );

    if (hotReload) {
      let url = getServerURL(server);
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
