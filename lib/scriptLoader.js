'use strict';

var fs = require('fs');
var path = require('path');
var script = fs.readFileSync(path.resolve(__dirname, './globScript.js'));

function injectScript() {}

injectScript.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    compilation.chunks.forEach(function (chunk) {
      chunk.files.forEach(function (filename) {
        if (filename === 'vendor.js') {
          compilation.assets[filename].children.forEach(function (child) {
            if (child._value) {
              child._value = script + child._value;
            }
          });
        }
      });
    });
    callback();
  });
};

module.exports = injectScript;