'use strict';

var _jsdom = require('jsdom');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _xhr = require('xhr2');

var _xhr2 = _interopRequireDefault(_xhr);

var _nock = require('nock');

var _nock2 = _interopRequireDefault(_nock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//$Id$//
var mockDomain = "http://zoho.com";
global.document = (0, _jsdom.jsdom)('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.localStorage = global.sessionStorage = {
	getItem: function getItem(key) {
		return this[key];
	},
	setItem: function setItem(key, value) {
		if (value.length > 100) {
			throw new Error('Data size is too exceeded');
		}
		this[key] = value;
	},
	removeItem: function removeItem(key) {
		delete this[key];
	},
	clear: function clear() {
		var keys = ['getItem', 'setItem', 'removeItem', 'clear'];
		for (var key in this) {
			if (keys.indexOf(key) === -1) {
				delete this[key];
			}
		}
	}
};
global.ZE_Init = {};
global.String.prototype.contains = function (text) {
	return this.indexOf(text) != -1;
};
global.TestUtils = _reactAddonsTestUtils2.default;
var xmlReq = _xhr2.default;
window.XMLHttpRequest = function () {
	var xmlReqCopy = new xmlReq();
	var originalOpen = xmlReqCopy.open;
	xmlReqCopy.open = function () {
		if (arguments[1].indexOf("http") != 0) {
			arguments[1] = mockDomain + arguments[1];
		}
		return originalOpen.apply(this, arguments);
	};
	return xmlReqCopy;
};

_reactAddonsTestUtils2.default.scryRenderedComponentsWithTestid = function (dom, name) {
	var componentList = _reactAddonsTestUtils2.default.findAllInRenderedTree(dom, function (i, j) {
		if (_reactAddonsTestUtils2.default.isDOMComponent(i)) {
			var val = i.getAttribute("data-testid");
			if (typeof val != "undefined" && val == name) {
				return true;
			}
			return false;
		}
	});
	return componentList;
};

_reactAddonsTestUtils2.default.findRenderedComponentsWithTestid = function (dom, name) {
	var list = _reactAddonsTestUtils2.default.scryRenderedComponentsWithTestid(dom, name);
	if (list.length !== 1) {
		throw new Error('Did not find exactly one match (found: ' + list.length + ') ' + 'for data-testid:' + name);
	}
	return list[0];
};

global.setup = function (Component, props, state) {
	var router = { router: {
			push: function push() {},
			createHref: function createHref(ob) {
				return ob.pathname;
			},
			isActive: function isActive() {
				return true;
			},
			replace: function replace() {},
			go: function go() {},
			goBack: function goBack() {},
			goForward: function goForward() {},
			setRouteLeaveHook: function setRouteLeaveHook() {},
			getState: function getState() {}
		},
		store: {
			getState: function getState() {
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
	var renderedDOM = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(Component, props), router);
	return {
		props: props,
		renderedDOM: renderedDOM
	};
};

function higherComponent(ActualComponent, context) {
	if (context) {
		var HigherComponent = _react2.default.createClass({
			displayName: 'HigherComponent',

			getChildContext: function getChildContext() {
				return context;
			},
			render: function render() {
				return _react2.default.createElement(ActualComponent, this.props);
			},
			childContextTypes: {
				router: _react2.default.PropTypes.any,
				store: _react2.default.PropTypes.any
			}
		});
		return HigherComponent;
	} else {
		return ActualComponent;
	}
}

global.renderHTML = function (comp) {
	var a = _reactDom2.default.findDOMNode(comp);
	console.log(a.innerHTML);
};

global.TestUtils = _reactAddonsTestUtils2.default;
global.XMLHttpRequest = window.XMLHttpRequest;
global.getI18NValue = function (inp) {
	return inp;
};

var hook = require('css-modules-require-hook');

hook({
	generateScopedName: '[name]__[local]___[hash:base64:5]'
});