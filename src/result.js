var fs = require('fs');

var unitTestReport = [];
const result = function(inp) {
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
  testResults.forEach((testResult, i) => {
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
    testResult.testResults &&
      testResult.testResults
        .filter(t => {
          return t.status == 'failed';
        })
        .forEach(t => {
          unitTestReport.push({
            title: t.title,
            fullName: t.fullName,
            filePath: testResult.testFilePath
          });
        });
  });

  var coverageSummary = fs
    .readFileSync('./coverage/coverage-summary.json')
    .toString();
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
      console.log(
        "Can't able to find source for " +
          testFilesArr[i].testPath +
          '\n Please check the file name and the path is correct for test file'
      );
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
  var totalPercentage =
    totalLinesPercent +
    totalFunctionPercent +
    totalStatementPercent +
    totalStatementPercent;
  var coverage = totalPercentage / 4;
  console.log('COVERAGE ' + coverage.toFixed(2) + '%');

  var html = `<html>
	<head>
	<style>
	.red{
		font-weight:bold;
		color:red;
	}
	.green{
		font-weight:bold;
		color:green;
	}
	table
		{
    font-family: arial, sans-serif;
    border-collapse: collapse;
		}

		td, th
		{
    border: 1px solid #dddddd;
    padding: 8px;
		}
	</style>
	</head>
		<body>
			<table>
			<tr>
				<th>Title</th>
				<th>FullName</th>
				<th>Test Case Path</th>
			</tr>
			${unitTestReport.map(t => {
        return `<tr>
					<td>${t.title}</td>
					<td>${t.fullName}</td>
					<td>${t.filePath}</td>
				</tr>`;
      })}
			</table>
			<br/>COVERAGE <span class="${coverage < 60
        ? 'red'
        : 'green'}">${coverage.toFixed(
    2
  )}%</span> <br/> less than 60% consider failure
		</body>
	</html>
		`;
  try {
    fs.mkdirSync('./unittest');
  } catch (e) {
    console.log(e);
  }
  fs.writeFileSync('./unittest/index.html', html, 'utf8');
  if (coverage < 60) {
    throw new Error(
      'The coverage percentage calculated for the test files are below 60% please look at the coverage file and try to cover more lines and functions.'
    );
  }
};

// var resultJson = fs.readFileSync("./test.json").toString();
// resultJson = JSON.parse(resultJson);

// result(resultJson);

module.exports = result;
