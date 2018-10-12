'use strict';

var fs = require('fs');

var unitTestReport = [];
var result = function result(inp) {
  var testPathPattern = process.argv[process.argv.length - 1];
  if (testPathPattern.indexOf('--') != -1) {
    testPathPattern = '';
  } else {
    testPathPattern = fs.realpathSync(process.cwd());
  }
  var testPathRegex = new RegExp(testPathPattern);
  var testResults = inp.testResults;
  var testFilesArr = [];
  //  for (var i = 0; i < testResults.length; i++) {
  testResults.forEach(function (testResult, i) {
    var filePath = testResult.testFilePath;
    if (!testPathRegex.test(filePath)) {
      return;
    }
    filePath = filePath.replace('.spec', '');
    filePath = filePath.replace('/__tests__', '');
    filePath = filePath.replace('/__test__', '');
    var fileJson = {};
    fileJson.testPath = testResult.testFilePath;
    fileJson.sourcePath = filePath;
    fileJson.data = testResult;
    testFilesArr.push(fileJson);
    testResult.testResults && testResult.testResults.filter(function (t) {
      return t.status == 'failed';
    }).forEach(function (t) {
      unitTestReport.push({
        title: t.title,
        fullName: t.fullName,
        filePath: testResult.testFilePath
      });
    });
  });
  var coverageSummary = fs.readFileSync('./commitCoverage/coverage-summary.json').toString();

  if (coverageSummary.indexOf('\\') != -1) {
    coverageSummary = coverageSummary.replace(/\\/g, '\\\\');
  }
  var coverageJson = JSON.parse(coverageSummary);
  var linesPercent = 0;
  var functionPercent = 0;
  var statementPerment = 0;
  var branchesPercent = 0;

  var fileList = '<h4>Changed files in last code check-in</h4><ul>';
  for (var i = 0; i < testFilesArr.length; i++) {
    var curSourceFile = testFilesArr[i].sourcePath;
    fileList = fileList + '<li>' + curSourceFile + '</li>';
    var coverageData = coverageJson[curSourceFile];
    if (coverageData == undefined) {
      console.log("Can't able to find source for " + testFilesArr[i].testPath + '\n Please check the file name and the path is correct for test file');
      continue;
    }
    linesPercent += coverageData.lines.pct;
    functionPercent += coverageData.functions.pct;
    statementPerment += coverageData.statements.pct;
    branchesPercent += coverageData.branches.pct;
  }

  fileList = fileList + '</ul>';
  if (testFilesArr.length == 0) {
    fileList = '<div></div>';
    
  var totalLinesPercent = linesPercent / (i * 100) * 100;
  var totalFunctionPercent = functionPercent / (i * 100) * 100;
  var totalStatementPercent = statementPerment / (i * 100) * 100;
  var totalBranchesPercent = branchesPercent / (i * 100) * 100;
  var totalPercentage = totalLinesPercent + totalFunctionPercent + totalStatementPercent + totalBranchesPercent;
  var coverage = (totalPercentage / 4).toFixed(2);
  coverage = Number(coverage);

  if (Number.isNaN(coverage)) {
    fileList = '<div></div>';
    console.log("This build does't have any JS changes!");
    coverage = 0;
  } else {
    console.log('COVERAGE ' + coverage + '%');
  }

  var html = '<html><head><style>.red{font-weight:bold;color:red;}.green{font-weight:bold;color:green;}</style></head><body><br/>COVERAGE <span class="' + (coverage < 60 ? 'red' : 'green') + '">' + coverage + '%</span> <br/> less than 60% consider failure' + fileList + '</body></html>';

  if (!fs.existsSync('./coverageTest')) {
    fs.mkdirSync('./coverageTest');
  }
  fs.writeFileSync('./coverageTest/index.html', html, 'utf8');
};

module.exports = result;