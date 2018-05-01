'use strict';

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var help = false;
var dashdash = false;
//eslint-disable-next-line array-callback-return
var args = process.argv.slice(2).filter(function (arg) {
  if (dashdash) {
    return !!arg;
  } else if (arg === '--') {
    dashdash = true;
  } else if (arg.match(/^(-+|\/)(h(elp)?|\?)$/)) {
    help = true;
  } else {
    return !!arg;
  }
});
var go = function go(n) {
  if (n >= args.length) {
    return;
  }
  (0, _rimraf2.default)(args[n], function (er) {
    if (er) {
      throw er;
    }
    go(n + 1);
  });
};

if (help || args.length === 0) {
  // If they didn't ask for help, then this is not a "success"
  // eslint-disable-next-line no-console
  var log = help ? console.log : console.error;
  log('Usage: rimraf <path> [<path> ...]');
  log('');
  log('  Deletes all files and folders at "path" recursively.');
  log('');
  log('Options:');
  log('');
  log('  -h, --help    Display this usage info');
  process.exit(help ? 0 : 1);
} else {
  go(0);
}