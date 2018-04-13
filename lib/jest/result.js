'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unitTestReport = [];

var result = function result(inp) {
  var testPathPattern = process.argv[process.argv.length - 1];
  if (testPathPattern.indexOf('--') !== -1) {
    testPathPattern = '';
  } else {
    testPathPattern = _fs2.default.realpathSync(process.cwd());
  }
  var testPathRegex = new RegExp(testPathPattern);
  var testResults = inp.testResults;

  var testFilesArr = [];

  testResults.forEach(function (testResult) {
    var filePath = testResult.testFilePath;
    if (!testPathRegex.test(filePath)) {
      return;
    }
    filePath = filePath.replace('.spec', '');
    filePath = filePath.replace('/__tests__', '');
    var fileJson = {};
    fileJson.testPath = testResult.testFilePath;
    fileJson.sourcePath = filePath;
    fileJson.data = testResult;
    testFilesArr.push(fileJson);
    testResult.testResults && testResult.testResults.filter(function (t) {
      return t.status === 'failed';
    }).forEach(function (t) {
      unitTestReport.push({
        title: t.title,
        fullName: t.fullName,
        filePath: testResult.testFilePath
      });
    });
  });

  var coverageSummary = _fs2.default.readFileSync('./coverage/coverage-summary.json').toString();
  if (coverageSummary.indexOf('\\') !== -1) {
    coverageSummary = coverageSummary.replace(/\\/g, '\\\\');
  }
  var coverageJson = JSON.parse(coverageSummary);
  var linesPercent = 0;
  var functionPercent = 0;
  var statementPerment = 0;
  var branchesPercent = 0;
  var i = void 0;
  for (i = 0; i < testFilesArr.length; i++) {
    var curSourceFile = testFilesArr[i].sourcePath;
    var coverageData = coverageJson[curSourceFile];
    if (coverageData === undefined) {
      (0, _utils.log)('Can"t able to find source for ' + testFilesArr[i].testPath + '\n Please check the file name and the path is correct for test file');
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
  // eslint-disable-next-line no-unused-vars
  var totalBranchesPercent = branchesPercent / (i * 100) * 100;
  var totalPercentage = totalLinesPercent + totalFunctionPercent + totalStatementPercent + totalStatementPercent;
  var coverage = totalPercentage / 4;
  (0, _utils.log)('COVERAGE ' + coverage.toFixed(2) + '%');

  var html = '<html>\n\t<head>\n\t<style>\n\t.red{\n\t\tfont-weight:bold;\n\t\tcolor:red;\n\t}\n\t.green{\n\t\tfont-weight:bold;\n\t\tcolor:green;\n\t}\n\ttable\n\t\t{\n    font-family: arial, sans-serif;\n    border-collapse: collapse;\n\t\t}\n\n\t\ttd, th\n\t\t{\n    border: 1px solid #dddddd;\n    padding: 8px;\n\t\t}\n\t</style>\n\t</head>\n\t\t<body>\n\t\t\t<table>\n\t\t\t<tr>\n\t\t\t\t<th>Title</th>\n\t\t\t\t<th>FullName</th>\n\t\t\t\t<th>Test Case Path</th>\n\t\t\t</tr>\n\t\t\t' + unitTestReport.map(function (t) {
    return '<tr>\n\t\t\t\t\t<td>' + t.title + '</td>\n\t\t\t\t\t<td>' + t.fullName + '</td>\n\t\t\t\t\t<td>' + t.filePath + '</td>\n\t\t\t\t</tr>';
  }) + '\n\t\t\t</table>\n\t\t\t<br/>COVERAGE <span class="' + (coverage < 60 ? 'red' : 'green') + '">' + coverage.toFixed(2) + '%</span> <br/> less than 60% consider failure\n\t\t</body>\n\t</html>\n\t\t';
  try {
    _fs2.default.mkdirSync('./unittest');
  } catch (e) {
    (0, _utils.log)(e);
  }
  _fs2.default.writeFileSync('./unittest/index.html', html, 'utf8');
  if (coverage < 60) {
    throw new Error('The coverage percentage calculated for the test files are below 60% please look at the coverage file and try to cover more lines and functions.');
  }
};

module.exports = result;