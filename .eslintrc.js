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
		'dot-location': [logLevel, 'property'],
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
		'no-extend-native': [logLevel],
		'no-extra-bind': [logLevel],
		'no-floating-decimal': [logLevel],
		'no-iterator': [logLevel],
		'no-labels': [logLevel],
		'no-loop-func': [logLevel],
		'no-multi-str': [logLevel],
		'no-new-wrappers': [logLevel],
		'no-param-reassign': [logLevel],
		'no-proto': [logLevel],
		'no-redeclare': [
			logLevel,
			{
				builtinGlobals: true
			}
		],
		'no-return-assign': [logLevel],
		'no-script-url': [logLevel],
		'wrap-iife': [logLevel, 'outside'],
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
		'no-whitespace-before-property': [logLevel],
		'object-curly-spacing': [logLevel, 'always'],
		'space-before-blocks': [logLevel],
		'space-before-function-paren': [logLevel],
		'switch-colon-spacing': [logLevel],
		'space-in-parens': [logLevel],
		quotes: [logLevel, 'single'],
		semi: [logLevel],
		'semi-spacing': [logLevel],
		'arrow-spacing': [logLevel],
		'arrow-body-style': [logLevel],
		'arrow-parens': [logLevel, 'as-needed'],
		'no-const-assign': [logLevel],
		'no-dupe-class-members': [logLevel],
		'no-this-before-super': [logLevel],
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
		'prefer-template': [logLevel],
		'prefer-rest-params': [logLevel],

		'react/default-props-match-prop-types': [logLevel],
		'react/destructuring-assignment': [logLevel],
		'react/no-did-update-set-state': [logLevel],
		'react/no-redundant-should-component-update': [logLevel],
		'react/no-danger': [logLevel],
		'react/no-redundant-should-component-update': [logLevel],
		'react/no-this-in-sfc': [logLevel],
		'react/no-will-update-set-state': [logLevel],
		'react/no-unused-state': [logLevel],
		'react/no-will-update-set-state': [logLevel],
		'react/require-default-props': [logLevel],
		'react/require-optimization': [logLevel],

		'react/jsx-curly-brace-presence': [logLevel, 'always'],
		'react/jsx-closing-bracket-location': [logLevel],
		'react/jsx-equals-spacing': [logLevel],
		'react/jsx-indent': [logLevel, 2],
		'react/jsx-key': [logLevel],
		'react/jsx-pascal-case': [logLevel]
	}
};
