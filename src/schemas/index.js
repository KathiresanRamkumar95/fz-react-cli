import { hostname } from 'os';

export default {
  app: {
    context: 'app',
    folder: 'src',
    server: {
      host: hostname(),
      port: { value: 9090, cli: 'app_port' },
      domain: { value: null, cli: 'app_domain' },
      mode: { value: 'dev', cli: 'app_mode' },
      hotReload: { value: false, cli: 'app_hotreload' },
      disableContextURL: false
    },
    staticDomainKeys: {
      js: 'js',
      css: 'css',
      images: 'images',
      fonts: 'fonts'
    },
    styleTarget: false,
    useInsertInto: false,
    useInsertAt: false,
    isReactMig: false,
    isPreactMig: false,
    hasWidget: false,
    enableChunkHash: false,
    cssUniqueness: { value: true, cli: 'css_unique' },
    outputFolder: 'build',
    bundleAnalyze: { value: false, cli: 'bundle_analyze' },
    optimize: true,
    hasMock: false,
    manifestFileName: 'manifest.json',
    manifestReplacer: false
  },
  docs: {
    server: {
      host: hostname(),
      port: { value: 9292, cli: 'docs_port' },
      // domain: { value: null, cli: 'docs_domain' },
      domain: { value: 'tsi', cli: 'docs_domain' },
      branch: false
    },
    // componentFolder: 'src',
    componentFolder: './src/components',
    cssUniqueness: { value: true, cli: 'css_unique' },
    folder: 'src'
  },
  ssTest: {
    seleniumHub: {
      // value: 'ht' + 'tp://desk-react.tsi.zohocorpin.com:4444',
      value: 'ht' + 'tp://kathir-zt252.tsi.zohocorpin.com:5555',
      cli: 'sstest_hub'
    },
    // domain: { value: null, cli: 'ssTest_domain' },
    domain: { value: 'tsi', cli: 'ssTest_domain' },
    remoteBranch: false,
    // referBranch: { value: 'master', cli: 'sstest_remotebranch' },
    referBranch: { value: 'Kathir-Master', cli: 'sstest_remotebranch' }
  },
  ssr: {
    server: {
      host: hostname(),
      port: { value: 4040, cli: 'ssr_port' },
      domain: { value: false, cli: 'ssr_domain' },
      repoUrl:
        'https://vimalesan.a@git.csez.zohocorpin.com/zohodesk/supportportal.git',
      branch: { value: 'theme1', cli: 'ssr_branch' },
      clientAppPath: 'jsapps/portalapp'
    },
    watch: { value: false, cli: 'ssr_watch' }
  },
  cluster: {
    server: {
      host: hostname(),
      port: 4000,
      domain: { value: false, cli: 'cluster_domain' }
    }
  },
  help: {
    server: {
      host: hostname(),
      port: 3000,
      domain: { value: false, cli: 'help_domain' }
    }
  },
  umd: {
    component: {
      watch: { value: false, cli: 'umdComp_watch' },
      umdVar: 'Component',
      isDocs: false,
      isHtml: false,
      outputFolder: 'build',
      cssUniqueness: { value: true, cli: 'umdComp_css_unique' },
      folder: 'src'
    },
    css: {
      watch: { value: false, cli: 'umdCss_watch' },
      outputFolder: 'build'
    },
    library: {
      umdVar: 'Component',
      outputFolder: 'build',
      watch: { value: false, cli: 'umdLib_watch' }
    }
  },
  unusedFiles: {
    usedFilesExcludes: ['node_modules'],
    appFilesExcludes: ['.docs.js$', '/__tests__/.*(spec|test).js$'],
    delete: false,
    enable: { value: false, cli: 'enable_unusedfiles' },
    outputFileName: 'Unusedfiles.json'
  },
  esLint: {
    enable: { value: false, cli: 'enable_eslint' },
    ignoreFilePaths: false
  },
  reactCliDocs: {
    server: {
      host: hostname(),
      port: { value: 3000, cli: 'reactcli_port' }
    }
  }
};
