'use strict';

var jest = require('jest');
var argv = process.argv.slice(2);
var coverageList = require('./coverage.js');
var testBranch = process.env.npm_config_test_branch || 'master';
var compareBranch = process.env.npm_config_compare_branch || 'master';
var serviceName = process.env.npm_config_service_name || 'ZohoDeskReactApp';
var domainUrl = process.env.npm_config_impact_api || 'desk-qa-impact.tsi.zohocorpin.com:8080';

var appFolder = process.env.npm_config_app_folder || 'src';
var coverage = process.env.npm_config_commit_coverage || false;
var config = require('./config/jest.config');

if (coverage) {
  coverageList(testBranch, compareBranch, serviceName, domainUrl).then(function (resObj) {
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
  });
} else {
  argv.push('--config', JSON.stringify(config(appFolder)), '--no-cache');
  jest.run(argv);
}