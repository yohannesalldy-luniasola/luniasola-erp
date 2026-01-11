import type { Linter } from 'eslint'

import pluginStylistic                 from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import configNextCoreWebVitals         from 'eslint-config-next/core-web-vitals'
import configNextTypeScript            from 'eslint-config-next/typescript'
import pluginAlignAssignments          from 'eslint-plugin-align-assignments'
import pluginAlignImport               from 'eslint-plugin-align-import'
import pluginBetterTailwindCSS         from 'eslint-plugin-better-tailwindcss'
import pluginImport                    from 'eslint-plugin-import'
import configTypeScript                from 'typescript-eslint'

const config: Linter.Config[] = defineConfig([ ...configNextCoreWebVitals, ...configNextTypeScript, ...configTypeScript.configs.recommended, globalIgnores([ '.next/**', 'build/**', 'next-env.d.ts', 'node_modules/**', 'out/**', 'vendor/**' ]), {
	files : [ 
		'**/*.{ts,tsx}', 
	] satisfies Linter.Config['files'],
	plugins : {
		'@stylistic'         : pluginStylistic,
		'align-assignments'  : pluginAlignAssignments,
		'align-import'       : pluginAlignImport,
		'better-tailwindcss' : pluginBetterTailwindCSS,
		'import'             : pluginImport,
	} satisfies Linter.Config['plugins'],
	rules : {
		'@stylistic/array-bracket-spacing'                         : [ 'error', 'always' ],
		'@stylistic/comma-dangle'                                  : [ 'error', 'always-multiline' ],
		'@stylistic/indent'                                        : [ 'error', 'tab' ],
		'@stylistic/jsx-closing-tag-location'                      : [ 'error' ],
		'@stylistic/jsx-curly-brace-presence'                      : [ 'error', { 'props' : 'always', 'propElementValues' : 'always', 'children' : 'never' } ],
		'@stylistic/jsx-curly-spacing'                             : [ 'error', { 'when' : 'never', 'children' : true } ],
		'@stylistic/jsx-pascal-case'                               : [ 'error', { 'allowAllCaps' : true } ],
		'@stylistic/jsx-props-no-multi-spaces'                     : [ 'error' ],
		'@stylistic/jsx-sort-props'                                : [ 'error', { 'shorthandLast' : true, 'callbacksLast' : true } ],
		'@stylistic/jsx-tag-spacing'                               : [ 'error', { 'beforeSelfClosing' : 'always', 'beforeClosing' : 'never' } ],
		'@stylistic/key-spacing'                                   : [ 'error', { 'beforeColon' : true, 'afterColon' : true, 'align' : 'colon' } ],
		'@stylistic/no-mixed-spaces-and-tabs'                      : [ 'error' ],
		'@stylistic/no-multiple-empty-lines'                       : [ 'error', { 'max' : 1, 'maxBOF' : 0, 'maxEOF' : 0 } ],
		'@stylistic/no-whitespace-before-property'                 : [ 'error' ],
		'@stylistic/padding-line-between-statements'               : [ 'error', { 'blankLine' : 'always', 'prev' : '*', 'next' : 'return' } ],
		'@stylistic/quotes'                                        : [ 'error', 'single' ],
		'@stylistic/semi'                                          : [ 'error', 'never' ],
		'@typescript-eslint/no-unused-expressions'                 : [ 'off' ],
		'align-import/align-import'                                : [ 'error' ],
		'better-tailwindcss/enforce-consistent-class-order'        : [ 'error' ],
		'better-tailwindcss/enforce-consistent-variable-syntax'    : [ 'error' ],
		'better-tailwindcss/enforce-consistent-important-position' : [ 'error' ],
		'better-tailwindcss/enforce-shorthand-classes'             : [ 'error' ],
		'better-tailwindcss/no-duplicate-classes'                  : [ 'error' ],
		'better-tailwindcss/no-unnecessary-whitespace'             : [ 'error' ],
		'better-tailwindcss/no-deprecated-classes'                 : [ 'error' ],
		'better-tailwindcss/no-unregistered-classes'               : [ 'error', { 'ignore' : [ 'toaster' ] } ],
		'better-tailwindcss/no-conflicting-classes'                : [ 'error' ],
		'better-tailwindcss/no-restricted-classes'                 : [ 'error' ],
		'eol-last'                                                 : [ 'error', 'always' ],
		'import/order'                                             : [ 'error', {
			'alphabetize' : { 'order' : 'asc', 'caseInsensitive' : true },
			'groups'      : [ 'type', 'builtin', 'external', 'internal' ],
			'pathGroups'  : [
				{ 'pattern' : 'next/*', 'group' : 'external', 'position' : 'before' },
				{ 'pattern' : '@next/**/*', 'group' : 'external', 'position' : 'before' },
				{ 'pattern' : 'react',  'group' : 'external', 'position' : 'before' },
				{ 'pattern' : '@/**',   'group' : 'internal', 'position' : 'after' },
			],
			'pathGroupsExcludedImportTypes' : [ 'next', 'react', 'type' ],
			'newlines-between'              : 'always',
		} ],
		'no-alert'          : [ 'error' ],
		'no-console'        : [ 'error', { 'allow' : [ 'error' ] } ],
		'no-useless-concat' : [ 'off' ],
		'prefer-template'   : [ 'off' ],
	} satisfies Linter.RulesRecord,
	settings : {
		'better-tailwindcss' : {
			'entryPoint' : 'app/asset/style/tailwind.css',
			'callees'    : [ 'classNames', 'clsx', 'cva' ],
		},
	} satisfies Linter.Config['settings'],
} ])

export default config
