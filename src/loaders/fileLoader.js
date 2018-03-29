import path from 'path';
import loaderUtils from 'loader-utils';

module.exports = function (content) {
	this.cacheable && this.cacheable();
	if (!this.emitFile) {
		throw new Error('emitFile is required from module system'); 
	}

	let options = loaderUtils.getOptions(this) || {};
	let query = this.resourceQuery
		? loaderUtils.parseQuery(this.resourceQuery)
		: {};

	// let configKey = query.config || 'fileLoader';

	let config = {
		publicPath: false,
		useRelativePath: false,
		name: '[hash].[ext]',
		publicPathStrigify: true
	};

	// options takes precedence over config
	Object.keys(options).forEach((attr) => {
		config[attr] = options[attr];
	});

	// query takes precedence over config and options
	Object.keys(query).forEach((attr) => {
		config[attr] = query[attr];
	});

	let context = config.context || options.context;
	let url = loaderUtils.interpolateName(this, config.name, {
		context: context,
		content: content,
		regExp: config.regExp
	});

	let outputPath = '';

	let filePath = this.resourcePath;
	if (config.useRelativePath) {
		let issuerContext =
			this._module &&
				this._module.issuer &&
				this._module.issuer.context ||
			context;
		let relativeUrl =
			issuerContext &&
			path
				.relative(issuerContext, filePath)
				.split(path.sep)
				.join('/');
		let relativePath = relativeUrl && path.dirname(relativeUrl) + '/';
		if (~relativePath.indexOf('../')) {
			outputPath = path.posix.join(outputPath, relativePath, url);
		} else {
			outputPath = relativePath + url;
		}
		url = relativePath + url;
	} else if (config.outputPath) {
		// support functions as outputPath to generate them dynamically
		outputPath =
			typeof config.outputPath === 'function'
				? config.outputPath(url)
				: config.outputPath + url;
		url = outputPath;
	} else {
		outputPath = url;
	}

	let publicPath = '__webpack_public_path__ + ' + JSON.stringify(url);
	if (config.publicPath !== false) {
		// support functions as publicPath to generate them dynamically
		if (config.publicPathStringify) {
			publicPath = JSON.Stringify(
				typeof config.publicPath === 'function'
					? config.publicPath(url)
					: config.publicPath + url
			);
		} else {
			publicPath =
				typeof config.publicPath === 'function'
					? config.publicPath(url)
					: config.publicPath + url;
		}
	}

	if (query.emitFile === undefined || query.emitFile) {
		this.emitFile(outputPath, content);
	}

	return 'module.exports = ' + publicPath + ';';
};

module.exports.raw = true;
