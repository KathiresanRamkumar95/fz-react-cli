'use strict';

var http = require('http');
var url = require('url');
var Path = require('path');

function coverage(devBranch, compareWith, serviceName, domain) {
  var path = '/impact/ImpactModuleAction.do?action=getCommitDiffFileDetail&serviceName=' + serviceName + '&masterBranchCommitHash=' + compareWith + '&buildCommitHash=' + devBranch;
  var myURL = url.parse(domain);
  var host = myURL.protocol,
      port = myURL.host;

  host = host.replace(':', '');
  port = parseInt(port);

  var options = {
    host: host,
    port: port,
    path: path,
    method: 'GET'
  };
  return new Promise(function (resolve, reject) {
    var request = apiCall(options, function (callValue) {
      var Response = JSON.parse(callValue);
      if (Object.keys(Response).length > 0) {
        if (Object.prototype.hasOwnProperty.call(Response, 'STATUS')) {
          if (Response.STATUS) {
            var listOfFiles = [];
            if (Object.keys(Response.DIFF_FILES).length > 0) {
              if (Object.prototype.hasOwnProperty.call(Response.DIFF_FILES, 'ADDED')) {
                if (Response.DIFF_FILES.ADDED.length > 0) {
                  listOfFiles = listOfFiles.concat(listMaker(Response.DIFF_FILES.ADDED));
                }
              }
              if (Object.prototype.hasOwnProperty.call(Response.DIFF_FILES, 'UPDATED')) {
                if (Response.DIFF_FILES.UPDATED.length > 0) {
                  listOfFiles = listOfFiles.concat(listMaker(Response.DIFF_FILES.UPDATED));
                }
              }
              resolve({ STATUS: true, LIST: listOfFiles, REASON: 'success' });
            } else {
              resolve({
                STATUS: false,
                LIST: [],
                REASON: 'No modified js files'
              });
            }
          } else {
            resolve({ STATUS: false, LIST: [], REASON: 'Internal Error' });
          }
        } else {
          resolve({ STATUS: false, LIST: [], REASON: 'Internal Error' });
        }
      } else {
        resolve({ STATUS: false, LIST: [], REASON: 'Internal Error' });
      }
    });
    request.on('error', function (error) {
      resolve({ STATUS: false, LIST: [], REASON: 'Service Down' });
    });
    request.end();
  });
}

function apiCall(optionObject, callBack) {
  return http.request(optionObject, function (res) {
    var resText = '';
    res.setEncoding('utf8');
    res.on('data', function (data) {
      resText = resText + data;
    });
    res.on('end', function () {
      callBack(resText);
    });
  });
}

function listMaker(listOfObject) {
  var fileNameList = [];
  var curListName = process.cwd().split(Path.sep);

  listOfObject.forEach(function (fileObj) {
    var fileName = fileObj.FILEPATH;
    fileName = fileName.replace(curListName[curListName.length - 2] + Path.sep + curListName[curListName.length - 1] + Path.sep, '');
    fileName = fileName.replace('jsapps/components/', '');
    if (fileName.includes('.js') && !fileName.includes('.json') && !fileName.includes('.docs.js')) {
      fileNameList.push(fileName);
    }
  });
  return fileNameList;
}

module.exports = coverage;