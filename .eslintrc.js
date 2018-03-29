let logLevel = process.isDevelopment ? 'warn' : 'error';

module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true
		},
		sourceType: 'module'
	},
	plugins: ['react'],
	rules: {
		'for-direction': [logLevel],
		'no-extra-parens': [logLevel],
		'no-prototype-builtins': [logLevel],
		'no-template-curly-in-string': [logLevel],
		'array-callback-return': [logLevel],
		curly: [logLevel],
		'default-case': [logLevel],
		'dot-notation': [logLevel],
		eqeqeq: [logLevel],
		'guard-for-in': [logLevel],
		'no-alert': [logLevel],
		'no-caller': [logLevel],
		'no-div-regex': [logLevel],
		'no-else-return': [logLevel],
		'no-empty-function': [logLevel],
		'no-eq-null': [logLevel],
		'no-eval': [logLevel],
		'no-extra-bind': [logLevel],
		'no-floating-decimal': [logLevel],
		'no-iterator': [logLevel],
		'no-multi-str': [logLevel],
		'block-spacing': [logLevel],
		'brace-style': [logLevel],
		camelcase: [logLevel],
		'comma-dangle': [logLevel],
		'comma-spacing': [logLevel],
		'func-call-spacing': [logLevel],
		indent: [logLevel, 'tab'],
		'jsx-quotes': [logLevel, 'prefer-single'],
		'key-spacing': [logLevel],
		'keyword-spacing': [logLevel],
		'lines-between-class-members': [logLevel],
		'object-curly-spacing': [logLevel, 'always'],
		'space-before-blocks': [logLevel],
		'space-before-function-paren': [logLevel],
		'switch-colon-spacing': [logLevel],
		'arrow-spacing': [logLevel],
		'space-in-parens': [logLevel],
		quotes: [logLevel, 'single'],
		semi: [logLevel],
		'constructor-super': [logLevel],
		'no-duplicate-imports': [
			logLevel,
			{
				includeExports: true
			}
		],
		'no-var': [logLevel],
		'prefer-destructuring': [logLevel],
		'prefer-arrow-callback': [logLevel],
		'prefer-spread': [logLevel],

		'react/no-did-update-set-state': [logLevel],
		'react/no-unused-state': [logLevel],
		'react/no-will-update-set-state': [logLevel],
		'react/require-default-props': [logLevel],
		'react/require-optimization': [logLevel]
	}
};
