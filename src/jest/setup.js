//$Id$//
import { jsdom } from 'jsdom';
import TestUtils from 'react-addons-test-utils';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import XMLHttpRequest from 'xhr2';
import { log } from '../utils';
//eslint-disable-next-line
import nock from 'nock';

let mockDomain = 'htt' + 'p://zoho.com';
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;

global.localStorage = global.sessionStorage = {
  getItem: function (key) {
    return this[key];
  },
  setItem: function (key, value) {
    if (value.length > 100) {
      throw new Error('Data size is too exceeded');
    }
    this[key] = value;
  },
  removeItem: function (key) {
    delete this[key];
  },
  clear: function () {
    let keys = ['getItem', 'setItem', 'removeItem', 'clear'];
    for (let key in this) {
      if (keys.indexOf(key) === -1) {
        delete this[key];
      }
    }
  }
};

// eslint-disable-next-line camelcase
global.ZE_Init = {};
global.String.prototype.contains = function (text) {
  return this.indexOf(text) !== -1;
};
global.TestUtils = TestUtils;
let xmlReq = XMLHttpRequest;
window.XMLHttpRequest = function (...args) {
  let xmlReqCopy = new xmlReq();
  let originalOpen = xmlReqCopy.open;
  xmlReqCopy.open = function () {
    log(mockDomain);
    if (args[1].indexOf('http') !== 0) {
      args[1] = mockDomain + args[1];
    }
    return originalOpen.apply(this, args);
  };
  return xmlReqCopy;
};

TestUtils.scryRenderedComponentsWithTestid = function (dom, name) {
  let componentList = TestUtils.findAllInRenderedTree(dom, i => {
    if (TestUtils.isDOMComponent(i)) {
      let val = i.getAttribute('data-testid');
      if (typeof val !== 'undefined' && val === name) {
        return true;
      }
      return false;
    }
  });
  return componentList;
};

TestUtils.findRenderedComponentsWithTestid = function (dom, name) {
  let list = TestUtils.scryRenderedComponentsWithTestid(dom, name);
  if (list.length !== 1) {
    throw new Error(
      `Did not find exactly one match (found: ${list.length}) ` +
        `for data-testid:${name}`
    );
  }
  return list[0];
};

global.setup = function (Component, props, state) {
  let router = {
    router: {
      push: function () {
        return true;
      },
      createHref: function (ob) {
        return ob.pathname;
      },
      isActive: function () {
        return true;
      },
      replace: function () {
        return true;
      },
      go: function () {
        return true;
      },
      goBack: function () {
        return true;
      },
      goForward: function () {
        return true;
      },
      setRouteLeaveHook: function () {
        return true;
      },
      getState: function () {
        return true;
      }
    },
    store: {
      getState: function () {
        return state;
      }
    }
  };
  // let store = {
  // 	store:{
  // 		getState:function(){return state;}
  // 	}
  // }
  let HOComponent = higherComponent(Component, router);
  let comp = <HOComponent {...props} />;
  const renderedDOM = TestUtils.renderIntoDocument(comp, router);
  return {
    props,
    renderedDOM
  };
};

function higherComponent (ActualComponent, context) {
  if (context) {
    class HigherComponent extends React.Component {
      shouldComponentUpdate () {
        return true;
      }

      getChildContext () {
        return context;
      }

      render () {
        return <ActualComponent {...this.props} />;
      }
    }

    HigherComponent.childContextTypes = {
      router: PropTypes.any,
      store: PropTypes.any
    };

    return HigherComponent;
  }
  return ActualComponent;
}

global.renderHTML = function (comp) {
  // eslint-disable-next-line react/no-find-dom-node
  let a = ReactDOM.findDOMNode(comp);
  log(a.innerHTML);
};

global.TestUtils = TestUtils;
global.XMLHttpRequest = window.XMLHttpRequest;
global.getI18NValue = function (inp) {
  return inp;
};

let hook = require('css-modules-require-hook');

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]'
});
