'use strict';

var React = require('react/react.js');
React.PropTypes.array.hookType = 'array';
React.PropTypes.bool.hookType = 'bool';
React.PropTypes.func.hookType = 'func';
React.PropTypes.number.hookType = 'number';
React.PropTypes.object.hookType = 'object';
React.PropTypes.string.hookType = 'string';
React.PropTypes.symbol.hookType = 'symbol';
React.PropTypes.array.isRequired.hookType = 'array';
React.PropTypes.bool.isRequired.hookType = 'bool';
React.PropTypes.func.isRequired.hookType = 'func';
React.PropTypes.number.isRequired.hookType = 'number';
React.PropTypes.object.isRequired.hookType = 'object';
React.PropTypes.string.isRequired.hookType = 'string';
React.PropTypes.symbol.isRequired.hookType = 'symbol';
module.exports = React;