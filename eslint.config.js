import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

export default [
    {
        ignores: [
            'dist',
            'coverage'
        ]
    },
    js.configs.recommended,
    {
        files: ['test/**'],
        languageOptions: {
            globals: {
                ...globals.mocha,
                expect: true
            }
        },
    },
    {
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            '@stylistic/semi': ['error'],
            '@stylistic/indent': ['error', 4, { SwitchCase: 1 }],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],

            'prefer-const': ['error'],
            'no-var': ['error'],
            'prefer-destructuring': ['error'],
            'object-shorthand': ['error'],
            'prefer-template': ['error']
        }
    }
];
