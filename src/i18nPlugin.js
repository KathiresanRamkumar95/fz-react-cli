const path = require('path');
const fs = require('fs');
const propertytojson = require('fz-propertytojson').default;

class i18nPlugin {
  constructor(options) {
    this.targetPath = path.join(options.appPath, options.context, 'i18n');
    this.i18nPropPath = path.join(
      options.appPath,
      options.context,
      'properties'
    );
    this.baseProperty = options.baseProperty
      ? path.join(options.appPath, options.context, options.baseProperty)
      : path.join(
          options.appPath,
          options.context,
          '/properties/ApplicationResources_en_US.properties'
        );
    this.i18nObjPath = options.i18nObjPath
      ? options.i18nObjPath
      : path.join(options.appPath, options.context, 'properties/i18nkeys.json');
  }
  apply(compiler) {
    compiler.plugin('done', (compilation, callback) => {
      console.log('i18nPlugin');
      propertytojson(
        this.i18nPropPath,
        this.targetPath,
        this.baseProperty,
        this.i18nObjPath
      );
    });
  }
}

module.exports = i18nPlugin;
