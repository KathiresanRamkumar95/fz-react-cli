'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var iterateOptions = function iterateOptions(defaultOptions, userOptions) {
  return Object.keys(defaultOptions).reduce(function (options, key) {
    var option = defaultOptions[key];
    if (option && (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && !Array.isArray(option)) {
      options[key] = iterateOptions(option, userOptions[key] || {});
    } else {
      if (typeof userOptions[key] === 'boolean') {
        options[key] = userOptions[key] !== undefined ? userOptions[key] : defaultOptions[key];
      } else {
        options[key] = userOptions[key] || defaultOptions[key];
      }
    }
    return options;
  }, {});
};

var getOptions = function getOptions(defaultOptions) {
  var userOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!userOptions) {
    return defaultOptions;
  }
  return iterateOptions(defaultOptions, userOptions);
};

exports.default = getOptions;