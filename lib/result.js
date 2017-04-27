"use strict";

var fs = require('fs');

var result = function result(inp) {
	var testPathPattern = process.argv[process.argv.length - 1];
	if (testPathPattern.indexOf("--") != -1) {
		testPathPattern = "";
	}
	var testPathRegex = new RegExp(testPathPattern);
	var testResults = inp.testResults;
	var testFilesArr = [];
	for (var i = 0; i < testResults.length; i++) {
		var filePath = testResults[i].testFilePath;
		if (!testPathRegex.test(filePath)) {
			continue;
		}
		filePath = filePath.replace(".spec", "");
		filePath = filePath.replace("__tests__", "app");
		var fileJson = {};
		fileJson.testPath = testResults[i].testFilePath;
		fileJson.sourcePath = filePath;
		fileJson.data = testResults[i];
		testFilesArr.push(fileJson);
	}
	var coverageSummary = fs.readFileSync("./coverage/coverage-summary.json").toString();
	if (coverageSummary.indexOf("\\") != -1) {
		coverageSummary = coverageSummary.replace(/\\/g, "\\\\");
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
			throw new Error("Can't able to find source for " + testFilesArr[i].testPath + "\n Please check the file name and the path is correct for test file");
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
	var totalPercentage = totalLinesPercent + totalFunctionPercent + totalStatementPercent + totalStatementPercent;
	var coverage = totalPercentage / 4;
	console.log("COVERAGE " + coverage.toFixed(2) + "%");
	if (coverage < 60) {
		throw new Error("The coverage percentage calculated for the test files are below 60% please look at the coverage file and try to cover more lines and functions.");
	}
};

// var resultJson = fs.readFileSync("./test.json").toString();
// resultJson = JSON.parse(resultJson);

// result(resultJson);

module.exports = result;