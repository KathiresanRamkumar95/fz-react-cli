'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rollupPluginBabel = require('rollup-plugin-babel');

var _rollupPluginBabel2 = _interopRequireDefault(_rollupPluginBabel);

var _rollupPluginNodeResolve = require('rollup-plugin-node-resolve');

var _rollupPluginNodeResolve2 = _interopRequireDefault(_rollupPluginNodeResolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV;
var config = {
  entry: '',
  dest: '',
  format: 'umd',
  moduleName: 'ReduxRouterMiddleWare',
  plugins: [(0, _rollupPluginNodeResolve2.default)({
    jsNext: true,
    browser: true,
    main: true
  }), (0, _rollupPluginBabel2.default)({
    exclude: 'node_modules/**'
  })]
};
if (env === 'production') {
  config.plugins.push(uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false
    }
  }));
}
exports.default = config;