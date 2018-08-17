'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _child_process = require('child_process');

exports.default = function () {
  var results = (0, _child_process.spawnSync)('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8'
  });

  var _results$output$filte = results.output.filter(function (d) {
    return d;
  }),
      _results$output$filte2 = _slicedToArray(_results$output$filte, 1),
      currentBranch = _results$output$filte2[0];

  return currentBranch.replace(/(\r\n|\n|\r)/gm, '');
};