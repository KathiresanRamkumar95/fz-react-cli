'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require('fs');
var path = require('path');

var appPath = fs.realpathSync(process.cwd());

function saveReport(report, name) {

    var reportPath = path.resolve(appPath, 'performance-reports');
    if (!fs.existsSync(reportPath)) {
        fs.mkdirSync(reportPath);
        var html = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/report.html')).toString();
        fs.writeFileSync(path.resolve(reportPath, './report.html'), html);
    }

    if (!fs.existsSync(path.resolve(reportPath, 'js'))) {
        fs.mkdirSync(path.resolve(reportPath, 'js'));
        var master = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/js/master.js')).toString();
        fs.writeFileSync(path.resolve(reportPath, './js/master.js'), master);
    } else {
        var _master = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/js/master.js')).toString();
        fs.writeFileSync(path.resolve(reportPath, './js/master.js'), _master);
    }

    if (!fs.existsSync(path.resolve(reportPath, 'css'))) {
        fs.mkdirSync(path.resolve(reportPath, 'css'));
        var css = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/css/report.css')).toString();
        fs.writeFileSync(path.resolve(reportPath, './css/report.css'), css);
    }

    if (!fs.existsSync(path.resolve(reportPath, './js/reports.js'))) {
        var obj = _defineProperty({}, name, report);
        obj = JSON.stringify(obj);
        var content = "var reports = " + obj;
        fs.writeFileSync(path.resolve(reportPath, './js/reports.js'), content);
    } else {
        var _content = fs.readFileSync(path.resolve(reportPath, './js/reports.js')).toString();
        var data = _content.substr(14);
        data = JSON.parse(data);
        data[name] = report;
        data = JSON.stringify(data);
        _content = "var reports = " + data;
        fs.writeFileSync(path.resolve(reportPath, './js/reports.js'), _content);
    }
}

module.exports = saveReport;