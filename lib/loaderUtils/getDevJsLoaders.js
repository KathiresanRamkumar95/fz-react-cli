'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDevJsLoaders = function getDevJsLoaders(needEslinting, disableES5Transpile) {
  var loaders = [{
    loader: 'babel-loader',
    options: {
      presets: [[require.resolve('babel-preset-env'), disableES5Transpile ? {
        modules: false,
        useBuiltIns: true,
        targets: {
          browsers: ['Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15']
        }
      } : { modules: false }], require.resolve('babel-preset-react')],
      plugins: disableES5Transpile ? [] : [[require.resolve('babel-plugin-transform-runtime'), {
        helpers: true,
        polyfill: true,
        regenerator: false,
        moduleName: 'babel-runtime'
      }]],
      cacheDirectory: true
    }
  }];

  if (needEslinting) {
    loaders.push({
      loader: 'eslint-loader',
      options: {
        emitError: true,
        emitWarning: true,
        configFile: _path2.default.join(__dirname, '..', '..', '.eslintrc.js')
      }
    });
  }

  return loaders;
};

exports.default = getDevJsLoaders;