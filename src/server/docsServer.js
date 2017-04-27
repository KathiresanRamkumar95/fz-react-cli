'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var bodyParser = require('body-parser');
var config = require('../config/webpack.docs.config');
var app = express();
var appPath = fs.realpathSync(process.cwd());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
//config.entry.main = path.join(appPath, "index.js");
//console.log(config.entry);
var compiler = webpack(config);
var host = process.env.npm_config_server_host || "localhost";
var port = process.env.npm_config_server_port || "9292";
var repoBranch = process.env.npm_config_repo_branch || false;
var url = "htt" + "p://" + host + ":9292";

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/docs/component.html', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'docs', 'component.html'));
});

app.get('/docs/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '..', 'docs', 'index.html'));
});
if(repoBranch){
  /*app.use('/reports/coverage', express.static("coverage"));
  app.use('/reports/screenshot', express.static("screenshot"));
  app.use('/reports', function (req, res) {
    res.sendFile(path.join(__dirname, '..', '..', 'reports', 'index.html'));
  });*/
  
  app.post('/repo/merge',function(req,res){
    var branch=selectn("body.ref",req);
    if(branch && branch.endsWith(repoBranch)){
      var results = spawn.sync('git',['pull','origin',repoBranch],{ stdio: 'inherit' });
    }
    res.send("done")
  })
}
var server =app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  if (!process.env.npm_config_server_host && !process.env.npm_config_server_port) {
    console.log("you can change hostname and port using following command");
    console.log("npm start --server:host=vimal-zt58.tsi.zohocorpin.com --server:port=8080");
  }
  console.log('Listening at ' + url + '/docs/');
});

