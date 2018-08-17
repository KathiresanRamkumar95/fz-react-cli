'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getAlias = function getAlias(options) {
  var alias = {};
  var isPreactMig = options.app.isPreactMig;

  if (isPreactMig) {
    alias.react = 'preact';
    alias['react-dom'] = 'preact-compat';
  }
  return alias;
};

exports.default = getAlias;