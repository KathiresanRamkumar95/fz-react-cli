'use strict';

var fs = require('fs');
var path = require('path');

var keys = ['i18NProviderUtils.getI18NValue', 'getI18NValue', '<FormatText', '<PluralFormat', '//I18N'];

var i18nLogs = {};
var fileObj = {};
var initialized = false;
var fileList = [];
var filename;
var context = process.env.npm_config_server_context || 'app';
var appPath = fs.realpathSync(process.cwd());

function isTernary(str) {
  var operator = void 0;
  if (str.indexOf('?') !== -1) {
    operator = '?';
  } else if (str.indexOf('&') !== -1) {
    operator = '&';
  }
  return operator;
}

function getTernary(str) {
  var operatorIndex = void 0;
  var operator = isTernary(str);
  str = str.split(operator);
  str.splice(0, 1);
  var substr = str[0].trim();
  str = str.join(operator);
  var output = [];
  if (operator === '&') {
    output.push(substr);
  } else if (operator === '?') {
    substr = substr.split(':');
    output.push(substr[0]);
    output.push(substr[1]);
    str = str.split(':');
    str.splice(0, 1);
    str = str.join(':');
  }
  if (isTernary(str)) {
    getTernary(str).forEach(function (i18n) {
      output.push(i18n);
    });
  }
  return output;
}

function getI18NValue(line, subIndex) {
  var words = line.split('getI18NValue');
  var keys = [];
  words.splice(0, 1);
  words.forEach(function (word, wordIndex) {
    var params = getInnerValue(word, '(', ')', null, 'getI18NValue');
    if (params) {
      var lastWord = words[wordIndex - 1];
      var index = lastWord ? lastWord.trim().endsWith('i18NProviderUtils.') ? 0 : 1 : subIndex;
      var param = params.split(',')[index];
      if (!param) {
        // console.log(params, word, filename);
      }
      if (param) {
        if (isTernary(param)) {
          param = getTernary(param);
        } else {
          param = [param];
        }
        param.forEach(function (i18n) {
          i18n = i18n.trim();
          if (i18n.indexOf('"') === -1 && i18n.indexOf("'") === -1) {
            keys.push(false);
          } else {
            i18n = i18n.replace(/"/g, '');
            i18n = i18n.replace(/'/g, '');
            keys.push(i18n);
          }
        });
      }
    }
  });
  return keys;
}

function getI18N(line) {
  if (isTernary(line)) {
    line = getTernary(line);
  } else {
    line = [line];
  }
  var keys = [];
  line.forEach(function (sentance) {
    var props = getInnerValue(sentance, '"', '"', {
      start: "'",
      end: "'"
    }, 'Component');
    if (props) {
      props = props.trim();
    }
    keys.push(props);
  });
  return keys;
}

function getKey(line, index) {
  index = index ? index : 0;
  var regex = new RegExp(keys[index], 'i');
  if (line.match(regex)) {
    return keys[index];
  } else if (index >= keys.length) {
    return false;
  } else {
    index += 1;
    return getKey(line, index);
  }
}

function getInnerValue(sentance, start, end, option, key) {
  if (sentance.indexOf(start) === -1) {
    if (option) {
      start = option.start;
      end = end.start;
    } else {
      return false;
    }
  }
  if (key === 'getI18NValue') {
    var startIndex = sentance.indexOf(start) + 1;
    var endIndex = sentance.indexOf(end);
    return sentance.substring(startIndex, endIndex);
  } else if (key === 'Component') {
    sentance = sentance.split(start)[1];
    if (sentance) {
      sentance = sentance.split(end)[0];
      return sentance;
    }
    return false;
  } else {
    return false;
  }
}

function getComponent(line, key) {
  var words = line.split(key);
  var keys = [];
  words.splice(0, 1);
  words.forEach(function (word) {
    if (isTernary(word)) {
      word = getTernary(word);
    } else {
      word = [word];
    }
    word.forEach(function (sentance) {
      var props = getInnerValue(sentance, '"', '"', {
        start: "'",
        end: "'"
      }, 'Component');
      if (props) {
        props = props.trim();
      }
      keys.push(props);
    });
  });
  return keys;
}

function getPluralFormat(line) {
  var one = getComponent(line, 'one');
  var many = getComponent(line, 'many');
  var zero = getComponent(line, 'zero');
  var all = one.concat(many);
  all = all.concat(zero);
  return all;
}

function updaeFileObj(filename) {
  i18nLogs[filename] = Object.assign({}, fileObj[filename]);
  fileObj = {};
}

function updateI18N(fname) {
  if (initialized) {
    updaeFileObj(fname);
  }
  var tempObj = {};
  for (filename in i18nLogs) {
    Object.keys(i18nLogs[filename]).forEach(function (key) {
      tempObj[key] = key;
    });
  }
  var jsonPath = path.join(appPath, context, 'properties/i18nkeys.json');
  var obj = {};
  if (fs.existsSync(jsonPath) && !initialized) {
    obj = require(jsonPath);
  }
  fs.writeFileSync(path.join(appPath, context, 'properties/i18nkeys.json'), JSON.stringify(Object.assign(obj, tempObj)));
}

function addI18N(i18n, filename) {
  if (i18n) {
    if (!i18nLogs[filename]) {
      i18nLogs[filename] = {};
    }
    if (!fileObj[filename] && initialized) {
      fileObj[filename] = {};
    }
    if (initialized) {
      fileObj[filename][i18n] = i18n;
    }
    i18nLogs[filename][i18n] = i18n;
  }
}

function i18NLoader(source) {
  if (source.indexOf('fz-i18n') === -1) {
    return source;
  }
  var lines = source.split('\n');
  var tag = '';
  var isFormatText = false;
  var isPluralFormat = false;
  filename = this.resourcePath;
  lines.forEach(function (line) {
    var key = getKey(line);
    if (key === 'i18NProviderUtils.getI18NValue') {
      var i18ns = getI18NValue(line, 0);
      i18ns.forEach(function (i18n) {
        addI18N(i18n, filename);
      });
    } else if (key === 'getI18NValue') {
      var _i18ns = getI18NValue(line, 1);
      _i18ns.forEach(function (i18n) {
        addI18N(i18n, filename);
      });
    } else if (key === '<FormatText' || isFormatText) {
      tag += line;
      if (!isFormatText) {
        isFormatText = true;
      }
      var cleanTag = tag.replace(/\s+/, '');
      if (cleanTag.indexOf('/>') !== -1 || cleanTag.indexOf('</FormatText>') !== -1) {
        var _i18ns2 = getComponent(tag, 'i18NKey');
        _i18ns2.forEach(function (i18n) {
          addI18N(i18n, filename);
        });
        tag = '';
        isFormatText = false;
      }
    } else if (key === '<PluralFormat' || isPluralFormat) {
      tag += line;
      if (!isPluralFormat) {
        isPluralFormat = true;
      }
      var _cleanTag = tag.replace(/\s+/, '');
      if (_cleanTag.indexOf('/>') !== -1 || _cleanTag.indexOf('</PluralFormat>') !== -1) {
        var _i18ns3 = getPluralFormat(tag);
        _i18ns3.forEach(function (i18n) {
          addI18N(i18n, filename);
        });
        tag = '';
        isPluralFormat = false;
      }
    } else if (key === '//I18N') {
      var _i18ns4 = getI18N(line);
      _i18ns4.forEach(function (i18n) {
        addI18N(i18n, filename);
      });
    }
  });
  updateI18N(filename);
  if (!initialized) {
    if (fileList.indexOf(filename) === -1) {
      fileList.push(filename);
    } else {
      initialized = true;
      console.log('i18NLoader');
    }
  }
  return source;
}

module.exports = i18NLoader;