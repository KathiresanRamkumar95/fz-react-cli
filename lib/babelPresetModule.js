'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  presets: [['es2015', { modules: false }]],
  plugins: [['transform-runtime', {
    helpers: true,
    polyfill: true,
    regenerator: false,
    moduleName: 'babel-runtime'
  }]]
};