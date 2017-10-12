export function RuntimePublicPath(options) {
  this.options = options;
}
RuntimePublicPath.prototype.apply = function(compiler) {
  var runtimePublicPathStr = this.options && this.options.runtimePublicPath;
  if (!runtimePublicPathStr) {
    console.error(
      'RuntimePublicPath: no option.runtimePublicPath is specified. This plugin will do nothing.'
    );
    return;
  }
  compiler.plugin('this-compilation', function(compilation) {
    compilation.mainTemplate.plugin('require-extensions', function(
      source,
      chunk,
      hash
    ) {
      var buf = [];
      buf.push(source);
      buf.push('');
      buf.push('// Dynamic assets path override ');
      buf.push('var e=' + this.requireFn + '.e;');
      buf.push(
        this.requireFn +
          '.e = function requireEnsure(chunkId) {' +
          runtimePublicPathStr +
          ';return e(chunkId);} '
      );
      return this.asString(buf);
    });
  });
};
