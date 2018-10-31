'use strict';

let fs = require('fs');

let unitTestReport = [];
let result = function result(inp) {
  let testPathPattern = process.argv[process.argv.length - 1];

  if (testPathPattern.indexOf('--') != -1) {
    testPathPattern = '';
  } else {
    testPathPattern = fs.realpathSync(process.cwd());
  }
  let testPathRegex = new RegExp(testPathPattern);
  let testResults = inp.testResults;
  let testFilesArr = [];
  testResults.forEach((testResult, i) => {
    let filePath = testResult.testFilePath;
    if (!testPathRegex.test(filePath)) {
      return;
    }
    filePath = filePath.replace('.spec', '');
    filePath = filePath.replace('/__tests__', '');
    filePath = filePath.replace('/__test__', '');
    let fileJson = {};
    fileJson.testPath = testResult.testFilePath;
    fileJson.sourcePath = filePath;
    console.log(filePath);
    fileJson.data = testResult;
    testFilesArr.push(fileJson);
    testResult.testResults &&
      testResult.testResults.filter(t => t.status == 'failed').forEach(t => {
        unitTestReport.push({
          title: t.title,
          fullName: t.fullName,
          filePath: testResult.testFilePath
        });
      });
  });

  let coverageSummary = fs
    .readFileSync('./coverage/coverage-summary.json')
    .toString();
  if (coverageSummary.indexOf('\\') != -1) {
    coverageSummary = coverageSummary.replace(/\\/g, '\\\\');
  }
  let coverageJson = JSON.parse(coverageSummary);
  let linesPercent = 0;
  let functionPercent = 0;
  let statementPerment = 0;
  let branchesPercent = 0;

  let fileList = '<h4>Changed files in last code check-in</h4><ul>';
  for (var i = 0; i < testFilesArr.length; i++) {
    let curSourceFile = testFilesArr[i].sourcePath;
    fileList = `${fileList}<li>${curSourceFile}</li>`;
    let coverageData = coverageJson[curSourceFile];
    if (coverageData == undefined) {
      console.log(
        `Can't able to find source for ${
          testFilesArr[i].testPath
        }\n Please check the file name and the path is correct for test file`
      );
      continue;
    }
    linesPercent += coverageData.lines.pct;
    functionPercent += coverageData.functions.pct;
    statementPerment += coverageData.statements.pct;
    branchesPercent += coverageData.branches.pct;
  }
  fileList = `${fileList}</ul>`;
  if (testFilesArr.length == 0) {
    fileList = '<div></div>';
  }
  let totalLinesPercent = (linesPercent / (i * 100)) * 100;
  let totalFunctionPercent = (functionPercent / (i * 100)) * 100;
  let totalStatementPercent = (statementPerment / (i * 100)) * 100;
  let totalBranchesPercent = (branchesPercent / (i * 100)) * 100;
  let totalPercentage =
    totalLinesPercent +
    totalFunctionPercent +
    totalStatementPercent +
    totalBranchesPercent;
  let coverage = (totalPercentage / 4).toFixed(2);
  coverage = Number(coverage);

  if (Number.isNaN(coverage)) {
    console.log('This build does\'t have any JS changes!');
    coverage = 0;
  } else {
    console.log(`COVERAGE ${coverage}%`);
  }

  let html = `<html><head><style>.red{font-weight:bold;color:red;}.green{font-weight:bold;color:green;}</style></head><body><br/>COVERAGE <span class="${
    coverage < 60 ? 'red' : 'green'
  }">${coverage}%</span> <br/> less than 60% consider failure${fileList}</body></html>`;

  if (!fs.existsSync('./coverageTest')) {
    fs.mkdirSync('./coverageTest');
    fs.writeFileSync('./coverageTest/index.html', html, 'utf8');
  } else {
    fs.writeFileSync('./coverageTest/index.html', html, 'utf8');
  }
};

module.exports = result;
