export default {
  presets: [['es2015', { modules: false }]],
  plugins: [
    [
      'transform-runtime',
      {
        helpers: true,
        polyfill: true,
        regenerator: false,
        moduleName: 'babel-runtime'
      }
    ]
  ]
};
