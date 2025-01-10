import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: [`**/*.{js,mjs,cjs,ts}`] },
  { ignores: [`node_modules/`] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': `warn`,
      'semi': [`error`, `never`],
      'quotes': [`error`, `backtick`],
      'eol-last': [`error`, `always`],
      'linebreak-style': [`error`, `unix`],
      'max-len': [`error`, {
        "ignoreComments": true,
        "ignoreTrailingComments": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true,
        "ignoreUrls": true,
        "code": 80
      }],
      'no-empty': `warn`,
      'no-empty-function': `warn`,
      'no-var': `error`,
      'camelcase': [`error`, { "properties": `never`, "ignoreDestructuring": true }],
      'func-style': [`error`, `declaration`, { "allowArrowFunctions": true }],
      'func-call-spacing': [`error`, `never`],
      'indent': [`error`, 2],
      'block-spacing': [`error`, `always`],
      'no-trailing-spaces': [`error`, { "skipBlankLines": true, "ignoreComments": true }],
      'no-mixed-spaces-and-tabs': [`error`, `smart-tabs`],
      'sort-imports': [`error`, {
        'ignoreCase': true,
        'ignoreDeclarationSort': true,
        'ignoreMemberSort': true,
        'memberSyntaxSortOrder': [`all`, `single`, `multiple`, `none`],
        'allowSeparatedGroups': true
      }],
      '@typescript-eslint/no-unused-vars': `warn`,
      '@typescript-eslint/no-explicit-any': `off`,
    }
  },
]
