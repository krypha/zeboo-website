import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.next',
      'coverage',
      'next-env.d.ts',
      'playwright-report',
      'test-results',
    ],
  },

  js.configs.recommended,

  ...nextVitals,
  ...nextTs,

  // pinned: eslint-plugin-react crashes on eslint 10 while detecting react
  { settings: { react: { version: '19.2' } } },

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: { perfectionist },

    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'react',
            'next',
            [
              'value-builtin',
              'value-external',
              'type-builtin',
              'type-external',
            ],
            ['value-internal', 'type-internal'],
            ['value-parent', 'type-parent'],
            ['value-sibling', 'type-sibling'],
            ['value-index', 'type-index'],
            'side-effect',
            'unknown',
          ],
          customGroups: [
            { groupName: 'react', elementNamePattern: '^react$|^react-dom' },
            {
              groupName: 'next',
              elementNamePattern: '^next$|^next/|^next-intl',
            },
          ],
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  eslintConfigPrettier,
);
