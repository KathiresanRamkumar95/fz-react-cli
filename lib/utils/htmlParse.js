'use strict';

var fs = require('fs');
function attrString(attrs) {
  var buff = [];
  for (var key in attrs) {
    buff.push(key + '="' + attrs[key] + '"');
  }
  if (!buff.length) {
    return '';
  }
  return ' ' + buff.join(' ');
}
function stringify(doc, customComponent) {
  function lstringify(buff, doc) {
    switch (doc.type) {
      case 'text':
        return buff + doc.content;
      case 'tag':
        buff += '<' + doc.name + (doc.attrs ? attrString(doc.attrs) : '') + (doc.voidElement ? '/>' : '>');
        if (doc.voidElement) {
          return buff;
        }
        return buff + doc.children.reduce(lstringify, '') + '</' + doc.name + '>';
      case 'component':
        return buff + stringify(customComponent[doc.name].ast, customComponent);
    }
  }
  return doc.reduce(function (token, rootEl) {
    return token + lstringify('', rootEl);
  }, '');
}

exports.stringify = stringify;
var tagRE = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
var attrRE = /([\w-]+)|['"]{1}([^'"]*)['"]{1}/g;

var lookup = Object.create ? Object.create(null) : {};
lookup.area = true;
lookup.base = true;
lookup.br = true;
lookup.col = true;
lookup.embed = true;
lookup.hr = true;
lookup.img = true;
lookup.input = true;
lookup.keygen = true;
lookup.link = true;
lookup.menuitem = true;
lookup.meta = true;
lookup.param = true;
lookup.source = true;
lookup.track = true;
lookup.wbr = true;

var parseTag = function parseTag(tag) {
  var i = 0;
  var key;
  var res = {
    type: 'tag',
    name: '',
    voidElement: false,
    attrs: {},
    children: []
  };

  tag.replace(attrRE, function (match) {
    if (i % 2) {
      key = match;
    } else {
      if (i === 0) {
        if (lookup[match] || tag.charAt(tag.length - 2) === '/') {
          res.voidElement = true;
        }
        res.name = match;
      } else {
        res.attrs[key] = match.replace(/['"]/g, '');
      }
    }
    i++;
  });

  return res;
};

// re-used obj for quick lookups of components
var empty = Object.create ? Object.create(null) : {};

exports.parse = function parse(html, options) {
  options || (options = {});
  var customComponent = options.customComponent || {};
  var result = [];
  var current;
  var level = -1;
  var arr = [];
  var byTag = {};
  var inComponent = false;

  html.replace(tagRE, function (tag, index) {
    if (inComponent) {
      if (tag !== '</' + current.name + '>') {
        return;
      } else {
        inComponent = false;
      }
    }
    var isOpen = tag.charAt(1) !== '/';
    var start = index + tag.length;
    var nextChar = html.charAt(start);
    var parent;

    if (isOpen) {
      level++;

      current = parseTag(tag);
      if (current.type === 'tag' && current.name.charCodeAt(0) > 64 && current.name.charCodeAt(0) < 91) {
        current.type = 'component';

        inComponent = true;
      }

      if (!current.voidElement && !inComponent && nextChar && nextChar !== '<') {
        current.children.push({
          type: 'text',
          content: html.slice(start, html.indexOf('<', start))
        });
      }

      byTag[current.tagName] = current;

      // if we're at root, push new base node
      if (level === 0) {
        result.push(current);
      }

      parent = arr[level - 1];

      if (parent) {
        parent.children.push(current);
      }
      if (current.type == 'component') {
        if (!customComponent[current.name]) {
          var a = current.name.split('_');
          var path = '/components';
          var cssPath = '/components';
          if (a.length > 1) {
            path = path + '/' + a[1] + '/' + current.name + '.html';
            cssPath = cssPath + '/' + a[1] + '/' + a[1] + '.css';
          } else {
            path = path + '/' + current.name + '/' + current.name + '.html';
            cssPath = cssPath + '/' + current.name + '/' + current.name + '.css';
          }
          customComponent[current.name] = {};
          customComponent[current.name].ast = parse(fs.readFileSync(options.appPath + path, 'utf8').replace(/\n/g, '').trim().toString(), options);
          customComponent[current.name].style = '<style>' + fs.readFileSync(options.appPath + cssPath, 'utf8') + '</style>';
        }
      }
      arr[level] = current;
    }

    if (!isOpen || current.voidElement) {
      level--;
      if (!inComponent && nextChar !== '<' && nextChar) {
        // trailing text node
        arr[level].children.push({
          type: 'text',
          content: html.slice(start, html.indexOf('<', start))
        });
      }
    }
  });

  return result;
};