//$Id$//
import { jsdom } from 'jsdom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import XMLHttpRequest from 'xhr2';
import nock from 'nock';

var mockDomain = 'htt' + 'p://zoho.com';
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.localStorage = global.sessionStorage = {
  getItem: function(key) {
    return this[key];
  },
  setItem: function(key, value) {
    if (value.length > 100) {
      throw new Error('Data size is too exceeded');
    }
    this[key] = value;
  },
  removeItem: function(key) {
    delete this[key];
  },
  clear: function() {
    var keys = ['getItem', 'setItem', 'removeItem', 'clear'];
    for (let key in this) {
      if (keys.indexOf(key) === -1) {
        delete this[key];
      }
    }
  }
};
global.ZE_Init = {};
global.String.prototype.contains = function(text) {
  return this.indexOf(text) != -1;
};
global.TestUtils = TestUtils;
var xmlReq = XMLHttpRequest;
window.XMLHttpRequest = function() {
  var xmlReqCopy = new xmlReq();
  var originalOpen = xmlReqCopy.open;
  xmlReqCopy.open = function() {
    console.log(mockDomain);
    if (arguments[1].indexOf('http') != 0) {
      arguments[1] = mockDomain + arguments[1];
    }
    return originalOpen.apply(this, arguments);
  };
  return xmlReqCopy;
};

TestUtils.scryRenderedComponentsWithTestid = function(dom, name) {
  let componentList = TestUtils.findAllInRenderedTree(dom, function(i, j) {
    if (TestUtils.isDOMComponent(i)) {
      var val = i.getAttribute('data-id');
      if (typeof val != 'undefined' && val == name) {
        return true;
      }
      return false;
    }
  });
  return componentList;
};

TestUtils.findRenderedComponentsWithTestid = function(dom, name) {
  let list = TestUtils.scryRenderedComponentsWithTestid(dom, name);
  if (list.length !== 1) {
    throw new Error(
      'Did not find exactly one match (found: ' +
        list.length +
        ') ' +
        'for data-id:' +
        name
    );
  }
  return list[0];
};

global.setup = function(Component, props, state) {
  var router = {
    router: {
      push: function() {},
      createHref: function(ob) {
        return ob.pathname;
      },
      isActive: function() {
        return true;
      },
      replace: function() {},
      go: function() {},
      goBack: function() {},
      goForward: function() {},
      setRouteLeaveHook: function() {},
      getState: function() {}
    },
    store: {
      getState: function() {
        return state;
      }
    }
  };
  // var store = {
  // 	store:{
  // 		getState:function(){return state;}
  // 	}
  // }
  var Component = higherComponent(Component, router);
  const renderedDOM = TestUtils.renderIntoDocument(
    <Component {...props} />,
    router
  );
  return {
    props,
    renderedDOM
  };
};

function higherComponent(ActualComponent, context) {
  if (context) {
    var HigherComponent = React.createClass({
      getChildContext: function() {
        return context;
      },
      render: function() {
        return <ActualComponent {...this.props} />;
      },
      childContextTypes: {
        router: React.PropTypes.any,
        store: React.PropTypes.any
      }
    });
    return HigherComponent;
  } else {
    return ActualComponent;
  }
}
global.window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };
global.renderHTML = function(comp) {
  let a = ReactDOM.findDOMNode(comp);
  console.log(a.innerHTML);
};

global.TestUtils = TestUtils;
global.XMLHttpRequest = window.XMLHttpRequest;
global.getI18NValue = function(inp) {
  return inp;
};

var hook = require('css-modules-require-hook');

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]'
});
