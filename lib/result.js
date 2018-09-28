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

  var coverageSummary = fs.readFileSync('./coverage/coverage-summary.json').toString();
  if (coverageSummary.indexOf('\\') != -1) {
    coverageSummary = coverageSummary.replace(/\\/g, '\\\\');
  }
  var coverageJson = JSON.parse(coverageSummary);
  var linesPercent = 0;
  var functionPercent = 0;
  var statementPerment = 0;
  var branchesPercent = 0;
  for (var i = 0; i < testFilesArr.length; i++) {
    var curFileObj = testFilesArr[i];
    var curSourceFile = testFilesArr[i].sourcePath;
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
  var totalLinesPercent = linesPercent / (i * 100) * 100;
  var totalFunctionPercent = functionPercent / (i * 100) * 100;
  var totalStatementPercent = statementPerment / (i * 100) * 100;
  var totalBranchesPercent = branchesPercent / (i * 100) * 100;
  var totalPercentage = totalLinesPercent + totalFunctionPercent + totalStatementPercent + totalBranchesPercent;
  var coverage = (totalPercentage / 4).toFixed(2);
  coverage = Number(coverage);

  if (Number.isNaN(coverage)) {
    console.log("This build does't have any JS changes!");
    coverage = 0;
  } else {
    console.log('COVERAGE ' + coverage + '%');
  }

  var html = '<html>\n\t<head>\n\t<style>\n\t.red{\n\t\tfont-weight:bold;\n\t\tcolor:red;\n\t}\n\t.green{\n\t\tfont-weight:bold;\n\t\tcolor:green;\n\t}\n\ttable\n\t\t{\n    font-family: arial, sans-serif;\n    border-collapse: collapse;\n\t\t}\n\n\t\ttd, th\n\t\t{\n    border: 1px solid #dddddd;\n    padding: 8px;\n\t\t}\n\t</style>\n\t</head>\n\t\t<body>\n\t\t\t<table>\n\t\t\t<tr>\n\t\t\t\t<th>Title</th>\n\t\t\t\t<th>FullName</th>\n\t\t\t\t<th>Test Case Path</th>\n\t\t\t</tr>\n\t\t\t' + unitTestReport.map(function (t) {
    return '<tr>\n\t\t\t\t\t<td>' + t.title + '</td>\n\t\t\t\t\t<td>' + t.fullName + '</td>\n\t\t\t\t\t<td>' + t.filePath + '</td>\n\t\t\t\t</tr>';
  }) + '\n\t\t\t</table>\n\t\t\t<br/>COVERAGE <span class="' + (coverage < 60 ? 'red' : 'green') + '">' + coverage + '%</span> <br/> less than 60% consider failure\n\t\t</body>\n\t</html>\n\t\t';

  if (!fs.existsSync('./unittest')) {
    fs.mkdirSync('./unittest');
  }
  fs.writeFileSync('./unittest/index.html', html, 'utf8');
};

module.exports = result;