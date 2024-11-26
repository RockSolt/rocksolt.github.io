import globals from 'globals'
import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  stylistic.configs['recommended-flat'],
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      '@stylistic': stylistic,
    },
  },
  pluginJs.configs.recommended,
]
