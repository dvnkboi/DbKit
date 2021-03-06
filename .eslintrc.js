module.exports = {
    // 'parser': '@typescript-eslint/parser',
    // "parser": "vue-eslint-parser",

    extends: [
        'plugin:vue/vue3-recommended',
        '@vue/typescript/recommended'
    ],
    plugins: [
        '@typescript-eslint',
    ],
    'env': {
        'node': true,
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        'no-var': 'error',
        'vue/no-unused-vars': 'warn',
        '@typescript-eslint/consistent-type-definitions': [
            'error',
            'interface'
        ],
        '@typescript-eslint/no-unused-vars': 'warn',
        'no-extend-native': 0,
        'no-new': 0,
        'no-useless-escape': 0,
        'no-useless-constructor': 0,
        'no-trailing-spaces': [ 'off', { 'skipBlankLines': true } ],
        'indent': [ 'off', 2, {
            'SwitchCase': 1
        } ],
        'space-infix-ops': [ 'error', { 'int32Hint': false } ],
        'space-before-function-paren': [ 'off', {
            'anonymous': 'always',
            'named': 'always',
            'asyncArrow': 'always'
        } ],
        'semi': [ 'error', 'always' ],
        'comma-dangle': 0,
        'no-console': 0,
        'no-debugger': 0,
        'id-length': 0,
        'eol-last': 0,
        'object-curly-spacing': [ 'warn', 'always' ],
        'array-bracket-spacing': [ 'off', 'always' ],
        'arrow-spacing': 'warn',
        'no-multiple-empty-lines': 'error',
        'no-unused-vars': 'warn',
        'spaced-comment': 'off',
        'quotes': [ 'warn', 'single', { 'allowTemplateLiterals': true } ],
        'no-unreachable': 'error',
        'keyword-spacing': 'off',
        'space-before-blocks': 'off',
        'semi-spacing': 'error',
        'comma-spacing': 'error',
        'key-spacing': 'error',
        'prefer-const': [ 'error', {
            'destructuring': 'any',
            'ignoreReadBeforeAssign': false
        } ],
        'space-infix-ops': 2,
        'no-irregular-whitespace': 2,
        'no-trailing-spaces': 0,
        'vue/require-default-prop': 'off',
    }
};
