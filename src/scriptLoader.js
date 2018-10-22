let fs = require('fs');
let path = require('path');
let script = fs.readFileSync(path.resolve(__dirname, './globScript.js'));

function injectScript() {}

injectScript.prototype.apply = compiler => {
  compiler.plugin('emit', (compilation, callback) => {
    compilation.chunks.forEach(chunk => {
      chunk.files.forEach(filename => {
        if (filename === 'vendor.js') {
          compilation.assets[filename].children.forEach(child => {
            if (child._value) {
              child._value=script+child._value;
            }
          });
        }
      });
    });
    callback();
  });
};

module.exports = injectScript;
