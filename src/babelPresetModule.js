export default {
  presets: [['es2015', { modules: false }]],
  plugins: [
    [
      'transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
        moduleName: 'babel-runtime'
      }
    ]
  ]
};
