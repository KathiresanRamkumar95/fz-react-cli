/*eslint no-console: "error"*/
'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var spawn = require('cross-spawn');
var bodyParser = require('body-parser');
var config = require('../config/webpack.docs.config');
var ssTest = require('fz-screenshot-test');
var getIP = require('../utils/ipaddress');
var app = express();
var appPath = fs.realpathSync(process.cwd());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  // to support URL-encoded bodies
  extended: true
}));
//config.entry.main = path.join(appPath, "index.js");
//console.log(config.entry);
var compiler = webpack(config);

var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || '9292';
var seleniumHub = process.env.npm_config_selenium_hub || 'htt' + 'p://zsupport-tech-1.tsi.zohocorpin.com:4444';
var repoBranch = process.env.npm_config_repo_branch || false;
var referBranch = process.env.npm_config_refer_branch || 'master';
var url = 'htt' + 'p://' + host + ':' + port;
var wMid = require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
});
app.use(wMid);

app.use(require('webpack-hot-middleware')(compiler));

app.get('/docs/component.html', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'docs', 'component.html'));
});

app.get('/docs/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'docs', 'index.html'));
});
if (repoBranch) {
  app.post('/repo/merge', function (req, res) {
    var branch = selectn('body.ref', req);
    if (branch && branch.endsWith(repoBranch)) {
      var results = spawn.sync('git', ['pull', 'origin', repoBranch], {
        stdio: 'inherit'
      });
    }
    res.send('done');
  });
}
var server = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
    console.log('you can change hostname and port using following command');
    console.log('npm start --server:host=vimal-zt58.tsi.zohocorpin.com --server:port=8080');
  }
  console.log('Listening at ' + url + '/docs/');
});

// var results = spawn.sync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
//   encoding: 'utf8'
// });
// var currentBranch = results.output.filter(d => d)[0];
// currentBranch = currentBranch.replace(/(\r\n|\n|\r)/gm, '');
// spawn.sync('git', ['checkout', referBranch], { encoding: 'utf8' });
// spawn.sync('git', ['pull'], { encoding: 'utf8' });
ssTest.run({
  seleniumHub: seleniumHub,
  ip: 'http://' + host + ':' + port, //http://docsserver:9292
  url: 'http://' + host + ':' + port + '/docs/component.html',
  mode: 'test',
  folderPrefix: 'my_ui_',
  script: 'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return JSON.stringify(Objlist);'
}, function () {
  console.log('Current Mode call back server kill function called..!');
  referenceMode();
});

var referenceMode = function referenceMode() {
  spawn.sync('git', ['checkout', referBranch], { encoding: 'utf8' });

  console.log('Reference Branch test mode test called..!');

  ssTest.run({
    seleniumHub: seleniumHub,
    ip: 'http://' + host + ':' + port, //http://docsserver:9292
    url: 'http://' + host + ':' + port + '/docs/component.html',
    mode: 'reference',
    folderPrefix: 'my_ui_',
    script: 'var Objlist={};for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist[i]=Component[i].docs.componentGroup;}}catch(err){console.log(i,err);}}; return JSON.stringify(Objlist);'
  }, function () {
    server.close();
    wMid.close();
    var result = spawn.sync('cp', ['-r', path.join(__dirname, '..', '..', 'screenshotreport', 'css'), path.join(appPath, 'screenShots')], { stdio: 'inherit' });
    var result = spawn.sync('cp', ['-r', path.join(__dirname, '..', '..', 'screenshotreport', 'js'), path.join(appPath, 'screenShots')], { stdio: 'inherit' });
    var result = spawn.sync('cp', ['-r', path.join(__dirname, '..', '..', 'screenshotreport', 'index.html'), path.join(appPath, 'screenShots')], { stdio: 'inherit' });
  });
};

// spawn.sync("git",["checkout",currentBranch],{ encoding : 'utf8' })

// console.log("Current Branch test mode test called..!")

// ssTest.run({
//     ip: "http://" + host + ":" + port, //http://docsserver:9292
//     url: "http://" + host + ":" + port + "/docs/component.html",
//     mode: "test",
//     folderPrefix: "my_ui_",
//     script: "var Objlist=[];for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist.push(i);}}catch(err){console.log(i,err);}}return Objlist"
//   }, function () {
//     server.close();
//     wMid.close();
//   });

/*var confObj = {
  ip:"115.249.224.165",
  //ci_url:"http://tsi-desk-u14:8080/React_Coverage/"+process.env.CI_BUILD_ID+"_docs/DocumentationPage.html",
  ci_url:"http://desk-qa-dev.tsi.zohocorpin.com:9292/docs/component.html",
  ci_ip:"115.249.224.165",
  url:"http://desk-qa-dev.tsi.zohocorpin.com:9292/docs/component.html",
  script:"var Objlist=[];for (i in Component){try{if(Component[i].prototype.isReactComponent){Objlist.push('http://kathir-zutk93:9292/docs/component.html#'+i);}}catch(err){console.log(i);}}return Objlist",
  mode:"reference",
  folderPrefix:"my_ui_"
}*/