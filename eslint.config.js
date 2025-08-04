import js from '@eslint/js'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-n'
import reactPlugin from 'eslint-plugin-react'

export default [
  {
    ignores: ['node_modules', 'dist', 'client/dist', 'client/build', 'server/dist', 'server/build'],
  },

  js.configs.recommended,

  // client: React + TypeScript
  {
    files: ['client/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './client/tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        React: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      react: reactPlugin,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './client/tsconfig.json',
        },
      },
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'import/no-unresolved': 'error',
      'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
    },
  },

  // server: Node + TypeScript
  {
    files: ['server/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './server/tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        setTimeout: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': tseslintPlugin, n: nodePlugin, import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: {
          project: './server/tsconfig.json',
        },
      },
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules,
      ...nodePlugin.configs['recommended-module'].rules,
      '@typescript-eslint/no-unused-vars': ['warn'],
      'import/no-unresolved': 'error',
      'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
      'n/no-missing-import': 'off',
    },
  },

  // server: Tests
  {
    files: ['server/tests/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './server/tsconfig.json',
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': tseslintPlugin, n: nodePlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      'n/no-unpublished-import': ['error', { allowModules: ['supertest'] }],
    },
  },

  // server: CommonJS config files (e.g., jest.config.js)
  {
    files: ['server/**/*.config.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
      },
    },
  },

  prettier,
]
