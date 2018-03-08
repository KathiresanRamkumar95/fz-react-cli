import PropTypes from 'prop-types';

PropTypes.array.hookType = 'array';
PropTypes.bool.hookType = 'bool';
PropTypes.func.hookType = 'func';
PropTypes.number.hookType = 'number';
PropTypes.object.hookType = 'object';
PropTypes.string.hookType = 'string';
PropTypes.symbol.hookType = 'symbol';
PropTypes.oneOf.hookType = 'oneOf';
PropTypes.array.isRequired.hookType = 'array';
PropTypes.bool.isRequired.hookType = 'bool';
PropTypes.func.isRequired.hookType = 'func';
PropTypes.number.isRequired.hookType = 'number';
PropTypes.object.isRequired.hookType = 'object';
PropTypes.string.isRequired.hookType = 'string';
PropTypes.symbol.isRequired.hookType = 'symbol';

module.exports = PropTypes;
