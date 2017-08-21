'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var fs = require('fs');
var propertytojson = require('fz-propertytojson').default;

var i18nPlugin = function () {
  function i18nPlugin(options) {
    _classCallCheck(this, i18nPlugin);

    this.targetPath = path.join(options.appPath, options.context, 'i18n');
    this.i18nPropPath = path.join(options.appPath, options.context, 'properties');
    this.baseProperty = options.baseProperty ? path.join(options.appPath, options.context, options.baseProperty) : path.join(options.appPath, options.context, '/properties/ApplicationResources_en_US.properties');
    this.i18nObjPath = options.i18nObjPath ? options.i18nObjPath : path.join(options.appPath, options.context, 'properties/i18nkeys.json');
  }

  _createClass(i18nPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.plugin('done', function (compilation, callback) {
        console.log('i18nPlugin');
        propertytojson(_this.i18nPropPath, _this.targetPath, _this.baseProperty, _this.i18nObjPath);
      });
    }
  }]);

  return i18nPlugin;
}();

module.exports = i18nPlugin;