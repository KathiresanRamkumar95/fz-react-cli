const fs = require('fs');
const path = require('path');

let keys = [
  'i18NProviderUtils.getI18NValue',
  'getI18NValue',
  '<FormatText',
  '<PluralFormat',
  '//I18N'
];

var i18nLogs = {};
var fileObj = {};
var initialized = false;
var fileList = [];
var filename;
let context = process.env.npm_config_server_context || 'app';
let appPath = fs.realpathSync(process.cwd());
let cachePath = path.join(appPath, 'node_modules', '.cache');
if (!fs.existsSync(cachePath)){
    fs.mkdir(cachePath);
}

let jsonPath = path.join(cachePath, 'i18nkeys.json');
let dynamicI18nsPath = path.join(appPath, context, 'properties', 'i18nkeys.json');

function isTernary(str) {
  let operator;
  if (str.indexOf('?') !== -1) {
    operator = '?';
  } else if (str.indexOf('&') !== -1) {
    operator = '&';
  }
  return operator;
}

function getTernary(str) {
  let operatorIndex;
  let operator = isTernary(str);
  str = str.split(operator);
  str.splice(0, 1);
  let substr = str[0].trim();
  str = str.join(operator);
  let output = [];
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
    getTernary(str).forEach(i18n => {
      output.push(i18n);
    });
  }
  return output;
}

function getI18NValue(line, subIndex) {
  let words = line.split('getI18NValue');
  let keys = [];
  words.splice(0, 1);
  words.forEach((word, wordIndex) => {
    let params = getInnerValue(word, '(', ')', null, 'getI18NValue');
    if (params) {
      let lastWord = words[wordIndex - 1];
      let index = lastWord
        ? lastWord.trim().endsWith('i18NProviderUtils.') ? 0 : 1
        : subIndex;
      let param = params.split(',')[index];
      if (!param) {
        // console.log(params, word, filename);
      }
      if (param) {
        if (isTernary(param)) {
          param = getTernary(param);
        } else {
          param = [param];
        }
        param.forEach(i18n => {
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
  let keys = [];
  line.forEach(sentance => {
    let props = getInnerValue(
      sentance,
      '"',
      '"',
      {
        start: "'",
        end: "'"
      },
      'Component'
    );
    if (props) {
      props = props.trim();
    }
    keys.push(props);
  });
  return keys;
}

function getKey(line, index) {
  index = index ? index : 0;
  let regex = new RegExp(keys[index], 'i');
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
    let startIndex = sentance.indexOf(start) + 1;
    let endIndex = sentance.indexOf(end);
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
  let words = line.split(key);
  let keys = [];
  words.splice(0, 1);
  words.forEach(word => {
    if (isTernary(word)) {
      word = getTernary(word);
    } else {
      word = [word];
    }
    word.forEach(sentance => {
      let props = getInnerValue(
        sentance,
        '"',
        '"',
        {
          start: "'",
          end: "'"
        },
        'Component'
      );
      if (props) {
        props = props.trim();
      }
      keys.push(props);
    });
  });
  return keys;
}

function getPluralFormat(line) {
  let one = getComponent(line, 'one');
  let many = getComponent(line, 'many');
  let zero = getComponent(line, 'zero');
  let all = one.concat(many);
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
  let tempObj = {};
  for (filename in i18nLogs) {
    Object.keys(i18nLogs[filename]).forEach(key => {
      tempObj[key] = key;
    });
  }
  let obj = {};
  let dynamicI18ns = {}
  if (fs.existsSync(jsonPath)) {
    obj = require(jsonPath);
    dynamicI18ns = require(dynamicI18nsPath);
  }
  fs.writeFileSync(jsonPath, JSON.stringify(Object.assign(dynamicI18ns, obj, tempObj)));
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
  let lines = source.split('\n');
  let tag = '';
  let isFormatText = false;
  let isPluralFormat = false;
  filename = this.resourcePath;
  lines.forEach(line => {
    let key = getKey(line);
    if (key === 'i18NProviderUtils.getI18NValue') {
      let i18ns = getI18NValue(line, 0);
      i18ns.forEach(i18n => {
        addI18N(i18n, filename);
      });
    } else if (key === 'getI18NValue') {
      let i18ns = getI18NValue(line, 1);
      i18ns.forEach(i18n => {
        addI18N(i18n, filename);
      });
    } else if (key === '<FormatText' || isFormatText) {
      tag += line;
      if (!isFormatText) {
        isFormatText = true;
      }
      let cleanTag = tag.replace(/\s+/, '');
      if (
        cleanTag.indexOf('/>') !== -1 ||
        cleanTag.indexOf('</FormatText>') !== -1
      ) {
        let i18ns = getComponent(tag, 'i18NKey');
        i18ns.forEach(i18n => {
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
      let cleanTag = tag.replace(/\s+/, '');
      if (
        cleanTag.indexOf('/>') !== -1 ||
        cleanTag.indexOf('</PluralFormat>') !== -1
      ) {
        let i18ns = getPluralFormat(tag);
        i18ns.forEach(i18n => {
          addI18N(i18n, filename);
        });
        tag = '';
        isPluralFormat = false;
      }
    } else if (key === '//I18N') {
      let i18ns = getI18N(line);
      i18ns.forEach(i18n => {
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
    }
  }
  return source;
}

module.exports = i18NLoader;
