import fs from 'fs';
import { log } from '../utils';

let unitTestReport = [];

const result = function (inp) {
  let testPathPattern = process.argv[process.argv.length - 1];
  if (testPathPattern.indexOf('--') !== -1) {
    testPathPattern = '';
  } else {
    testPathPattern = fs.realpathSync(process.cwd());
  }
  let testPathRegex = new RegExp(testPathPattern);
  let { testResults } = inp;
  let testFilesArr = [];

  testResults.forEach(testResult => {
    let filePath = testResult.testFilePath;
    if (!testPathRegex.test(filePath)) {
      return;
    }
    filePath = filePath.replace('.spec', '');
    filePath = filePath.replace('/__tests__', '');
    let fileJson = {};
    fileJson.testPath = testResult.testFilePath;
    fileJson.sourcePath = filePath;
    fileJson.data = testResult;
    testFilesArr.push(fileJson);
    testResult.testResults &&
      testResult.testResults.filter(t => t.status === 'failed').forEach(t => {
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
  if (coverageSummary.indexOf('\\') !== -1) {
    coverageSummary = coverageSummary.replace(/\\/g, '\\\\');
  }
  let coverageJson = JSON.parse(coverageSummary);
  let linesPercent = 0;
  let functionPercent = 0;
  let statementPerment = 0;
  let branchesPercent = 0;
  let i;
  for (i = 0; i < testFilesArr.length; i++) {
    let curSourceFile = testFilesArr[i].sourcePath;
    let coverageData = coverageJson[curSourceFile];
    if (coverageData === undefined) {
      log(
        `Can"t able to find source for ${
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
  let totalLinesPercent = linesPercent / (i * 100) * 100;
  let totalFunctionPercent = functionPercent / (i * 100) * 100;
  let totalStatementPercent = statementPerment / (i * 100) * 100;
  // eslint-disable-next-line no-unused-vars
  let totalBranchesPercent = branchesPercent / (i * 100) * 100;
  let totalPercentage =
    totalLinesPercent +
    totalFunctionPercent +
    totalStatementPercent +
    totalStatementPercent;
  let coverage = totalPercentage / 4;
  log(`COVERAGE ${coverage.toFixed(2)}%`);

  let html = `<html>
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
			${unitTestReport.map(
    t => `<tr>
					<td>${t.title}</td>
					<td>${t.fullName}</td>
					<td>${t.filePath}</td>
				</tr>`
  )}
			</table>
			<br/>COVERAGE <span class="${
  coverage < 60 ? 'red' : 'green'
}">${coverage.toFixed(2)}%</span> <br/> less than 60% consider failure
		</body>
	</html>
		`;
  try {
    fs.mkdirSync('./unittest');
  } catch (e) {
    log(e);
  }
  fs.writeFileSync('./unittest/index.html', html, 'utf8');
  if (coverage < 60) {
    throw new Error(
      'The coverage percentage calculated for the test files are below 60% please look at the coverage file and try to cover more lines and functions.'
    );
  }
};

module.exports = result;
