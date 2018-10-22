'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getInsertAt() {
  var flag = 'npm_package_fz_react_cli_insertAt';

  if (process.env[flag]) {
    return process.env[flag];
  }
  var insertAt = void 0;

  var userOption = Object.keys(process.env).filter(function (key) {
    return key.indexOf(flag) >= 0;
  });

  var _userOption = _slicedToArray(userOption, 1),
      option = _userOption[0];

  if (!option) {
    throw new Error('You have used insertAt flag but you didn\'t provided a valid position to insert style tags; To get more info about insertAt option please refer following link https://github.com/webpack-contrib/style-loader#insertat');
  }

  insertAt = process.env[option];
  var position = option.split('_');
  insertAt = _defineProperty({}, position[position.length - 1], insertAt);
  return insertAt;
}

module.exports = getInsertAt;