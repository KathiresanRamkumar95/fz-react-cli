'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsdom = require('jsdom');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _xhr = require('xhr2');

var _xhr2 = _interopRequireDefault(_xhr);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //$Id$//


var mockDomain = 'htt' + 'p://zoho.com';
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
		(0, _utils.log)(mockDomain);
		if (arguments[1].indexOf('http') != 0) {
			arguments[1] = mockDomain + arguments[1];
		}
		return originalOpen.apply(this, arguments);
	};
	return xmlReqCopy;
};

_reactAddonsTestUtils2.default.scryRenderedComponentsWithTestid = function (dom, name) {
	var componentList = _reactAddonsTestUtils2.default.findAllInRenderedTree(dom, function (i) {
		if (_reactAddonsTestUtils2.default.isDOMComponent(i)) {
			var val = i.getAttribute('data-testid');
			if (typeof val != 'undefined' && val == name) {
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
	var router = {
		router: {
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
	// let store = {
	// 	store:{
	// 		getState:function(){return state;}
	// 	}
	// }
	var HOComponent = higherComponent(Component, router);
	var renderedDOM = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(HOComponent, props), router);
	return {
		props: props,
		renderedDOM: renderedDOM
	};
};

function higherComponent(ActualComponent, context) {
	if (context) {
		var HigherComponent = function (_React$Component) {
			_inherits(HigherComponent, _React$Component);

			function HigherComponent() {
				_classCallCheck(this, HigherComponent);

				return _possibleConstructorReturn(this, (HigherComponent.__proto__ || Object.getPrototypeOf(HigherComponent)).apply(this, arguments));
			}

			_createClass(HigherComponent, [{
				key: 'getChildContext',
				value: function getChildContext() {
					return context;
				}
			}, {
				key: 'render',
				value: function render() {
					return _react2.default.createElement(ActualComponent, this.props);
				}
			}]);

			return HigherComponent;
		}(_react2.default.Component);

		HigherComponent.childContextTypes = {
			router: _propTypes2.default.any,
			store: _propTypes2.default.any
		};

		return HigherComponent;
	} else {
		return ActualComponent;
	}
}

global.renderHTML = function (comp) {
	// eslint-disable-next-line react/no-find-dom-node
	var a = _reactDom2.default.findDOMNode(comp);
	(0, _utils.log)(a.innerHTML);
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