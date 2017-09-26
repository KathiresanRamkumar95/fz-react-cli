'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var parse = require('../utils/htmlParse').parse;
var stringify = require('../utils/htmlParse').stringify;
var emptyCustomComponent = require('../utils/htmlParse').emptyCustomComponent;
var app = express();
var host = 'localhost';
var port = process.env.npm_config_server_port || '8080';
var url = 'htt' + 'p://' + host + ':' + port;
var appPath = fs.realpathSync(process.cwd());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}).use('/html', express.static(appPath));
app.get('/api/html', function (req, res) {
  var filePath = req.query.url;
  var lastSlash = filePath.lastIndexOf('/');
  var fileName = filePath.slice(lastSlash + 1);
  var remainingPath = filePath.slice(0, lastSlash + 1);
  var file = fs.readFileSync(path.join(appPath, 'components', filePath) + '.html', 'utf8');

  var cssfile = '';
  var fileNames = fileName.split('_');
  console.log(fileNames);
  if (fileNames.length > 1) {
    cssfile = '<style>' + fs.readFileSync(path.join(appPath, 'components', remainingPath + fileNames[1]) + '.css', 'utf8') + '</style>';
  } else {
    cssfile = '<style>' + fs.readFileSync(path.join(appPath, 'components', filePath) + '.css', 'utf8') + '</style>';
  }
  var customComponent = {};
  var astHtml = parse(file.toString().replace(/\n/g, '').trim(), {
    appPath: appPath,
    customComponent: customComponent
  });
  console.log(JSON.stringify(astHtml, 0, 3));
  var styles = Object.keys(customComponent).reduce(function (res, next) {
    return res + customComponent[next].style;
  }, cssfile);
  console.log();
  res.status(200).send(styles + stringify(astHtml, customComponent));
});

var server = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + url + '/html/');
});