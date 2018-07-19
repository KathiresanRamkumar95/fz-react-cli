'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

exports.default = {
  app: {
    context: 'app',
    folder: 'src'
  },
  server: {
    host: (0, _os.hostname)(),
    port: 9090,
    domain: null,
    mode: 'development',
    hotReload: false
  },
  docsServer: {
    host: (0, _os.hostname)(),
    port: 9292,
    domain: null,
    branch: false
  },
  helpServer: {
    host: (0, _os.hostname)(),
    port: 3000
  },
  clusterServer: {
    host: (0, _os.hostname)(),
    port: 4000
  },
  ssServer: {
    host: (0, _os.hostname)(),
    port: 8282,
    seleniumHub: 'ht' + 'tp://desk-react.tsi.zohocorpin.com:4444',
    remoteBranch: false,
    referBranch: 'theme3-demo'
  },
  nodeServer: {
    host: (0, _os.hostname)(),
    port: 4040,
    domain: false,
    repoUrl: 'https://vimalesan.a@git.csez.zohocorpin.com/zohodesk/supportportal.git',
    branch: 'theme1',
    clientAppPath: 'jsapps/portalapp'
  },
  staticDomain: {
    js: 'js',
    css: 'css',
    images: 'images',
    fonts: 'fonts'
  },
  isReactMig: false,
  isPreactMig: false,
  hasWidget: false,
  isHtml: false,
  watchUMDComponent: false,
  watchUMDCss: false,
  disableContextURL: false,
  umdVar: 'Component',
  isDocs: false,
  styleTarget: false,
  outputFolder: 'build',
  needChunkHash: false,
  cssUniqueness: true,
  bundleAnalyze: false,
  manifestReplacer: false,
  manifestFileName: 'manifest.json',
  hasMock: false,
  componentFolder: 'src',
  libraryVariable: 'Component',
  watchMode: false,
  optimize: false,
  findUnusedFiles: {
    usedFilesExcludes: ['node_modules'],
    allFilesExcludes: ['.docs.js$'],
    delete: false,
    active: false,
    outputFileName: false
  },
  esLint: {
    needEslinting: true,
    ignoreFilePath: false
  }
};