'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  presets: [['env', { modules: false }]],
  plugins: [['transform-runtime', {
    helpers: true,
    polyfill: true,
    regenerator: false,
    moduleName: 'babel-runtime'
  }]]
};