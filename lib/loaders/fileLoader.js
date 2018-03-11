'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (content) {
	this.cacheable && this.cacheable();
	if (!this.emitFile) throw new Error('emitFile is required from module system');

	var options = _loaderUtils2.default.getOptions(this) || {};
	var query = this.resourceQuery ? _loaderUtils2.default.parseQuery(this.resourceQuery) : {};

	// let configKey = query.config || 'fileLoader';

	var config = {
		publicPath: false,
		useRelativePath: false,
		name: '[hash].[ext]',
		publicPathStrigify: true
	};

	// options takes precedence over config
	Object.keys(options).forEach(function (attr) {
		config[attr] = options[attr];
	});

	// query takes precedence over config and options
	Object.keys(query).forEach(function (attr) {
		config[attr] = query[attr];
	});

	var context = config.context || options.context;
	var url = _loaderUtils2.default.interpolateName(this, config.name, {
		context: context,
		content: content,
		regExp: config.regExp
	});

	var outputPath = '';

	var filePath = this.resourcePath;
	if (config.useRelativePath) {
		var issuerContext = this._module && this._module.issuer && this._module.issuer.context || context;
		var relativeUrl = issuerContext && _path2.default.relative(issuerContext, filePath).split(_path2.default.sep).join('/');
		var relativePath = relativeUrl && _path2.default.dirname(relativeUrl) + '/';
		if (~relativePath.indexOf('../')) {
			outputPath = _path2.default.posix.join(outputPath, relativePath, url);
		} else {
			outputPath = relativePath + url;
		}
		url = relativePath + url;
	} else if (config.outputPath) {
		// support functions as outputPath to generate them dynamically
		outputPath = typeof config.outputPath === 'function' ? config.outputPath(url) : config.outputPath + url;
		url = outputPath;
	} else {
		outputPath = url;
	}

	var publicPath = '__webpack_public_path__ + ' + JSON.stringify(url);
	if (config.publicPath !== false) {
		// support functions as publicPath to generate them dynamically
		if (config.publicPathStringify) {
			publicPath = JSON.Stringify(typeof config.publicPath === 'function' ? config.publicPath(url) : config.publicPath + url);
		} else {
			publicPath = typeof config.publicPath === 'function' ? config.publicPath(url) : config.publicPath + url;
		}
	}

	if (query.emitFile === undefined || query.emitFile) {
		this.emitFile(outputPath, content);
	}

	return 'module.exports = ' + publicPath + ';';
};

module.exports.raw = true;