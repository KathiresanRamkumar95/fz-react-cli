'use strict';

var path = require('path');
var express = require('express');
var fs = require('fs');
var app = express();
var host = 'localhost';
var port = process.env.npm_config_server_port || '4000';
var url = 'htt' + 'p://' + host + ':' + port;
var appPath = fs.realpathSync(process.cwd());
/* file not available handling */
var config = fs.readFileSync(path.join(appPath, 'clusterConfig.js'), 'utf-8');
config = JSON.parse(config);

app.get('/clusterhub/nodes', function (req, res) {
  res.send(JSON.stringify(config.cluster));
});
app.use('/clusterhub', express.static(path.join(__dirname, '..', '..', 'clusterhub')));

var server = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + url + '/clusterhub/');
});