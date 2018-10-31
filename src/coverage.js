let http = require('http');
let url = require('url');
let Path = require('path');

function coverage(devBranch, compareWith, serviceName, domain) {
  let path = `/impact/ImpactModuleAction.do?action=getCommitDiffFileDetail&serviceName=${serviceName}&masterBranchCommitHash=${compareWith}&buildCommitHash=${devBranch}`;
  let myURL = url.parse(domain);
  let { protocol: host, host: port } = myURL;
  host = host.replace(':', '');
  port = parseInt(port);

  let options = {
    host,
    port,
    path,
    method: 'GET'
  };
  return new Promise((resolve, reject) => {
    let request = apiCall(options, callValue => {
      let Response = JSON.parse(callValue);
      if (Object.keys(Response).length > 0) {
        if (Object.prototype.hasOwnProperty.call(Response, 'STATUS')) {
          if (Response.STATUS) {
            let listOfFiles = [];
            if (Object.keys(Response.DIFF_FILES).length > 0) {
              if (
                Object.prototype.hasOwnProperty.call(
                  Response.DIFF_FILES,
                  'ADDED'
                )
              ) {
                if (Response.DIFF_FILES.ADDED.length > 0) {
                  listOfFiles = listOfFiles.concat(
                    listMaker(Response.DIFF_FILES.ADDED)
                  );
                }
              }
              if (
                Object.prototype.hasOwnProperty.call(
                  Response.DIFF_FILES,
                  'UPDATED'
                )
              ) {
                if (Response.DIFF_FILES.UPDATED.length > 0) {
                  listOfFiles = listOfFiles.concat(
                    listMaker(Response.DIFF_FILES.UPDATED)
                  );
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
    request.on('error', error => {
      resolve({ STATUS: false, LIST: [], REASON: 'Service Down' });
    });
    request.end();
  });
}

function apiCall(optionObject, callBack) {
  return http.request(optionObject, res => {
    let resText = '';
    res.setEncoding('utf8');
    res.on('data', data => {
      resText = resText + data;
    });
    res.on('end', () => {
      callBack(resText);
    });
  });
}

function listMaker(listOfObject) {
  let fileNameList = [];
  let curListName = process.cwd().split(Path.sep);

  listOfObject.forEach(fileObj => {
    let fileName = fileObj.FILEPATH;
    fileName = fileName.replace(
      curListName[curListName.length - 2] +
        Path.sep +
        curListName[curListName.length - 1] +
        Path.sep,
      ''
    );
    fileName = fileName.replace('jsapps/components/', '');
    if (
      fileName.includes('.js') &&
      !fileName.includes('.json') &&
      !fileName.includes('.docs.js')
    ) {
      fileNameList.push(fileName);
    }
  });
  return fileNameList;
}

module.exports = coverage;
