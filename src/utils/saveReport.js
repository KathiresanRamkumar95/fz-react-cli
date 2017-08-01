const fs = require('fs');
const path = require('path');
const {copy} = require('fz-fs-utils');

var appPath = fs.realpathSync(process.cwd());
let reportPath = path.resolve(appPath, 'performance-reports');

function updateReports(report, name){
    if (!fs.existsSync(path.resolve(reportPath, './js/reports.js'))){
        let obj = {
            [name]: report
        }
        obj = JSON.stringify(obj);
        let content = "var reports = " + obj;
        fs.writeFileSync(path.resolve(reportPath, './js/reports.js'), content);
    }else{
        let content = fs.readFileSync(path.resolve(reportPath, './js/reports.js')).toString();
        let data = content.substr(14);
        data = JSON.parse(data);
        data[name] = report;
        data = JSON.stringify(data);
        content = "var reports = " + data;
        fs.writeFileSync(path.resolve(reportPath, './js/reports.js'), content);
    }
}

function saveReport(report, name){

    if (!fs.existsSync(reportPath)){
        let srcPath = path.resolve(__dirname, '../../performance-reports');
        copy(srcPath, appPath);
    }
    updateReports(report, name);

}

module.exports = saveReport;
