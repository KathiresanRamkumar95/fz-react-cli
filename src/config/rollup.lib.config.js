import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
var env = process.env.NODE_ENV;
var config = {
  entry: '',
  dest: '',
  format: 'umd',
  moduleName: 'ReduxRouterMiddleWare',
  plugins: [
    resolve({
      jsNext: true,
      browser: true,
      main: true
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}
export default config;
