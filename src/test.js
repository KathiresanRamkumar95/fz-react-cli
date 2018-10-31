'use strict';

let jest = require('jest');
let argv = process.argv.slice(2);
let coverageList = require('./coverage.js');
let testBranch = process.env.npm_config_test_branch || 'master';
let compareBranch = process.env.npm_config_compare_branch || 'master';
let serviceName = process.env.npm_config_service_name || 'ZohoDeskReactApp';
let domainUrl =
  process.env.npm_config_impact_api || 'desk-qa-impact.tsi.zohocorpin.com:8080';

let appFolder = process.env.npm_config_app_folder || 'src';
let coverage = process.env.npm_config_commit_coverage || false;
let config = require('./config/jest.config');

if (coverage) {
  coverageList(testBranch, compareBranch, serviceName, domainUrl).then(
    resObj => {
      if (resObj.STATUS) {
        argv.push('--findRelatedTests');
        argv = argv.concat(resObj.LIST);
        argv = argv.concat(['--config', JSON.stringify(config(null, true))]);
        jest.run(argv);
      } else {
        if (resObj.REASON == 'Service Down') {
          console.log(resObj.REASON);
        } else {
          console.log(resObj.REASON);
        }
      }
    }
  );
} else {
  argv.push('--config', JSON.stringify(config(appFolder)), '--no-cache');
  jest.run(argv);
}
