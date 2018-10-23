'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let getIP = require('fz-react-cli/lib/utils/ipaddress');
let selectn = require('selectn');
let app = express();
let request = require('request');
const { ProjectsBundle } = require('gitlab');
let esprima = require('esprima');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const services = new ProjectsBundle({
  url: 'https://git.csez.zohocorpin.com',
  token: 'n6aqQz3RfzqRGPyMTPy8'
});

let host = process.env.npm_config_server_host || getIP();
let port = process.env.npm_config_server_port || '9292';
let url = `${'htt' + 'p://'}${host}:${port}`;

app.post('/impact/build', (req, res) => {
  req.setTimeout(0);
  let subUrl = '/logs/reactbuildinfo.txt';
  let build = selectn('body', req);
  let url = build.buildUrl.substr(0, build.buildUrl.lastIndexOf('/'));
  url = url + subUrl;
  getDetails(url, (body, esprimaObj, componentObj, err) => {
    if (err) {
      return err;
    }
    let responseObj = {};
    Object.keys(esprimaObj).forEach(file => {
      responseObj[file] = [];
      body[file].forEach(changedLine => {
        Object.keys(esprimaObj[file]).forEach(method => {
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
      let resObj = {
        chnagedMethods: responseObj,
        changedLocators: componentObj
      };
      res.send(resObj);
      res.end();
    }
  });
});

function traverseJSON(parsed, file) {
  let parsedObj = {};
  parsed.forEach(Block => {
    if (
      Block.type === 'FunctionDeclaration' ||
      Block.type === 'ExportDefaultDeclaration' ||
      Block.type === 'ExportNamedDeclaration'
    ) {
      if (Block.type === 'FunctionDeclaration') {
        var ParsedTemp = Block;
      } else {
        var ParsedTemp = Block.declaration;
      }
      if (ParsedTemp) {
        if (ParsedTemp.id) {
          let funcname = ParsedTemp.id.name;
          if (funcname !== 'mapStateToProps') {
            if (!funcname.includes('_')) {
              if (!parsedObj.hasOwnProperty(file)) {
                parsedObj[file] = {};
              }
              let tempArray = [];
              for (
                let j = ParsedTemp.loc.start.line;
                j < ParsedTemp.loc.end.line;
                j++
              ) {
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
  let changeObj = {};
  let compObj = {};
  request(url, (error, response, body) => {
    if (error) {
      return error;
    }
    if (body.includes('Source_Changeset')) {
      let branch;
      let changeSet;
      body = body.split('\n');
      body.forEach(content => {
        if (content.includes('Source_Changeset')) {
          changeSet = content.split('=')[1];
        }
        if (content.includes('SourceCoLabel')) {
          branch = content.split('=')[1];
        }
      });
      services.Commits.diff(
        1143,
        changeSet
        //'587efd32ce14620750a38ab74bc744fc52f2943a '
      ).then(result => {
        let promises = [];
        if (result) {
          result.forEach(change => {
            let p = new Promise((resolve, reject) => {
              let filename = change.new_path;
              changeObj[filename] = [];
              compObj[filename] = [];
              let diffList = change.diff.split('\n');
              let tempObj = {};
              diffList.forEach(diff => {
                if (diff.indexOf('data-id') >= 0) {
                  if (diff.indexOf('//') >= 0) {
                    if (
                      diff.substr(diff.indexOf('//') + 1).includes('data-id')
                    ) {
                      tempObj.defaultId = diff
                        .match(/(data-id=.*)/g)[0]
                        .match(/["']([^"']+?)['"]/g)[0];
                      tempObj.changedId = null;
                    }
                  }
                  if (diff.indexOf('-') == 0) {
                    tempObj.defaultId = diff
                      .match(/(data-id=.*)/g)[0]
                      .match(/["']([^"']+?)['"]/g)[0];
                    let tempIndex = diffList.indexOf(diff);
                    if (diffList[tempIndex + 1].indexOf('data-id') == -1) {
                      tempObj.changedId = null;
                    }
                  }
                  if (diff.indexOf('+') == 0) {
                    tempObj.changedId = diff
                      .match(/(data-id=.*)/g)[0]
                      .match(/["']([^"']+?)['"]/g)[0];
                    let tempIndex = diffList.indexOf(diff);
                    if (diffList[tempIndex - 1].indexOf('data-id') == -1) {
                      tempObj.defaultId = null;
                    }
                  }
                  if (
                    tempObj.hasOwnProperty('defaultId') &&
                    tempObj.hasOwnProperty('changedId')
                  ) {
                    if (tempObj.defaultId !== tempObj.changedId) {
                      compObj[filename].push(tempObj);
                      tempObj = {};
                    }
                  }
                }

                if (diff.startsWith('@')) {
                  let content = diff.split('@@')[1];
                  let tempList = content.split(' ');
                  let startingLine =
                    parseInt(tempList[1].split(',')[0]) * -1 + 3;
                  let furtherLines = parseInt(tempList[2].split(',')[0]) + 3;
                  if (parseInt(tempList[1].split(',')[1]) > 6) {
                    changeObj[filename].push(startingLine);
                  }

                  if (parseInt(tempList[2].split(',')[1]) > 6) {
                    let endValue = parseInt(tempList[2].split(',')[1]) - 6;
                    for (
                      let i = furtherLines;
                      i < furtherLines + endValue;
                      i++
                    ) {
                      changeObj[filename].push(i);
                    }
                  }
                }
              });

              if (
                !filename.includes('.spec.js') &&
                !filename.includes('.docs.js') &&
                !filename.includes('.css') &&
                filename.includes('.js')
              ) {
                try {
                  services.RepositoryFiles.show(1143, filename, branch).then(
                    res => {
                      let code = Buffer.from(res.content, 'base64').toString(
                        'ascii'
                      );
                      let parsed = esprima.parseModule(code, {
                        jsx: true,
                        loc: true
                      });
                      let methodDetail = traverseJSON(parsed.body, filename);
                      if (!Object.keys(methodDetail).length == 0) {
                        resolve(methodDetail);
                      } else {
                        resolve(false);
                      }
                    }
                  );
                } catch (err) {
                  console.log(err);
                }
              } else {
                resolve(false);
              }
            });
            promises.push(p);
          });
          Promise.all(promises).then(resPromise => {
            resPromise = Object.assign({}, ...resPromise);
            callback(changeObj, resPromise, compObj);
          });
        }
      });
    }
  });
}

let server = app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening at ${url}/impact/build/`);
  console.log('payload like => {buildUrl:test_build_url}');
});
