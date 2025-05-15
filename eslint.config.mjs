// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import react from 'eslint-plugin-react'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [{
  ignores: [
    '**/node_modules/',
    '**/dist/',
    '**/.prettierrc',
    '**/*env*',
    '**/vite.config.ts',
    '**/generated/',
    '**/coverage/',
  ],
}, ...compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:react/all',
  'google',
), {
  plugins: {
    react,
  },

  languageOptions: {
    parser: tsParser,
    ecmaVersion: 5,
    sourceType: 'module',
    parserOptions: {
      project: './tsconfig.json',
    },
  },

  settings: {
    react: {
      version: 'detect',
    },

    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  rules: {
    semi: ['error', 'never'],

    'max-len': ['error', {
      code: 120,
      ignorePattern: '^import .*',
    }],

    'space-infix-ops': 'error',
    eqeqeq: ['error', 'always'],
    'object-curly-spacing': ['warn', 'always'],
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',
    'no-unused-vars': 'off',
    'react/jsx-no-comment-textnodes': 'off',
    'react/prop-types': 'off',

    'react/jsx-indent': [2, 2, {
      checkAttributes: true,
      indentLogicalExpressions: true,
    }],

    'react/jsx-max-depth': [2, {
      max: 7,
    }],

    'react/jsx-indent-props': [2, 2],
    'react/require-default-props': 'off',

    'react/jsx-max-props-per-line': [1, {
      when: 'multiline',
    }],

    'react/jsx-filename-extension': ['error', {
      extensions: ['.tsx'],
    }],

    indent: ['error', 2, {
      SwitchCase: 1,
      offsetTernaryExpressions: false,
    }],

    'quote-props': 'off',
    'react/destructuring-assignment': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/forbid-component-props': 'off',
    'react/jsx-no-literals': 'off',

    'react/function-component-definition': [2, {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],

    'react/no-multi-comp': [2, {
      ignoreStateless: true,
    }],

    'react/jsx-no-bind': 'off',
    'react/no-set-state': 'off',
    'react/jsx-no-leaked-render': 'off',
    'react/jsx-newline': 'off',
    'arrow-parens': 'off',
    'operator-linebreak': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    'react/no-unstable-nested-components': 'off',

    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],

    'comma-spacing': 'off',
  },
}]
