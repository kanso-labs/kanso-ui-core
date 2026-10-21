import eslintJs from '@eslint/js'
import eslintPluginOxlint from 'eslint-plugin-oxlint'
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default defineConfig([
  // `.claude/worktrees/` holds per-session checkouts of this repository, so
  // without this ESLint lints every other branch alongside the current one.
  // Flat config does not read .gitignore the way oxlint and oxfmt do, so it
  // has to be named here, and so does what the token build, the build and the
  // tests write.
  globalIgnores([
    '.claude',
    'coverage',
    'dist',
    'src/tokens/defaults.ts',
    'src/tokens/design.tokens.css',
  ]),
  {
    extends: [
      eslintJs.configs.recommended,
      typescriptEslint.configs.recommended,
      eslintPluginPerfectionist.configs['recommended-natural'],
    ],
    files: ['**/*.{cjs,js,mjs,ts}'],
    languageOptions: {
      ecmaVersion: 2023,
    },
  },
  // The configuration files at the root, the scripts and the tests run under
  // Node. The package itself is read by a browser, Hermes and Node alike, so
  // it gets none of their globals.
  {
    files: ['*.{cjs,js,ts}', 'scripts/**/*.mjs', 'src/**/*.test.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  ...eslintPluginOxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
])
