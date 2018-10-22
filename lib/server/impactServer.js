'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var express = require('express');
var webpack = require('webpack');
var bodyParser = require('body-parser');
var config = require('fz-react-cli/lib/config/webpack.impact.config');
var getIP = require('fz-react-cli/lib/utils/ipaddress');
var selectn = require('selectn');
var app = express();
var request = require('request');

var _require = require('gitlab'),
    ProjectsBundle = _require.ProjectsBundle;

var esprima = require('esprima');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var services = new ProjectsBundle({
  url: 'https://git.csez.zohocorpin.com',
  token: 'n6aqQz3RfzqRGPyMTPy8'
});

var compiler = webpack(config);
var host = process.env.npm_config_server_host || getIP();
var port = process.env.npm_config_server_port || '9292';
var url = '' + ('htt' + 'p://') + host + ':' + port;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.post('/impact/build', function (req, res) {
  req.setTimeout(0);
  var subUrl = '/logs/reactbuildinfo.txt';
  var build = selectn('body', req);
  var url = build.buildUrl.substr(0, build.buildUrl.lastIndexOf('/'));
  url = url + subUrl;
  getDetails(url, function (body, esprimaObj, componentObj, err) {
    if (err) {
      return err;
    }
    var responseObj = {};
    Object.keys(esprimaObj).forEach(function (file) {
      responseObj[file] = [];
      body[file].forEach(function (changedLine) {
        Object.keys(esprimaObj[file]).forEach(function (method) {
          if (esprimaObj[file][method].includes(changedLine)) {
            if (!responseObj[file].includes(method)) {
              responseObj[file].push(method);
            }
          }
        });
      });
      if (responseObj[file].length == 0) {
        delete responseObj[file];
      }
    });
    if (responseObj == {}) {
      res.send(body);
      res.end();
    } else {
      var resObj = {
        chnagedMethods: responseObj,
        changedLocators: componentObj
      };
      res.send(resObj);
      res.end();
    }
  });
});

function traverseJSON(parsed, file) {
  var parsedObj = {};
  parsed.forEach(function (Block) {
    if (Block.type === 'FunctionDeclaration' || Block.type === 'ExportDefaultDeclaration' || Block.type === 'ExportNamedDeclaration') {
      if (Block.type === 'FunctionDeclaration') {
        var ParsedTemp = Block;
      } else {
        var ParsedTemp = Block.declaration;
      }
      if (ParsedTemp) {
        if (ParsedTemp.id) {
          var funcname = ParsedTemp.id.name;
          if (funcname !== 'mapStateToProps') {
            if (!funcname.includes('_')) {
              if (!parsedObj.hasOwnProperty(file)) {
                parsedObj[file] = {};
              }
              var tempArray = [];
              for (var j = ParsedTemp.loc.start.line; j < ParsedTemp.loc.end.line; j++) {
                tempArray.push(j);
              }
              parsedObj[file][funcname] = tempArray;
            }
          }
        }
      }
    }
  });
  return parsedObj;
}

function getDetails(url, callback) {
  var changeObj = {};
  var compObj = {};
  request(url, function (error, response, body) {
    if (error) {
      return error;
    }
    if (body.includes('Source_Changeset')) {
      var branch = void 0;
      var changeSet = void 0;
      body = body.split('\n');
      body.forEach(function (content) {
        if (content.includes('Source_Changeset')) {
          changeSet = content.split('=')[1];
        }
        if (content.includes('SourceCoLabel')) {
          branch = content.split('=')[1];
        }
      });
      services.Commits.diff(1143, changeSet
      //'587efd32ce14620750a38ab74bc744fc52f2943a '
      ).then(function (result) {
        var promises = [];
        if (result) {
          result.forEach(function (change) {
            var p = new Promise(function (resolve, reject) {
              var filename = change.new_path;
              changeObj[filename] = [];
              compObj[filename] = [];
              var diffList = change.diff.split('\n');
              var tempObj = {};
              diffList.forEach(function (diff) {
                if (diff.indexOf('data-id') >= 0) {
                  if (diff.indexOf('//') >= 0) {
                    if (diff.substr(diff.indexOf('//') + 1).includes('data-id')) {
                      tempObj.defaultId = diff.match(/(data-id=.*)/g)[0].match(/["']([^"']+?)['"]/g)[0];
                      tempObj.changedId = null;
                    }
                  }
                  if (diff.indexOf('-') == 0) {
                    tempObj.defaultId = diff.match(/(data-id=.*)/g)[0].match(/["']([^"']+?)['"]/g)[0];
                    var tempIndex = diffList.indexOf(diff);
                    if (diffList[tempIndex + 1].indexOf('data-id') == -1) {
                      tempObj.changedId = null;
                    }
                  }
                  if (diff.indexOf('+') == 0) {
                    tempObj.changedId = diff.match(/(data-id=.*)/g)[0].match(/["']([^"']+?)['"]/g)[0];
                    var _tempIndex = diffList.indexOf(diff);
                    if (diffList[_tempIndex - 1].indexOf('data-id') == -1) {
                      tempObj.defaultId = null;
                    }
                  }
                  if (tempObj.hasOwnProperty('defaultId') && tempObj.hasOwnProperty('changedId')) {
                    if (tempObj.defaultId !== tempObj.changedId) {
                      compObj[filename].push(tempObj);
                      tempObj = {};
                    }
                  }
                }

                if (diff.startsWith('@')) {
                  var content = diff.split('@@')[1];
                  var tempList = content.split(' ');
                  var startingLine = parseInt(tempList[1].split(',')[0]) * -1 + 3;
                  var furtherLines = parseInt(tempList[2].split(',')[0]) + 3;
                  if (parseInt(tempList[1].split(',')[1]) > 6) {
                    changeObj[filename].push(startingLine);
                  }

                  if (parseInt(tempList[2].split(',')[1]) > 6) {
                    var endValue = parseInt(tempList[2].split(',')[1]) - 6;
                    for (var i = furtherLines; i < furtherLines + endValue; i++) {
                      changeObj[filename].push(i);
                    }
                  }
                }
              });

              if (!filename.includes('.spec.js') && !filename.includes('.docs.js') && !filename.includes('.css') && filename.includes('.js')) {
                try {
                  services.RepositoryFiles.show(1143, filename, branch).then(function (res) {
                    var code = Buffer.from(res.content, 'base64').toString('ascii');
                    var parsed = esprima.parseModule(code, {
                      jsx: true,
                      loc: true
                    });
                    var methodDetail = traverseJSON(parsed.body, filename);
                    if (!Object.keys(methodDetail).length == 0) {
                      resolve(methodDetail);
                    } else {
                      resolve(false);
                    }
                  });
                } catch (err) {
                  console.log(err);
                }
              } else {
                resolve(false);
              }
            });
            promises.push(p);
          });
          Promise.all(promises).then(function (resPromise) {
            resPromise = Object.assign.apply(Object, [{}].concat(_toConsumableArray(resPromise)));
            callback(changeObj, resPromise, compObj);
          });
        }
      });
    }
  });
}

var server = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + url + '/impact/build/');
  console.log('payload like => {buildUrl:test_build_url}');
});