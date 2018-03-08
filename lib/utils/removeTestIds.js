'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	return {
		visitor: {
			Program: function Program(path, state) {
				var properties = state.opts.properties || [];
				if (properties.length === 0) {
					properties.push('data-testid');
				}
				path.traverse({
					JSXIdentifier: function JSXIdentifier(path2) {
						if (properties.indexOf(path2.node.name.toLowerCase()) > -1) {
							path2.parentPath.remove();
						}
					}
				});
			}
		}
	};
};