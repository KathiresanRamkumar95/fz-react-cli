const fs = require('fs');
const path = require('path');

var appPath = fs.realpathSync(process.cwd());

function saveReport(report, name){

    let reportPath = path.resolve(appPath, 'performance-reports');
    if (!fs.existsSync(reportPath)){
        fs.mkdirSync(reportPath);
        let html = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/report.html')).toString();
        fs.writeFileSync(path.resolve(reportPath, './report.html'), html);
    }

    if (!fs.existsSync(path.resolve(reportPath, 'js'))){
        fs.mkdirSync(path.resolve(reportPath, 'js'));
        let master = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/js/master.js')).toString();
        fs.writeFileSync(path.resolve(reportPath, './js/master.js'), master);
    }else{
        let master = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/js/master.js')).toString();
        fs.writeFileSync(path.resolve(reportPath, './js/master.js'), master);
    }

    if (!fs.existsSync(path.resolve(reportPath, 'css'))){
        fs.mkdirSync(path.resolve(reportPath, 'css'));
        let css = fs.readFileSync(path.resolve(__dirname, '../../performance-reports/css/report.css')).toString();
        fs.writeFileSync(path.resolve(reportPath, './css/report.css'), css);
    }

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

module.exports = saveReport;
