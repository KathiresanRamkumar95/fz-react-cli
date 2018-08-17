'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getEntries = function getEntries(appSchemas, mode) {
  var appPath = process.cwd();
  var _appSchemas$app = appSchemas.app,
      isPreactMig = _appSchemas$app.isPreactMig,
      isReactMig = _appSchemas$app.isReactMig,
      hasWidget = _appSchemas$app.hasWidget,
      server = _appSchemas$app.server,
      folder = _appSchemas$app.folder,
      js = _appSchemas$app.staticDomainKeys.js;


  var mainJs = [];
  var entry = { main: mainJs };

  if (mode === 'development') {
    var hotReload = server.hotReload;


    isPreactMig && mainJs.push('preact/devtools');
    mainJs.push(_path2.default.join(__dirname, '..', 'templates', 'WMSTemplate') + '?wmsPath=wss:' + (0, _utils.getServerURL)(server));

    if (hotReload) {
      var url = (0, _utils.getServerURL)(server);
      mainJs.push([require.resolve('../templates/HMRTemplate') + '?hmrPath=' + url, require.resolve('react-error-overlay')]);
    }
  } else if (mode === 'production') {
    mainJs.push(require.resolve('../templates/publicPathTemplate.js') + '?js=' + js);
  }

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