'use strict';

var bodyParser = require('body-parser');
var saveReport = require('../utils/saveReport');
var fs = require('fs');
var path = require('path');
var request = require('request');
var exec = require('child_process').exec;

var masterBranchUrl = process.env.npm_config_master_reportUrl;
if (!masterBranchUrl) {
    throw 'You must pass masterBranchUrl as argument';
}
var currentBranch;

request({ url: masterBranchUrl }, function (err, response, body) {
    if (err) {
        console.log(err, 'err');return;
    }
    var content = 'var master = ' + body;
    fs.writeFileSync(path.resolve(__dirname, '../../performance-reports/js/master.js'), content);
});

exec('git rev-parse --abbrev-ref HEAD', function (err, stdout, strerr) {
    currentBranch = stdout.split('\n')[0];
});

function performanceServer(app) {

    app.use(bodyParser.json({ limit: '100mb' }));

    var reports;

    var authToken = Math.floor(Math.random() * 1000000000);

    function deleteUnusedKeys(object) {
        delete object.testCaseName;
        delete object.authToken;
        delete object.isFinished;
        return object;
    }

    app.use('/putReport', function (req, res) {
        var report = req.body;
        if (report.authToken) {
            if (Number(report.authToken) === Number(authToken)) {
                if (report.isFinished) {
                    var testCaseName = report.testCaseName;
                    report = deleteUnusedKeys(report);
                    reports[testCaseName] = report;
                    saveReport(reports, currentBranch);
                } else {
                    var testCaseName = report.testCaseName;
                    report = deleteUnusedKeys(report);
                    reports[testCaseName] = report;
                    authToken = Math.floor(Math.random() * 1000000000);
                    res.send({
                        isPut: true,
                        authToken: authToken
                    });
                }
            }
        } else {
            reports = {};
            var testCaseName = report.testCaseName;
            report = deleteUnusedKeys(report);
            reports[testCaseName] = report;
            res.send({
                isPut: true,
                authToken: authToken
            });
        }
    });
}

module.exports = performanceServer;