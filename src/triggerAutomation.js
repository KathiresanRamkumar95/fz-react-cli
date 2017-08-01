const request = require('request');
var getIP = require('./utils/ipaddress');

function triggerAutomation(){
    let seleniumHost = process.env.npm_config_selenium_host || getIP();
    let seleniumPort = process.env.npm_config_selenium_port || 8080;

    let pagePath = process.env.npm_config_page_path || '/';
    let pagePort = process.env.npm_config_page_port || 9090;
    let pageUrl = getIP() + ':' + pagePort + pagePath;

    let browserCount = process.env.npm_config_browser_count || 1;
    let seleniumUrl = seleniumHost + ':' + seleniumPort + '/automation/automationaction.do';

    let keys = [
        'username', 'password', 'loginNeeded', 'action', 'TestCaseName', 'reportNeeded',
        'browser', 'browsercount', 'reportSendTo', 'hostname', 'timeout', 'description', 'PERFORMANCE_TESTING',
        'Severity_based_Execution', 'continue_execution', 'buganalyzer', 'authtoken', 'zgid', 'portal', 'department',
        'RUN_BY_CONF_CONFIGURATION', 'impactNeeded', 'impactId', 'clearSessionNeeded', 'environment',
        'EXECUTION_BALANCER_NEEDED', 'tags'
    ];

    let values = [
        'vasikaran', 'vasikaran147', 'true', 'RunModule', 'all', 'true', 'GOOGLECHROME', browserCount, 'vasikaran.s@zohocorp.com',
        pageUrl, '15', 'Run automation from other server', 'false', 'false', 'false', 'false',
        '121212', '', '', '', 'false', 'false', 'null', 'false', 'LOC', 'false', ''
    ];

    let paramObject ={};

    keys.forEach((key, index)=>{
        paramObject[key] = values[index];
    })

    request({url:seleniumUrl, qs:paramObject}, function(err, response, body) {
        if(err) { console.log(err); return; }
        global.server.close();
        global.webpackDevMiddleware.close();
        console.log(response.statusCode === 200 ? 'Automation triggered end' : 'Automation running failed');
    });
}

function triggerAutomationPlugin(options){
    this.options = options;
}

triggerAutomationPlugin.prototype ={
    constructor:triggerAutomationPlugin,

    apply:function apply(compiler){
       compiler.plugin("done", function(){
           console.log('Automation trigger start');
           triggerAutomation();
       })
    }
}

module.exports = triggerAutomationPlugin;
